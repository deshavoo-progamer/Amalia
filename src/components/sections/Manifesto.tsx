"use client";

import { useRef } from "react";
import {
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
    type MotionValue,
} from "motion/react";

import Emblem from "@/components/brand/Emblem";

const TEXT =
    "نؤمن أن الذهب ليس مجرد زينة، بل ذكرى تُحفظ، وفرحة تُهدى، وأناقة ترافقكِ في كل لمسة — من أول قرط لمولودتك إلى أجمل مناسباتها وهي تكبر.";

const HIGHLIGHTS = new Set(["ذكرى", "فرحة", "أناقة", "لمسة"]);

function Word({
    word,
    range,
    progress,
}: {
    word: string;
    range: [number, number];
    progress: MotionValue<number>;
}) {
    const opacity = useTransform(progress, range, [0.15, 1]);
    const y = useTransform(progress, range, [8, 0]);
    const isHighlight = HIGHLIGHTS.has(word.replace(/[،.]/g, ""));

    return (
        <motion.span
            style={{ opacity, y }}
            className={
                isHighlight
                    ? "text-gold-gradient inline-block"
                    : "inline-block"
            }
        >
            {word}
        </motion.span>
    );
}

export default function Manifesto() {
    const ref = useRef<HTMLParagraphElement>(null);
    const shouldReduceMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 85%", "end 45%"],
    });

    const words = TEXT.split(" ");

    return (
        <section
            aria-label="فلسفة أماليا"
            className="relative overflow-hidden bg-ivory py-28 sm:py-40"
        >
            <Emblem
                tone="current"
                className="amalia-spin-slow pointer-events-none absolute top-1/2 left-1/2 size-[min(90vw,44rem)] -translate-x-1/2 -translate-y-1/2 text-gold/10"
            />

            <div className="relative mx-auto max-w-5xl px-5 text-center">
                <p className="amalia-eyebrow justify-center">فلسفتنا</p>

                <p
                    ref={ref}
                    className="mt-8 flex flex-wrap justify-center gap-x-[0.3em] gap-y-2 text-3xl leading-[1.6] font-medium text-forest sm:text-4xl lg:text-5xl"
                >
                    {shouldReduceMotion
                        ? TEXT
                        : words.map((word, index) => (
                              <Word
                                  key={index}
                                  word={word}
                                  progress={scrollYProgress}
                                  range={[
                                      index / words.length,
                                      (index + 1) / words.length,
                                  ]}
                              />
                          ))}
                </p>
            </div>
        </section>
    );
}
