"use client";

import { useActionState, useState } from "react";
import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react";

import { deleteProduct, saveProduct, type ProductFormState } from "@/app/admin/products/actions";
import { cn } from "@/lib/cn";

export type ProductFormValues = {
    id?: string;
    name: string;
    audience: "women" | "kids";
    category: "earrings" | "necklaces" | "bracelets";
    price?: number;
    karat?: number | null;
    weight?: number | null;
    code?: string | null;
    story?: string | null;
    care?: string | null;
    newborn: boolean;
    available: boolean;
    published: boolean;
    featured: boolean;
    image?: string;
    cutout?: string | null;
};

const fieldClass =
    "mt-2 w-full rounded-xl border border-forest/20 bg-white px-4 py-3 text-base text-forest outline-none transition-colors focus:border-gold aria-[invalid=true]:border-red-700";

function Field({ label, name, error, hint, children }: { label: string; name: string; error?: string; hint?: string; children: React.ReactNode }) {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-forest">
                {label}
            </label>
            {children}
            {error ? (
                <p id={`${name}-error`} className="mt-1.5 text-sm text-red-800">{error}</p>
            ) : (
                hint && <p className="mt-1.5 text-xs text-forest/70">{hint}</p>
            )}
        </div>
    );
}

function ImageInput({ name, label, hint, current, error, transparent }: { name: string; label: string; hint: string; current?: string | null; error?: string; transparent?: boolean }) {
    const [preview, setPreview] = useState<string | null>(null);
    const shown = preview ?? current;

    return (
        <div>
            <span className="block text-sm font-medium text-forest">{label}</span>
            <label
                htmlFor={name}
                className={cn(
                    "relative mt-2 grid aspect-square cursor-pointer place-items-center overflow-hidden rounded-2xl border border-dashed transition-colors hover:border-gold",
                    transparent ? "bg-forest-deep" : "bg-white",
                    error ? "border-red-700" : "border-forest/25"
                )}
            >
                {shown ? (
                    // Local previews are blob: URLs, so a plain img is used here.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={shown} alt="" className={cn("absolute inset-0 size-full", transparent ? "object-contain p-6" : "object-cover")} />
                ) : (
                    <span className={cn("flex flex-col items-center gap-2 text-sm", transparent ? "text-ivory/70" : "text-forest/70")}>
                        <ImagePlus size={28} strokeWidth={1.2} />
                        اختاري صورة
                    </span>
                )}
                <input
                    id={name}
                    name={name}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    aria-invalid={Boolean(error)}
                    onChange={(event) => {
                        const file = event.target.files?.[0];
                        setPreview(file ? URL.createObjectURL(file) : null);
                    }}
                />
            </label>
            {error ? <p className="mt-1.5 text-sm text-red-800">{error}</p> : <p className="mt-1.5 text-xs text-forest/70">{hint}</p>}
        </div>
    );
}

