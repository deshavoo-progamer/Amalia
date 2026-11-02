import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import sharp from "sharp";

export type StoredImage = { url: string; width: number; height: number; blur: string };

const MAX_BYTES = 8 * 1024 * 1024;

/**
 * Optimises an uploaded product photo and stores it.
 * - "photo": the main product shot (1000px WebP + blur placeholder).
 * - "cutout": an optional transparent PNG/WebP shown floating in the niches (800px, alpha kept).
 * Vercel Blob in production (BLOB_READ_WRITE_TOKEN); public/uploads during local development.
 */
export async function storeProductImage(file: File, kind: "photo" | "cutout"): Promise<StoredImage> {
    if (!file.type.startsWith("image/")) throw new Error("الملف المرفوع ليس صورة.");
    if (file.size > MAX_BYTES) throw new Error("حجم الصورة أكبر من 8 ميجابايت.");

    const input = Buffer.from(await file.arrayBuffer());
    const pipeline = sharp(input).rotate().resize({ width: kind === "photo" ? 1000 : 800, withoutEnlargement: true });
    const { data, info } = await (kind === "photo"
        ? pipeline.webp({ quality: 82 })
        : pipeline.webp({ quality: 82, alphaQuality: 90 })
    ).toBuffer({ resolveWithObject: true });

    const blurBuffer = await sharp(data).resize(12).webp({ quality: 40 }).toBuffer();
    const blur = `data:image/webp;base64,${blurBuffer.toString("base64")}`;
    const name = `${kind}-${randomUUID()}.webp`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(`products/${name}`, data, { access: "public", contentType: "image/webp" });
        return { url: blob.url, width: info.width, height: info.height, blur };
    }

    if (process.env.NODE_ENV === "production") {
        throw new Error("تخزين الصور غير مُفعّل: أضيفي BLOB_READ_WRITE_TOKEN في إعدادات Vercel.");
    }

    const directory = path.join(process.cwd(), "public", "uploads");
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, name), data);
    return { url: `/uploads/${name}`, width: info.width, height: info.height, blur };
}
