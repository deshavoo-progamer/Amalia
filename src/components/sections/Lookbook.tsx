"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
    motion,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from "motion/react";

import { lookbook } from "@/data/editorial";
import { cn } from "@/lib/cn";

type Look = (typeof lookbook)[number];

function LookCard({ look, index }: { look: Look; index: number }) {
    return (
        <figure
            className={cn(
                "amalia-look group relative h-[min(56vh,34rem)] shrink-0 overflow-hidden rounded-3xl bg-forest",
                "aspect-4/5",
                index % 2 === 1 && "lg:translate-y-12"
            )}
        >
            <Image
                src={look.image}
                alt={look.alt}
                fill
                sizes="(min-width: 1024px) 30vw, 75vw"
                className="amalia-look-img object-cover"
            />

            <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-forest-deep/85 via-transparent to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-100"
            />

            <figcaption className="absolute inset-x-0 bottom-0 p-6 text-ivory sm:p-8">
                <span className="amalia-look-title block text-2xl font-medium sm:text-3xl">
                    {look.title}
                </span>
            </figcaption>
        </figure>
    );
}

export default function Lookbook() {
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [distance, setDistance] = useState(0);
    const shouldReduceMotion = useReducedMotion();

    useLayoutEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const measure = () =>
            setDistance(Math.max(0, track.scrollWidth - window.innerWidth));

        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(track);
        window.addEventListener("resize", measure);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, []);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    // RTL: the track starts on the right, so it travels toward positive x.
    const rawX = useTransform(scrollYProgress, [0, 1], [0, distance]);
    const x = useSpring(rawX, { stiffness: 120, damping: 30, mass: 0.4 });
    const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

    const heading = (
        <div className="max-w-sm shrink-0 self-center ps-2">
            <p className="amalia-eyebrow">Lookbook</p>
            <h2
                id="lookbook-title"
                className="mt-4 text-4xl text-ivory sm:text-5xl"
            >
                عالم أماليا
                <span lang="en" className="text-gold-gradient block font-display italic">
                    in every touch
                </span>
            </h2>
            <p className="mt-5 leading-8 text-ivory/65">
                لقطات من عالم أميراتنا الصغيرات: ذهب ناعم، وألوان هادئة، وتفاصيل
                تُروى بحب.
            </p>
        </div>
    );

    if (shouldReduceMotion) {
        return (
            <section
                aria-labelledby="lookbook-title"
                className="bg-forest-deep py-24"
            >
                <div className="flex gap-6 overflow-x-auto px-4 pb-6 sm:px-8 lg:px-12">
                    {heading}
                    {lookbook.map((look, index) => (
                        <LookCard key={look.image} look={look} index={index} />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section
            ref={sectionRef}
            aria-labelledby="lookbook-title"
            className="grain relative bg-forest-deep"
            style={{ height: `calc(100svh + ${distance}px)` }}
        >
            <div className="amalia-sticky-panel sticky flex flex-col justify-center overflow-hidden">
                <motion.div
                    ref={trackRef}
                    style={{ x }}
                    className="flex w-max items-center gap-6 px-4 sm:gap-8 sm:px-8 lg:px-12"
                >
                    {heading}
                    {lookbook.map((look, index) => (
                        <LookCard key={look.image} look={look} index={index} />
                    ))}
                </motion.div>

                <div
                    aria-hidden="true"
                    className="absolute inset-x-4 bottom-8 h-px bg-ivory/15 sm:inset-x-8 lg:inset-x-12"
                >
                    <motion.div
                        style={{ scaleX: progressScale }}
                        className="h-full origin-right bg-gold"
                    />
                </div>
            </div>
        </section>
    );
}
