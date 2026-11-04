import Image from "next/image";
import { ArrowLeft, Baby, CalendarHeart, Gift } from "lucide-react";

import Emblem from "@/components/brand/Emblem";
import MagneticLink from "@/components/ui/MagneticLink";
import Reveal from "@/components/ui/Reveal";

const highlights = [
    {
        icon: Baby,
        title: "آمنة على بشرة المواليد",
        text: "ذهب عيار 18 خفيف بحواف ناعمة.",
    },
    {
        icon: CalendarHeart,
        title: "حجر شهر الميلاد",
        text: "لون لكل شهر من شهور السنة.",
    },
    {
        icon: Gift,
        title: "أجمل هدية للسبوع",
        text: "أول ذهب في حياتها، وذكرى تبقى.",
    },
];

export default function KidsCollection() {
    return (
        <section
            id="newborn"
            aria-labelledby="kids-title"
            className="relative overflow-hidden bg-ivory-warm py-24 sm:py-32"
        >
            <div className="mx-auto grid max-w-[1600px] items-center gap-14 px-4 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12">
                <Reveal>
                    <p className="amalia-eyebrow">حجر شهر الميلاد</p>
                    <h2
                        id="kids-title"
                        className="mt-4 text-3xl text-balance text-forest sm:text-4xl lg:text-5xl"
                    >
                        أقراط المواليد… أول ذهب في حياتها
                    </h2>
                    <p className="mt-5 max-w-xl text-lg leading-8 text-forest/70">
                        أقراط ناعمة ورقيقة لحديثي الولادة بلون حجر شهر الميلاد،
                        مصممة لتكون آمنة على بشرة المواليد الحساسة. قطع صغيرة
                        تحمل حبًا كبيرًا، وتبقى ذكرى تكبر معها.
                    </p>

                    <ul className="mt-10 grid gap-4 sm:grid-cols-3">
                        {highlights.map(({ icon: Icon, title, text }) => (
                            <li
                                key={title}
                                className="amalia-kid-tile rounded-2xl border border-forest/10 bg-white/60 p-5"
                            >
                                <span className="grid size-11 place-items-center rounded-full bg-gold/15 text-gold-deep">
                                    <Icon size={20} strokeWidth={1.5} />
                                </span>
                                <h3 className="mt-4 text-base font-medium text-forest">
                                    {title}
                                </h3>
                                <p className="mt-1.5 text-sm leading-6 text-forest/70">
                                    {text}
                                </p>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-10">
                        <MagneticLink href="/shop/newborn" variant="forest">
                            تسوقي أقراط المواليد
                            <ArrowLeft size={18} strokeWidth={1.5} />
                        </MagneticLink>
                    </div>
                </Reveal>

                <Reveal delay={0.15} className="relative">
                    <div className="relative mx-auto aspect-4/5 max-w-lg">
                        {/* Rotating orbit ring */}
                        <div
                            aria-hidden="true"
                            className="amalia-orbit absolute -inset-6 rounded-full border border-dashed border-gold/40 sm:-inset-10"
                        >
                            <span className="absolute top-1/2 -left-2 size-4 rotate-45 bg-gold" />
                            <span className="absolute -top-1.5 left-1/2 size-3 rotate-45 bg-gold-light" />
                        </div>

                        <div className="amalia-arch relative h-full overflow-hidden bg-forest">
                            <Image
                                src="/images/newborn-satin.webp"
                                alt="قرطان ذهبيان للمواليد بقفل لولبي وحجر أزرق من أماليا على ساتان أخضر"
                                fill
                                sizes="(min-width: 1024px) 40vw, 90vw"
                                className="object-cover transition-transform duration-[1.6s] ease-luxe hover:scale-110"
                            />
                        </div>

                        <div className="absolute -bottom-6 -left-4 grid size-28 place-items-center rounded-full bg-forest shadow-2xl ring-8 ring-ivory-warm sm:size-32">
                            <Emblem className="amalia-spin-slow size-14" />
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
