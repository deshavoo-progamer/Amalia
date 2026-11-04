import ShopView from "@/components/shop/ShopView";
import { getProducts } from "@/data/catalog";
import { pageMetadata } from "@/lib/seo";

const title = "جميع المجوهرات";
const description =
    "تسوقي مجوهرات ذهب عيار 18 لكِ ولصغيرتك: أقراط وسلاسل وأساور للنساء والأطفال وهدايا المواليد، مع شحن لجميع مناطق المملكة.";

export const metadata = pageMetadata({ title: "المتجر — مجوهرات ذهب للنساء والأطفال", description, path: "/shop" });

export default async function ShopPage() {
    const products = await getProducts();

    return (
        <ShopView
            eyebrow="المتجر"
            image={{ src: "/images/gift-satin-bracelet.webp", alt: "إسوارة زهرة الكاميليا الذهبية من أماليا على ساتان أخضر" }}
            title={title}
            description={description}
            breadcrumbs={[{ label: "المتجر", href: "/shop" }]}
            products={products}
        />
    );
}
