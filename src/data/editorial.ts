/**
 * Home page editorial content (collections bento, story chapters, lookbook).
 */

export type Collection = {
    id: string;
    title: string;
    description: string;
    href: string;
    image?: string;
    alt?: string;
    /** CSS object-position; keeps the piece clear of the card text, which sits bottom-right. */
    imagePosition?: string;
};

export const collections: Collection[] = [
    {
        id: "women",
        title: "للنساء",
        description: "قطع ذهب تكمّل إطلالتك اليومية وأجمل مناسباتك",
        href: "/shop/women",
        image: "/images/collection-women-necklace.webp",
        alt: "سلسال ذهبي بدلاية عقدة مرصعة بحجر لامع من أماليا على خلفية خضراء",
        imagePosition: "65% 50%",
    },
    {
        id: "kids",
        title: "للأطفال",
        description: "أول ذهب في حياة صغيرتك",
        href: "/shop/kids",
        image: "/images/kids-bracelet.webp",
        alt: "طفلة مبتسمة تسند وجهها بيديها وترتدي إسوارة ذهبية بزهرة الصدف من أماليا",
        imagePosition: "50% 36%",
    },
    {
        id: "newborn",
        title: "أقراط المواليد",
        description: "بلون حجر شهر الميلاد",
        href: "/shop/newborn",
        image: "/images/collection-newborn-earrings.webp",
        alt: "قرطان ذهبيان للمواليد بقفل لولبي وحجر أزرق فاتح من أماليا",
        imagePosition: "62% 50%",
    },
    {
        id: "earrings",
        title: "أقراط",
        description: "مريحة وآمنة، بتفاصيل تلمع",
        href: "/shop/earrings",
        image: "/images/collection-earrings.webp",
        alt: "قرطان ذهبيان بحلقة مجدولة وحجرين لامعين من أماليا على منصة خضراء",
        imagePosition: "62% 50%",
    },
    {
        id: "gifts",
        title: "الهدايا",
        description: "لكِ ولمن تحبين، ولكل بداية جميلة",
        href: "/#gifts",
        image: "/images/collection-gift-bracelet.webp",
        alt: "إسوارة ذهبية بزهرة وردية داخل علبة هدايا خضراء من أماليا",
    },
];

export const storyChapters = [
    {
        id: "legacy",
        eyebrow: "البداية",
        title: "ذهب لكِ، وأول ذهب لصغيرتك",
        body: "بدأت أماليا بأولى قطع الذهب في حياة الصغيرات، واليوم نصوغ لكِ أنتِ أيضًا؛ قطع تجمع الأناقة والدفء، تلبسينها كل يوم وتشاركين بريقها مع ابنتك.",
        image: "/images/story-pearl-necklace.webp",
        alt: "سلسال ذهب رقيق بلؤلؤة وكرتين ذهبيتين من أماليا معلّق على منحنى أخضر",
    },
    {
        id: "safety",
        eyebrow: "الأمان",
        title: "مصممة للبشرة الحساسة",
        body: "ذهب عيار 18 بخامات عالية الجودة، وحواف ناعمة، وأقراط مريحة للأذن، لتُلبس كل يوم براحة تامة — لكِ ولصغيرتك.",
        image: "/images/collection-newborn-earrings.webp",
        alt: "قرطان ذهبيان صغيران بقفل لولبي آمن وحجر أزرق فاتح من أماليا",
    },
    {
        id: "craft",
        eyebrow: "الحِرفة",
        title: "صناعة أوروبية بإتقان",
        body: "تُصنع مجوهراتنا في أوروبا المعروفة بحرفيتها العريقة، ولأن كل قطعة تُصاغ بعناية فقد يختلف وزنها أو صياغتها قليلًا — فكل قطعة فريدة.",
        image: "/images/story-ring.webp",
        alt: "خاتم ذهب مرصع بأحجار لامعة من أماليا على سطح أخضر",
    },
    {
        id: "gift",
        eyebrow: "الهدية",
        title: "ذكرى تكبر معها",
        body: "للسبوع وأعياد الميلاد والمناسبات الخاصة؛ قطعة صغيرة تحمل حبًا كبيرًا، وتبقى ذكرى لا تُنسى.",
        image: "/images/story-gift-box.webp",
        alt: "إسوارة ذهب رقيقة داخل علبة هدايا خضراء تحمل شعار أماليا",
    },
];

export const lookbook = [
    {
        image: "/images/kids-necklace.webp",
        title: "إطلالة الأميرة",
        alt: "طفلة بفستان وردي مطرز ترتدي سلسال ذهب من أماليا",
    },
    {
        image: "/images/kids-earrings.webp",
        title: "لمعة ناعمة",
        alt: "طفلة ترتدي قرطًا ذهبيًا من أماليا",
    },
    {
        image: "/images/kids-bracelet.webp",
        title: "زهرة على المعصم",
        alt: "طفلة ترتدي إسوارة ذهب بزهرة الصدف",
    },
    {
        image: "/images/gift-satin-earrings.webp",
        title: "فن الإهداء",
        alt: "أقراط الفيونكة الذهبية من أماليا على ساتان أخضر",
    },
    {
        image: "/images/detail-flowers.webp",
        title: "لمسة رقيقة",
        alt: "زهور بيضاء ناعمة بجانب شريط ساتان أخضر بأيقونة أماليا الذهبية",
    },
];
