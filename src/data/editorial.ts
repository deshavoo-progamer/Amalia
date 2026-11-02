/**
 * Home page editorial content (collections bento, story chapters, lookbook).
 */

export type Collection = {
    id: string;
    title: string;
    titleEn: string;
    description: string;
    href: string;
    image?: string;
    alt?: string;
};

export const collections: Collection[] = [
    {
        id: "women",
        title: "للنساء",
        titleEn: "For Her",
        description: "قطع ذهب تكمّل إطلالتك اليومية وأجمل مناسباتك",
        href: "/shop/women",
        image: "/images/hero-satin.webp",
        alt: "ساتان أخضر عميق بلمعة ناعمة من هوية بيبي أماليا",
    },
    {
        id: "kids",
        title: "للأطفال",
        titleEn: "For Little Ones",
        description: "أول ذهب في حياة صغيرتك",
        href: "/shop/kids",
        image: "/images/kids-necklace.webp",
        alt: "طفلة بفستان وردي ترتدي سلسال ذهب رقيق من بيبي أماليا",
    },
    {
        id: "newborn",
        title: "أقراط المواليد",
        titleEn: "Birthstone",
        description: "بلون حجر شهر الميلاد",
        href: "/shop/newborn",
    },
    {
        id: "earrings",
        title: "أقراط",
        titleEn: "Earrings",
        description: "مريحة وآمنة، بتفاصيل تلمع",
        href: "/shop/earrings",
        image: "/images/kids-earrings.webp",
        alt: "قرط ذهبي ناعم من بيبي أماليا",
    },
    {
        id: "gifts",
        title: "الهدايا",
        titleEn: "Gifting",
        description: "لكِ ولمن تحبين، ولكل بداية جميلة",
        href: "/#gifts",
        image: "/images/gift-satin-bracelet.webp",
        alt: "إسوارة زهرة الكاميليا الذهبية من بيبي أماليا على ساتان أخضر",
    },
];

export const storyChapters = [
    {
        id: "legacy",
        eyebrow: "البداية",
        title: "ذهب لكِ، وأول ذهب لصغيرتك",
        body: "بدأت بيبي أماليا بأولى قطع الذهب في حياة الصغيرات، واليوم نصوغ لكِ أنتِ أيضًا؛ قطع تجمع الأناقة والدفء، تلبسينها كل يوم وتشاركين بريقها مع ابنتك.",
        image: "/images/kids-necklace.webp",
        alt: "طفلة مبتسمة ترتدي سلسال ذهب بتعليقة فراشة من بيبي أماليا",
    },
    {
        id: "safety",
        eyebrow: "الأمان",
        title: "مصممة للبشرة الحساسة",
        body: "ذهب عيار 18 بخامات عالية الجودة، وحواف ناعمة، وأقراط مريحة للأذن، لتُلبس كل يوم براحة تامة — لكِ ولصغيرتك.",
        image: "/images/kids-earrings.webp",
        alt: "طفلة ترتدي قرطًا ذهبيًا صغيرًا مريحًا للأذن",
    },
    {
        id: "craft",
        eyebrow: "الحِرفة",
        title: "صناعة أوروبية بإتقان",
        body: "تُصنع مجوهراتنا في أوروبا المعروفة بحرفيتها العريقة، ولأن كل قطعة تُصاغ بعناية فقد يختلف وزنها أو صياغتها قليلًا — فكل قطعة فريدة.",
        image: "/images/kids-bracelet.webp",
        alt: "إسوارة ذهب بزهرة الصدف على معصم طفلة",
    },
    {
        id: "gift",
        eyebrow: "الهدية",
        title: "ذكرى تكبر معها",
        body: "للسبوع وأعياد الميلاد والمناسبات الخاصة؛ قطعة صغيرة تحمل حبًا كبيرًا، وتبقى ذكرى لا تُنسى.",
        image: "/images/gift-satin-necklace.webp",
        alt: "سلسال الفراشة الذهبي من بيبي أماليا تحت ضوء دافئ على ساتان أخضر",
    },
];

export const lookbook = [
    {
        image: "/images/kids-necklace.webp",
        title: "إطلالة الأميرة",
        caption: "Little Princess",
        alt: "طفلة بفستان وردي مطرز ترتدي سلسال ذهب من بيبي أماليا",
    },
    {
        image: "/images/kids-earrings.webp",
        title: "لمعة ناعمة",
        caption: "Soft Shine",
        alt: "طفلة ترتدي قرطًا ذهبيًا من بيبي أماليا",
    },
    {
        image: "/images/kids-bracelet.webp",
        title: "زهرة على المعصم",
        caption: "Petite Bloom",
        alt: "طفلة ترتدي إسوارة ذهب بزهرة الصدف",
    },
    {
        image: "/images/gift-satin-earrings.webp",
        title: "فن الإهداء",
        caption: "Gifting",
        alt: "أقراط الفيونكة الذهبية من بيبي أماليا على ساتان أخضر",
    },
    {
        image: "/images/detail-flowers.webp",
        title: "لمسة رقيقة",
        caption: "Soft Touch",
        alt: "زهور بيضاء ناعمة بجانب شريط ساتان أخضر بأيقونة أماليا الذهبية",
    },
];