export default function ProductForm({ initial }: { initial: ProductFormValues }) {
    const [state, formAction, saving] = useActionState<ProductFormState, FormData>(saveProduct, undefined);
    const errors = state?.fieldErrors ?? {};
    const isEdit = Boolean(initial.id);

    return (
        <form action={formAction} className="grid gap-10 xl:grid-cols-[1fr_22rem]" noValidate>
            {initial.id && <input type="hidden" name="id" value={initial.id} />}

            <div className="space-y-6 rounded-2xl border border-forest/10 bg-white p-6 sm:p-8">
                <Field label="اسم القطعة" name="name" error={errors.name}>
                    <input id="name" name="name" defaultValue={initial.name} required className={fieldClass} aria-invalid={Boolean(errors.name)} />
                </Field>

                <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="الفئة" name="audience" error={errors.audience}>
                        <select id="audience" name="audience" defaultValue={initial.audience} className={fieldClass}>
                            <option value="women">للنساء</option>
                            <option value="kids">للأطفال</option>
                        </select>
                    </Field>
                    <Field label="النوع" name="category" error={errors.category}>
                        <select id="category" name="category" defaultValue={initial.category} className={fieldClass}>
                            <option value="earrings">أقراط</option>
                            <option value="necklaces">قلائد</option>
                            <option value="bracelets">أساور</option>
                        </select>
                    </Field>
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                    <Field label="السعر (ر.س)" name="price" error={errors.price}>
                        <input id="price" name="price" type="number" inputMode="numeric" min={1} step={1} defaultValue={initial.price} className={fieldClass} aria-invalid={Boolean(errors.price)} />
                    </Field>
                    <Field label="العيار" name="karat" error={errors.karat} hint="مثال: 18">
                        <input id="karat" name="karat" type="number" inputMode="numeric" defaultValue={initial.karat ?? ""} className={fieldClass} />
                    </Field>
                    <Field label="الوزن (جرام)" name="weight" error={errors.weight}>
                        <input id="weight" name="weight" type="number" inputMode="decimal" step="0.01" defaultValue={initial.weight ?? ""} className={fieldClass} />
                    </Field>
                </div>

                <Field label="رمز القطعة" name="code" hint="اختياري — يظهر في صفحة المنتج ويساعد في البحث">
                    <input id="code" name="code" dir="ltr" defaultValue={initial.code ?? ""} className={fieldClass} />
                </Field>

                <Field label="الوصف" name="story" error={errors.story}>
                    <textarea id="story" name="story" rows={4} defaultValue={initial.story ?? ""} className={fieldClass} />
                </Field>

                <Field label="تعليمات العناية" name="care" hint="اختياري — يظهر نص عام إن تُرك فارغًا">
                    <textarea id="care" name="care" rows={3} defaultValue={initial.care ?? ""} className={fieldClass} />
                </Field>
            </div>

            <div className="space-y-6">
                <div className="space-y-6 rounded-2xl border border-forest/10 bg-white p-6">
                    <ImageInput name="photo" label="صورة القطعة" hint="JPG أو PNG أو WebP حتى 8 ميجابايت — تُحسَّن تلقائيًا." current={initial.image} error={errors.photo} />
                    <ImageInput name="cutout" label="صورة بدون خلفية (اختياري)" hint="PNG شفافة تظهر طافية داخل نيش البوتيك." current={initial.cutout} transparent />
                    {initial.cutout && (
                        <label className="flex items-center gap-2 text-sm text-forest/80">
                            <input type="checkbox" name="removeCutout" className="size-4 accent-forest" />
                            إزالة الصورة بدون خلفية
                        </label>
                    )}
                </div>

                <fieldset className="space-y-3 rounded-2xl border border-forest/10 bg-white p-6">
                    <legend className="sr-only">خيارات العرض</legend>
                    {[
                        { name: "available", label: "متوفر للطلب", checked: initial.available },
                        { name: "published", label: "ظاهر في المتجر", checked: initial.published },
                        { name: "featured", label: "ضمن مختارات البوتيك في الرئيسية", checked: initial.featured },
                        { name: "newborn", label: "ضمن «أقراط المواليد»", checked: initial.newborn },
                    ].map((option) => (
                        <label key={option.name} className="flex min-h-11 items-center gap-3 text-sm text-forest">
                            <input type="checkbox" name={option.name} defaultChecked={option.checked} className="size-5 accent-forest" />
                            {option.label}
                        </label>
                    ))}
                </fieldset>

                {state?.error && (
                    <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-900">
                        {state.error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={saving}
                    className="flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-forest px-6 text-[0.9375rem] font-medium text-ivory transition-colors hover:bg-forest-deep disabled:opacity-60"
                >
                    {saving && <LoaderCircle size={18} className="animate-spin" />}
                    {saving ? "جارٍ الحفظ…" : isEdit ? "حفظ التعديلات" : "إضافة القطعة"}
                </button>

                {initial.id && (
                    <button
                        type="submit"
                        formAction={async () => {
                            if (window.confirm(`حذف «${initial.name}» نهائيًا من المتجر؟`)) await deleteProduct(initial.id!);
                        }}
                        formNoValidate
                        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-red-800/30 px-6 text-sm text-red-900 transition-colors hover:bg-red-50"
                    >
                        <Trash2 size={16} strokeWidth={1.5} />
                        حذف القطعة
                    </button>
                )}
            </div>
        </form>
    );
}
