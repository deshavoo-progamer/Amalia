"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import {
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
} from "motion/react";
import { ArrowLeft } from "lucide-react";

import Emblem from "@/components/brand/Emblem";
import Wordmark from "@/components/brand/Wordmark";
import MagneticLink from "@/components/ui/MagneticLink";
import { siteConfig } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

const sparkles = [
    { top: "18%", left: "12%", size: 10, delay: 0 },
    { top: "30%", left: "84%", size: 7, delay: 1.2 },
    { top: "68%", left: "8%", size: 6, delay: 2.1 },
    { top: "76%", left: "78%", size: 11, delay: 0.6 },
    { top: "12%", left: "62%", size: 5, delay: 1.7 },
    { top: "52%", left: "92%", size: 6, delay: 2.6 },
    { top: "86%", left: "36%", size: 7, delay: 3.1 },
];

export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const shouldReduceMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });

    const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
    const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.22]);
    const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
    const emblemRotate = useTransform(scrollYProgress, [0, 1], [0, 60]);

    function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
        if (event.pointerType !== "mouse" || !sectionRef.current) return;

        const rect = sectionRef.current.getBoundingClientRect();

        sectionRef.current.style.setProperty(
            "--mx",
            `${((event.clientX - rect.left) / rect.width) * 100}%`
        );
        sectionRef.current.style.setProperty(
            "--my",
            `${((event.clientY - rect.top) / rect.height) * 100}%`
        );
    }

    // Load-in runs in CSS (.amalia-enter), so the copy paints with the HTML instead of waiting for hydration.
    const enter = (delay: number, y = 24) =>
        ({ "--enter-delay": `${delay}s`, "--reveal-y": `${y}px` }) as CSSProperties;

    return (
        <section
            ref={sectionRef}
            onPointerMove={handlePointerMove}
            aria-labelledby="hero-title"
            className="amalia-hero grain relative isolate flex min-h-[calc(100svh-7.25rem)] items-center justify-center overflow-hidden bg-forest-deep text-ivory sm:min-h-[calc(100svh-8rem)] lg:min-h-[calc(100svh-11rem)]"
        >
            {/* Satin backdrop with scroll parallax */}
            <motion.div
                aria-hidden="true"
                style={
                    shouldReduceMotion
                        ? undefined
                        : { y: imageY, scale: imageScale }
                }
                className="absolute inset-0 -z-20"
            >
                <Image
                    src="/images/hero-satin.webp"
                    alt=""
                    fill
                    preload
                    sizes="100vw"
                    className="object-cover"
                />
            </motion.div>

            {/* Depth + cursor light */}
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(10_33_29/35%)_0%,rgb(10_33_29/85%)_70%,rgb(10_33_29/96%)_100%)]"
            />
            <div aria-hidden="true" className="amalia-hero-light -z-10" />

            {/* Floating gold diamonds */}
            {sparkles.map((sparkle, index) => (
                <span
                    key={index}
                    aria-hidden="true"
                    className="amalia-sparkle"
                    style={{
                        top: sparkle.top,
                        left: sparkle.left,
                        width: sparkle.size,
                        height: sparkle.size,
                        animationDelay: `${sparkle.delay}s`,
                    }}
                />
            ))}

            <motion.div
                style={shouldReduceMotion ? undefined : { y: contentY }}
                className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-5 py-20 text-center sm:py-24"
            >
                {/* Only the copy fades on scroll: the buttons stay solid until they leave the screen. */}
                <motion.div
                    style={shouldReduceMotion ? undefined : { opacity: contentOpacity }}
                    className="flex w-full flex-col items-center"
                >
                    {/* Emblem with orbiting halo */}
                    <motion.div
                        initial={
                            shouldReduceMotion
                                ? false
                                : { opacity: 0, scale: 0.5, rotate: -120 }
                        }
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1.6, ease: EASE }}
                        className="relative grid size-28 place-items-center sm:size-36"
                    >
                        <span aria-hidden="true" className="amalia-halo" />
                        <motion.span
                            style={
                                shouldReduceMotion
                                    ? undefined
                                    : { rotate: emblemRotate }
                            }
                            className="block size-16 drop-shadow-[0_8px_30px_rgb(198_165_117/45%)] sm:size-20"
                        >
                            <Emblem className="size-full" />
                        </motion.span>
                    </motion.div>

                    <h1 id="hero-title" className="mt-8 w-full sm:mt-10">
                        <span className="sr-only">
                            {siteConfig.name} — {siteConfig.nameEn}: مجوهرات ذهب
                            للنساء والأطفال
                        </span>

                        <span className="amalia-wordmark-reveal mx-auto block w-[min(88vw,46rem)] text-ivory drop-shadow-[0_6px_24px_rgb(0_0_0/35%)]">
                            <Wordmark className="w-full" />
                        </span>
                    </h1>

                    <p
                        style={enter(0.7, 12)}
                        lang="en"
                        dir="ltr"
                        className="amalia-enter text-gold-gradient mt-5 font-display text-xl tracking-[0.08em] italic sm:text-2xl"
                    >
                        {siteConfig.tagline}
                    </p>

                    <p
                        style={enter(0.85)}
                        className="amalia-enter mt-6 max-w-xl text-base leading-8 text-pretty text-ivory/75 sm:text-lg"
                    >
                        مجوهرات ذهب عيار 18 لكِ ولصغيرتك — من قطعك اليومية وأجمل
                        مناسباتك إلى أول قرط في حياتها، بحرفية أوروبية تدوم.
                    </p>
                </motion.div>

                <div
                    style={enter(1)}
                    className="amalia-enter mt-10 flex flex-wrap items-center justify-center gap-4"
                >
                    <MagneticLink href="/shop" variant="gold">
                        تسوقي المجموعة
                        <ArrowLeft size={18} strokeWidth={1.5} />
                    </MagneticLink>

                    <MagneticLink href="#about" variant="ghost">
                        اكتشفي قصتنا
                    </MagneticLink>
                </div>
            </motion.div>

            {/* Scroll cue */}
            <a
                href="#collections"
                className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 [@media(min-height:960px)]:sm:flex text-[10px] tracking-[0.3em] text-ivory/60 transition-colors hover:text-gold"
            >
                <span>اكتشفي</span>
                <span aria-hidden="true" className="amalia-scroll-line" />
            </a>
        </section>
    );
}
