import { siteConfig } from "@/lib/site";

export function JsonLdScript({ data }: { data: object }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(data).replace(/</g, "\\u003c"),
            }}
        />
    );
}

export default function JsonLd() {
    const url = siteConfig.url;

    const data = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "JewelryStore",
                "@id": `${url}/#store`,
                name: siteConfig.nameEn,
                alternateName: [siteConfig.name, "Amalia Jewelry"],
                slogan: siteConfig.tagline,
                description: siteConfig.description,
                url,
                logo: `${url}/images/icon-512.png`,
                image: `${url}/opengraph-image.jpg`,
                telephone: siteConfig.contact.phone,
                currenciesAccepted: siteConfig.currency,
                paymentAccepted: siteConfig.payments.join(", "),
                priceRange: "SAR 400 - 2400",
                address: {
                    "@type": "PostalAddress",
                    addressLocality: "الرياض",
                    addressCountry: "SA",
                },
                areaServed: { "@type": "Country", name: "Saudi Arabia" },
                sameAs: Object.values(siteConfig.social),
            },
            {
                "@type": "WebSite",
                "@id": `${url}/#website`,
                url,
                name: siteConfig.name,
                alternateName: siteConfig.nameEn,
                inLanguage: "ar",
                publisher: { "@id": `${url}/#store` },
                potentialAction: {
                    "@type": "SearchAction",
                    target: `${url}/search?q={search_term_string}`,
                    "query-input": "required name=search_term_string",
                },
            },
        ],
    };

    return <JsonLdScript data={data} />;
}
