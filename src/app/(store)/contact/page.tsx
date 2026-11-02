import { ArrowLeft, Camera, Ghost, MessageCircle, Music2, Phone } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import { pageMetadata } from "@/lib/seo";
import { contactWhatsappUrl, siteConfig } from "@/lib/site";

const description =
    "يسعدنا تواصلك معنا للاستفسار عن القطع، أو طلب تخصيص بالاسم، أو متابعة طلبك — عبر واتساب أو الهاتف أو حساباتنا على التواصل الاجتماعي.";

export const metadata = pageMetadata({ title: "تواصلي معنا", description, path: "/contact" });

const channels = [
    {
        icon: MessageCircle,
        title: "واتساب",
        value: "أسرع طريقة للطلب والاستفسار",
        href: contactWhatsappUrl,
    },
    {
        icon: Phone,
        title: "الهاتف",
        value: siteConfig.contact.phone,
        href: `tel:${siteConfig.contact.phone}`,
        ltr: true,
    },
    {
        icon: Camera,
        title: "Instagram",
        value: "@babyamalia_jewelry",
        href: siteConfig.social.instagram,
        ltr: true,
    },
    {
        icon: Music2,
        title: "TikTok",
        value: "@baby.amalia.jewel",
        href: siteConfig.social.tiktok,
        ltr: true,
    },
    {
        icon: Ghost,
        title: "Snapchat",
        value: "babyamalia_sa",
        href: siteConfig.social.snapchat,
        ltr: true,
    },
];

export default function ContactPage() {
    return (
        <main id="main-content">
            <PageHeader
                eyebrow="تواصلي معنا"
                title="نحن هنا لمساعدتك"
                description={description}
                breadcrumbs={[{ label: "تواصلي معنا", href: "/contact" }]}
            />

            <section aria-label="قنوات التواصل" className="bg-ivory py-14 sm:py-20">
                <ul className="mx-auto grid max-w-[1600px] gap-4 px-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:px-12">
                    {channels.map(({ icon: Icon, title, value, href, ltr }, index) => (
                        <Reveal key={title} as="li" delay={(index % 3) * 0.08}>
                            <a
                                href={href}
                                target={href.startsWith("http") ? "_blank" : undefined}
                                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                                className="amalia-promise group flex h-full items-center gap-5 rounded-2xl border border-forest/10 bg-white/60 p-6 transition-colors hover:border-gold"
                            >
                                <span className="grid size-14 shrink-0 place-items-center rounded-full border border-gold/40 text-gold-deep transition-all duration-500 group-hover:rotate-[360deg] group-hover:bg-forest group-hover:text-gold">
                                    <Icon size={22} strokeWidth={1.4} />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block text-base font-medium text-forest">{title}</span>
                                    <span dir={ltr ? "ltr" : undefined} className="mt-1 block truncate text-sm text-forest/70">
                                        {value}
                                    </span>
                                </span>
                                <ArrowLeft size={18} strokeWidth={1.5} className="text-gold transition-transform group-hover:-translate-x-1" />
                            </a>
                        </Reveal>
                    ))}
                </ul>
            </section>
        </main>
    );
}
