import { BadgeCheck, Gem, ShieldCheck, Truck } from "lucide-react";

import Reveal from "@/components/ui/Reveal";

const promises = [
    {
        icon: Gem,
        title: "ذهب عيار 18",
        text: "بحرفية أوروبية وآمن على البشرة الحساسة.",
    },
    {
        icon: Truck,
        title: "شحن لكل المملكة",
        text: "خلال 3 إلى 5 أيام عمل مع رقم تتبع.",
    },
    {
        icon: ShieldCheck,
        title: "دفع آمن",
        text: "مدى، Apple Pay، STC Pay والبطاقات.",
    },
    {
        icon: BadgeCheck,
        title: "متجر موثّق",
        text: "موثّق في منصة الأعمال السعودية.",
    },
];

export default function Promises() {
    return (
        <section aria-label="وعود أماليا" className="bg-ivory py-16 sm:py-20">
            <div className="mx-auto max-w-[1600px] sm:px-8 lg:px-12">
                <ul className="grid grid-cols-2 gap-px overflow-hidden border border-forest/10 bg-forest/10 lg:grid-cols-4">
                    {promises.map(({ icon: Icon, title, text }, index) => (
                        <Reveal
                            key={title}
                            as="li"
                            delay={index * 0.08}
                            className="amalia-promise group bg-ivory p-6 text-center sm:p-10"
                        >
                            <span className="relative mx-auto grid size-14 place-items-center rounded-full border border-gold/40 text-gold-deep transition-all duration-500 group-hover:rotate-360 group-hover:bg-forest group-hover:text-gold">
                                <Icon size={22} strokeWidth={1.4} />
                            </span>
                            <h3 className="mt-5 text-base font-medium text-forest sm:text-lg">
                                {title}
                            </h3>
                            <p className="mt-1.5 text-sm text-forest/70">{text}</p>
                        </Reveal>
                    ))}
                </ul>
            </div>
        </section>
    );
}
