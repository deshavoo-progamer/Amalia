export const siteConfig = {
    name: "أماليا للمجوهرات",
    nameEn: "Amalia Jewellery",
    tagline: "Elegance in every touch",
    taglineAr: "أناقة في كل لمسة",
    description:
        "أماليا للمجوهرات — ذهب عيار 18 لكِ ولصغيرتك بحرفية أوروبية: أقراط وسلاسل وأساور للنساء والأطفال وهدايا المواليد، مع شحن لجميع مناطق المملكة.",
    // Set NEXT_PUBLIC_SITE_URL once the final domain is live; on Vercel it falls back to the project's production domain.
    url:
        process.env.NEXT_PUBLIC_SITE_URL ??
        (process.env.VERCEL_PROJECT_PRODUCTION_URL
            ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
            : "http://localhost:3000"),
    locale: "ar_SA",
    currency: "SAR",
    keywords: [
        "أماليا للمجوهرات",
        "مجوهرات أماليا",
        "Amalia Jewellery",
        "Amalia Jewelry",
        "مجوهرات ذهب",
        "مجوهرات نسائية",
        "ذهب عيار 18",
        "مجوهرات أطفال",
        "ذهب أطفال",
        "حلق أطفال",
        "أقراط آمنة للأطفال",
        "أقراط مواليد",
        "أساور بيبي",
        "سلاسل ذهب بنات",
        "هدايا مواليد",
        "هدايا فاخرة للأطفال",
        "هدايا للأم",
        "Baby Jewelry",
    ],
    contact: {
        phone: "+966540592999",
        whatsapp: "966540592999",
    },
    social: {
        instagram: "https://www.instagram.com/babyamalia_jewelry",
        tiktok: "https://www.tiktok.com/@baby.amalia.jewel",
        snapchat: "https://www.snapchat.com/add/babyamalia_sa",
    },
    shipping: {
        days: "3 إلى 5 أيام عمل",
        pickup: 16,
        delivery: 24,
    },
    payments: ["مدى", "Visa", "Mastercard", "Apple Pay", "STC Pay"],
    colors: {
        green: "#11312c",
        gold: "#c6a575",
        ivory: "#f2efeb",
    },
};

export type SiteConfig = typeof siteConfig;

export function whatsappLink(message: string) {
    return `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Default "I have a question" chat used by the header, footer and contact page. */
export const contactWhatsappUrl = whatsappLink("مرحبا، عندي استفسار من متجر أماليا");

export function absoluteUrl(path = "/") {
    return new URL(path, siteConfig.url).toString();
}
