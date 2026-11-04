"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
    motion,
    useMotionTemplate,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useTransform,
    type MotionValue,
} from "motion/react";

import Emblem from "@/components/brand/Emblem";
import { storyChapters } from "@/data/editorial";
import { cn } from "@/lib/cn";

type Chapter = (typeof storyChapters)[number];

const COUNT = storyChapters.length;
const STEP = 1 / COUNT;

// Scroll-linked animations can run on the native ScrollTimeline, which only accepts offsets within 0–1.
const clampRange = (points: number[]) =>
    points.map((point) => Math.min(1, Math.max(0, point)));

function StoryImage({
    chapter,
    index,
    progress,
}: {
    chapter: Chapter;
    index: number;
    progress: MotionValue<number>;
}) {
    const start = index * STEP;

    // Each new photo wipes up over the previous one, then settles its zoom.
    const inset = useTransform(
        progress,
        clampRange([start - STEP * 0.45, start + STEP * 0.05]),
        [index === 0 ? 0 : 100, 0]
    );
    const scale = useTransform(
        progress,
        clampRange([start - STEP * 0.45, start + STEP]),
        [index === 0 ? 1.05 : 1.3, 1]
    );
    const clipPath = useMotionTemplate`inset(${inset}% 0% 0% 0%)`;

    return (
        <motion.div
            style={{ clipPath, zIndex: index }}
            className="absolute inset-0 overflow-hidden"
        >
            <motion.div style={{ scale }} className="absolute inset-0">
                <Image
                    src={chapter.image}
                    alt={chapter.alt}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                />
            </motion.div>
        </motion.div>
    );
}

function StoryText({
    chapter,
    index,
    progress,
}: {
    chapter: Chapter;
    index: number;
    progress: MotionValue<number>;
}) {
    const start = index * STEP;
    const end = start + STEP;
    const isFirst = index === 0;
    const isLast = index === COUNT - 1;
    const range = clampRange([start - STEP * 0.3, start, end - STEP * 0.3, end]);

    const opacity = useTransform(progress, range, [
        isFirst ? 1 : 0,
        1,
        1,
        isLast ? 1 : 0,
    ]);
    const y = useTransform(progress, range, [
        isFirst ? 0 : 60,
        0,
        0,
        isLast ? 0 : -60,
    ]);
    return (
        <motion.article
            style={{ opacity, y }}
            className="absolute inset-x-0 top-1/2 -translate-y-1/2"
        >
            <p className="amalia-eyebrow">{chapter.eyebrow}</p>
            <h3 className="font-heading mt-3 text-3xl text-balance text-ivory sm:mt-4 sm:text-4xl xl:text-5xl">
                {chapter.title}
            </h3>
            <p className="mt-4 max-w-lg text-[15px] leading-7 text-pretty text-ivory/70 sm:mt-5 sm:text-lg sm:leading-8">
                {chapter.body}
            </p>
        </motion.article>
    );
}

/** Static, stacked layout used when the visitor prefers reduced motion. */
function StoryStatic() {
    return (
        <div className="mx-auto grid max-w-[1600px] gap-16 px-4 py-24 sm:px-8 lg:px-12">
            {storyChapters.map((chapter) => (
                <div
                    key={chapter.id}
                    className="grid items-center gap-8 lg:grid-cols-2"
                >
                    <div className="relative aspect-4/5 overflow-hidden rounded-[1.75rem]">
                        <Image
                            src={chapter.image}
                            alt={chapter.alt}
                            fill
                            sizes="(min-width: 1024px) 45vw, 100vw"
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <p className="amalia-eyebrow">{chapter.eyebrow}</p>
                        <h3 className="font-heading mt-4 text-3xl text-ivory sm:text-4xl">
                            {chapter.title}
                        </h3>
                        <p className="mt-5 text-lg leading-8 text-ivory/70">
                            {chapter.body}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function StickyStory() {
    const sectionRef = useRef<HTMLElement>(null);
    const shouldReduceMotion = useReducedMotion();
    const [active, setActive] = useState(0);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const emblemRotate = useTransform(scrollYProgress, [0, 1], [-30, 90]);

    useMotionValueEvent(scrollYProgress, "change", (value) => {
        // Switch at the midpoint of the text cross-fade, not at the segment edge.
        const next = Math.min(COUNT - 1, Math.floor(value * COUNT + 0.15));
        if (next !== active) setActive(next);
    });

    return (
        <section
            id="about"
            ref={sectionRef}
            aria-labelledby="story-title"
            className="grain relative bg-forest-deep text-ivory"
            style={
                shouldReduceMotion
                    ? undefined
                    : { height: `${COUNT * 110}svh` }
            }
        >
            <h2 id="story-title" className="sr-only">
                قصة أماليا
            </h2>

            {shouldReduceMotion ? (
                <StoryStatic />
            ) : (
                <div className="amalia-sticky-panel sticky overflow-hidden">
                    {/* Giant rotating emblem watermark */}
                    <motion.div
                        aria-hidden="true"
                        style={{ rotate: emblemRotate }}
                        className="pointer-events-none absolute -right-40 -bottom-40 size-144 text-gold opacity-5"
                    >
                        <Emblem tone="current" className="size-full" />
                    </motion.div>

                    <div className="mx-auto grid h-full max-w-[1600px] grid-rows-2 gap-6 px-4 py-6 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:grid-rows-1 lg:gap-16 lg:px-12 lg:py-10">
                        {/* Text column (right in RTL) */}
                        <div className="relative order-2 lg:order-1">
                            <div className="relative h-full">
                                {storyChapters.map((chapter, index) => (
                                    <StoryText
                                        key={chapter.id}
                                        chapter={chapter}
                                        index={index}
                                        progress={scrollYProgress}
                                    />
                                ))}
                            </div>

                            {/* Chapter dots */}
                            <ol className="absolute bottom-0 right-0 flex gap-2">
                                {storyChapters.map((chapter, index) => (
                                    <li
                                        key={chapter.id}
                                        aria-current={
                                            index === active ? "step" : undefined
                                        }
                                        className={cn(
                                            "h-0.5 rounded-full transition-all duration-500",
                                            index === active
                                                ? "w-10 bg-gold"
                                                : "w-4 bg-ivory/25"
                                        )}
                                    >
                                        <span className="sr-only">
                                            {chapter.eyebrow}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Pinned photo stack (left in RTL) */}
                        <div className="relative order-1 overflow-hidden rounded-[1.75rem] shadow-[0_40px_120px_-40px_rgb(0_0_0/70%)] lg:order-2">
                            {storyChapters.map((chapter, index) => (
                                <StoryImage
                                    key={chapter.id}
                                    chapter={chapter}
                                    index={index}
                                    progress={scrollYProgress}
                                />
                            ))}

                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 z-20 rounded-[1.75rem] ring-1 ring-gold/25 ring-inset"
                            />

                            {/* Vertical progress rail */}
                            <div
                                aria-hidden="true"
                                className="absolute top-6 bottom-6 left-6 z-20 w-px bg-ivory/20"
                            >
                                <motion.div
                                    style={{ scaleY: railScale }}
                                    className="h-full w-full origin-top bg-gold"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
