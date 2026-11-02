import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import MagneticLink from "@/components/ui/MagneticLink";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import { contentPages, getContentPage } from "@/data/pages";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
    return contentPages.map((page) => ({ page: page.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[page]">): Promise<Metadata> {
    const page = getContentPage((await params).page);
    if (!page) return {};

    return pageMetadata({ title: page.title, description: page.description, path: `/${page.slug}` });
}

export default async function ContentPage({ params }: PageProps<"/[page]">) {
    const page = getContentPage((await params).page);
    if (!page) notFound();

    return (
        <main id="main-content">
            <PageHeader
                eyebrow={page.eyebrow}
                title={page.title}
                description={page.description}
                breadcrumbs={[{ label: page.eyebrow, href: `/${page.slug}` }]}
            />

            <div className="bg-ivory py-14 sm:py-20">
                <article className="amalia-prose mx-auto max-w-3xl px-4 sm:px-8">
                    {page.sections.map((section, index) => (
                        <Reveal key={section.heading ?? index} as="div" y={20}>
                            {section.heading && <h2>{section.heading}</h2>}
                            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                            {section.list && (
                                <ul>
                                    {section.list.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            )}
                        </Reveal>
                    ))}

                    <div className="mt-16 border-t border-forest/10 pt-10">
                        <MagneticLink href="/shop" variant="forest">
                            تسوقي المجموعة
                            <ArrowLeft size={18} strokeWidth={1.5} />
                        </MagneticLink>
                    </div>
                </article>
            </div>
        </main>
    );
}
