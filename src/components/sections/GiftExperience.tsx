"use client";

import { useRef } from "react";
import Image from "next/image";
import {
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
} from "motion/react";
import { ArrowLeft } from "lucide-react";

import Emblem from "@/components/brand/Emblem";
import MagneticLink from "@/components/ui/MagneticLink";
import Reveal from "@/components/ui/Reveal";

const steps = [
    {
        title: "هدية المواليد",
        text: "أقراط بلون حجر شهر الميلاد، أجمل هدية للسبوع.",
    },
    {
        title: "لكل مناسبة",
        text: "أعياد الميلاد، والعيد، وأول يوم في المدرسة.",
    },
    {
        title: "لمسة شخصية",
        text: "اسألينا عن تخصيص القطعة بالاسم أو الحرف المفضل.",
    },
];

export default function GiftExperience() {
    const ref = useRef<HTMLElement>(null);
    const shouldReduceMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const backY = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);
    const frontY = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);
    const frontRotate = useTransform(scrollYProgress, [0, 1], [-8, 6]);

    return (
        <section
            id="gifts"
            ref={ref}
            aria-labelledby="gifts-title"
            className="grain relative overflow-hidden bg-forest py-24 text-ivory sm:py-32"
        >
            <div className="mx-auto grid max-w-[1600px] items-center gap-16 px-4 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-24 lg:px-12">
                {/* Layered parallax photos */}
                <div className="relative order-2 mx-auto w-full max-w-xl lg:order-1">
                    <motion.div
                        style={shouldReduceMotion ? undefined : { y: backY }}
                        className="relative aspect-4/5 w-[82%] overflow-hidden rounded-[1.75rem] shadow-2xl"
                    >
                        <Image
                            src="/images/gift-satin-bracelet.webp"
                            alt="إسوارة زهرة الكاميليا الذهبية من أماليا على ساتان أخضر"
                            fill
                            sizes="(min-width: 1024px) 38vw, 80vw"
                            className="object-cover"
                        />
                    </motion.div>

                    <motion.div
                        style={
                            shouldReduceMotion
                                ? undefined
                                : { y: frontY, rotate: frontRotate }
                        }
                        className="absolute -bottom-10 left-0 aspect-4/5 w-[48%] overflow-hidden rounded-[1.25rem] shadow-[0_30px_80px_-20px_rgb(0_0_0/60%)] ring-1 ring-gold/30"
                    >
                        <Image
                            src="/images/gift-box-portrait.webp"
                            alt="علبة هدايا خضراء من أماليا بداخلها إسوارة ذهب رقيقة مع شريط ساتان"
                            fill
                            sizes="(min-width: 1024px) 22vw, 45vw"
                            className="object-cover"
                        />
                    </motion.div>
                </div>

                <div className="order-1 lg:order-2">
                    <Reveal>
                        <p className="amalia-eyebrow">فن الإهداء</p>
                        <h2
                            id="gifts-title"
                            className="mt-4 text-3xl text-balance sm:text-4xl lg:text-5xl"
                        >
                            هدية تُفتح بلهفة،
                            <span className="text-gold-gradient block">
                                وتبقى ذكرى للأبد
                            </span>
                        </h2>
                        <p className="mt-5 max-w-lg text-lg leading-8 text-ivory/70">
                            قطعة ذهب تحمل حبًا كبيرًا؛ لكِ أو لمن تحبين،
                            تُهدى في أجمل اللحظات وتبقى ذكرى تدوم.
                        </p>
                    </Reveal>

                    <ol className="mt-10 space-y-3">
                        {steps.map((step, index) => (
                            <Reveal key={step.title} as="li" delay={index * 0.1}>
                                <div className="amalia-step group flex gap-5 rounded-2xl border border-ivory/10 p-5 transition-colors duration-500 hover:border-gold/40 hover:bg-ivory/5">
                                    <Emblem className="mt-1 size-7 shrink-0 transition-transform duration-700 ease-luxe group-hover:rotate-60" />
                                    <span>
                                        <span className="block text-lg font-medium">
                                            {step.title}
                                        </span>
                                        <span className="mt-1 block text-sm leading-6 text-ivory/60">
                                            {step.text}
                                        </span>
                                    </span>
                                </div>
                            </Reveal>
                        ))}
                    </ol>

                    <Reveal delay={0.3} className="mt-10">
                        <MagneticLink href="/shop" variant="gold">
                            اختاري هديتك
                            <ArrowLeft size={18} strokeWidth={1.5} />
                        </MagneticLink>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
