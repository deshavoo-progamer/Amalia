/**
 * Catalog types and category metadata. Kept free of the product JSON so client components stay light.
 */

/** Who a piece is designed for. Baby Amalia dresses women and children. */
export type Audience = "women" | "kids";

/** Piece types (shared by both audiences). */
export type ProductType = "earrings" | "necklaces" | "bracelets";

/** Every shop listing: the two audiences, the piece types, and the newborn edit. */
export type CategoryKey = Audience | ProductType | "newborn";

export type Product = {
    id: string;
    slug: string;
    name: string;
    category: ProductType;
    audience: Audience;
    collections: string[];
    price: number;
    regularPrice: number;
    available: boolean;
    image: string;
    width: number;
    height: number;
    blur: string;
    /** Background-free photo (transparent WebP) used inside the boutique niches. */
    cutout?: string;
    code?: string;
    karat?: number;
    weight?: number;
    story?: string;
    care?: string;
};

export type Category = {
    key: CategoryKey;
    title: string;
    titleEn: string;
    description: string;
    seoTitle: string;
    image?: string;
    alt?: string;
};

export const categories: Category[] = [
    {
        key: "women",
        title: "للنساء",
        titleEn: "For Her",
        description:
            "قطع ذهب عيار 18 بتصاميم راقية تكمّل إطلالتك اليومية وأجمل مناسباتك، بحرفية أوروبية تدوم معكِ.",
        seoTitle: "مجوهرات ذهب نسائية عيار 18",
        image: "/images/hero-satin.webp",
        alt: "ساتان أخضر عميق بلمعة ناعمة — هوية بيبي أماليا",
    },
    {
        key: "kids",
        title: "للأطفال",
        titleEn: "For Little Ones",
        description:
            "أول ذهب في حياة صغيرتك: أقراط وسلاسل وأساور عيار 18 آمنة على البشرة الحساسة، بتصاميم تكبر معها.",
        seoTitle: "مجوهرات ذهب للأطفال والبنات",
        image: "/images/kids-necklace.webp",
        alt: "طفلة بفستان وردي ترتدي سلسال ذهب من بيبي أماليا",
    },
    {
        key: "earrings",
        title: "أقراط",
        titleEn: "Earrings",
        description:
            "أقراط ذهب عيار 18 مريحة وآمنة على البشرة، بتصاميم القلب والفراشة والزهور والكريستال.",
        seoTitle: "أقراط ذهب عيار 18",
        image: "/images/kids-earrings.webp",
        alt: "قرط ذهبي صغير من بيبي أماليا",
    },
    {
        key: "necklaces",
        title: "قلائد",
        titleEn: "Necklaces",
        description:
            "سلاسل ذهب رقيقة بتعليقات الفراشة والقلب والصدف الطبيعي، قطع تُلبس كل يوم وتُهدى في كل مناسبة.",
        seoTitle: "سلاسل وقلائد ذهب عيار 18",
        image: "/images/gift-satin-necklace.webp",
        alt: "سلسال الفراشة الذهبي من بيبي أماليا على ساتان أخضر",
    },
    {
        key: "bracelets",
        title: "أساور",
        titleEn: "Bracelets",
        description:
            "أساور ذهب ناعمة مزينة بالزهور والتاج والأحجار الكريمة، تفاصيل صغيرة بحضور كبير.",
        seoTitle: "أساور ذهب عيار 18",
        image: "/images/kids-bracelet.webp",
        alt: "إسوارة ذهب بزهرة الصدف من بيبي أماليا",
    },
    {
        key: "newborn",
        title: "أقراط المواليد",
        titleEn: "Newborn",
        description:
            "أقراط ذهب لحديثي الولادة بلون حجر شهر الميلاد، رقيقة وآمنة على بشرة المواليد — أجمل هدية للسبوع.",
        seoTitle: "أقراط ذهب لحديثي الولادة بحجر شهر الميلاد",
        image: "/images/newborn-satin.webp",
        alt: "قرطان ذهبيان لحديثي الولادة بحجر أزرق لشهر سبتمبر على ساتان أخضر",
    },
];

export function getCategory(key: string) {
    return categories.find((category) => category.key === key);
}

export function productAlt(product: Product) {
    return `${product.name} من بيبي أماليا${product.karat ? ` — ذهب عيار ${product.karat}` : ""}`;
}
