"use server";

import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/db";
import { product } from "@/db/schema";
import { requireAdmin, revalidateCatalog } from "@/lib/admin";
import { storeProductImage } from "@/lib/storage";

export type ProductFormState = { error?: string; fieldErrors?: Record<string, string> } | undefined;

const optionalNumber = z.preprocess(
    (value) => (value === "" || value == null ? undefined : Number(value)),
    z.number().positive("أدخلي رقمًا أكبر من صفر").optional()
);

const productInput = z.object({
    name: z.string().trim().min(2, "اكتبي اسم القطعة").max(120, "الاسم طويل جدًا"),
    audience: z.enum(["women", "kids"], { message: "اختاري الفئة" }),
    category: z.enum(["earrings", "necklaces", "bracelets"], { message: "اختاري النوع" }),
    price: z.coerce.number({ message: "أدخلي السعر" }).int("السعر بالريال بدون كسور").positive("السعر يجب أن يكون أكبر من صفر"),
    karat: optionalNumber,
    weight: optionalNumber,
    code: z.string().trim().max(40).optional(),
    story: z.string().trim().max(2000).optional(),
    care: z.string().trim().max(1000).optional(),
    newborn: z.boolean(),
    available: z.boolean(),
    published: z.boolean(),
    featured: z.boolean(),
});

function slugify(name: string) {
    const base = name
        .replace(/[ً-ْ]/g, "")
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .trim()
        .replace(/\s+/g, "-");
    return `${base}-${randomBytes(4).toString("hex")}`;
}

const imageFile = (formData: FormData, field: string) => {
    const file = formData.get(field);
    return file instanceof File && file.size > 0 ? file : null;
};

/** Create (no id) or update a product. Re-checks admin rights on every call. */
export async function saveProduct(_previous: ProductFormState, formData: FormData): Promise<ProductFormState> {
    await requireAdmin("/admin/products");

    const id = String(formData.get("id") ?? "") || null;
    const parsed = productInput.safeParse({
        name: formData.get("name"),
        audience: formData.get("audience"),
        category: formData.get("category"),
        price: formData.get("price"),
        karat: formData.get("karat"),
        weight: formData.get("weight"),
        code: formData.get("code") || undefined,
        story: formData.get("story") || undefined,
        care: formData.get("care") || undefined,
        newborn: formData.get("newborn") === "on",
        available: formData.get("available") === "on",
        published: formData.get("published") === "on",
        featured: formData.get("featured") === "on",
    });

    if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
        return { error: "راجعي الحقول المظللة.", fieldErrors };
    }

    const data = parsed.data;
    const photo = imageFile(formData, "photo");
    const cutout = imageFile(formData, "cutout");
    if (!id && !photo) return { error: "أضيفي صورة القطعة.", fieldErrors: { photo: "الصورة مطلوبة" } };

    try {
        const storedPhoto = photo ? await storeProductImage(photo, "photo") : null;
        const storedCutout = cutout ? await storeProductImage(cutout, "cutout") : null;

        const values = {
            name: data.name,
            audience: data.audience,
            category: data.category,
            collections: data.newborn ? ["newborn"] : [],
            price: data.price,
            regularPrice: data.price,
            karat: data.karat ?? null,
            weight: data.weight ?? null,
            code: data.code ?? null,
            story: data.story ?? null,
            care: data.care ?? null,
            available: data.available,
            published: data.published,
            featured: data.featured,
            updatedAt: new Date(),
            ...(storedPhoto && {
                image: storedPhoto.url,
                width: storedPhoto.width,
                height: storedPhoto.height,
                blur: storedPhoto.blur,
            }),
            ...(storedCutout && { cutout: storedCutout.url }),
            ...(formData.get("removeCutout") === "on" && !storedCutout && { cutout: null }),
        };

        if (id) {
            await db.update(product).set(values).where(eq(product.id, id));
        } else {
            await db.insert(product).values({
                ...values,
                id: randomBytes(8).toString("hex"),
                slug: slugify(data.name),
                image: storedPhoto!.url,
                width: storedPhoto!.width,
                height: storedPhoto!.height,
                blur: storedPhoto!.blur,
                sortOrder: 0,
            });
        }
    } catch (error) {
        return { error: error instanceof Error ? error.message : "تعذّر حفظ القطعة، حاولي مرة أخرى." };
    }

    revalidateCatalog();
    redirect("/admin/products?saved=1");
}

/** Quick toggles from the product list. */
export async function setProductFlag(id: string, flag: "available" | "published" | "featured", value: boolean) {
    await requireAdmin("/admin/products");
    await db.update(product).set({ [flag]: value, updatedAt: new Date() }).where(eq(product.id, id));
    revalidateCatalog();
}

export async function deleteProduct(id: string) {
    await requireAdmin("/admin/products");
    await db.delete(product).where(eq(product.id, id));
    revalidateCatalog();
    redirect("/admin/products?deleted=1");
}
