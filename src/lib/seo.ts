import type { Metadata } from "next";

import { siteConfig } from "./site";

type PageMetadataInput = {
    title: string;
    description: string;
    path: string;
    image?: { url: string; width?: number; height?: number; alt?: string };
};

const defaultImage = {
    url: "/opengraph-image.jpg",
    width: 1200,
    height: 630,
    alt: `${siteConfig.name} ${siteConfig.nameEn} — مجوهرات ذهب للنساء والأطفال`,
};

/**
 * Per-page metadata with canonical, Open Graph and Twitter in one place.
 * A page's `openGraph` replaces the layout's entirely in Next.js, so every page
 * must restate the image and site fields — this helper guarantees it.
 */
export function pageMetadata({ title, description, path, image = defaultImage }: PageMetadataInput): Metadata {
    return {
        title,
        description,
        alternates: { canonical: path },
        openGraph: {
            type: "website",
            locale: siteConfig.locale,
            siteName: siteConfig.name,
            url: path,
            title,
            description,
            images: [image],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image.url],
        },
    };
}
