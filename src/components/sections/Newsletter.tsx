"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Check } from "lucide-react";

import Emblem from "@/components/brand/Emblem";
import Reveal from "@/components/ui/Reveal";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!email.trim()) return;

        // TODO: connect to the newsletter provider when the backend is ready.
        setSubmitted(true);
    }

    return (
        <section
            aria-labelledby="newsletter-title"
            className="bg-ivory px-4 pb-24 sm:px-8 sm:pb-32 lg:px-12"
        >
            <Reveal className="grain relative mx-auto max-w-[1600px] overflow-hidden rounded-[2rem] bg-forest px-6 py-16 text-center text-ivory sm:px-12 sm:py-24">
                <Emblem
                    tone="current"
                    className="amalia-spin-slow pointer-events-none absolute -top-24 -right-24 size-72 text-gold/10"
                />
                <Emblem
                    tone="current"
                    className="amalia-spin-slow pointer-events-none absolute -bottom-28 -left-20 size-80 text-gold/10 [animation-direction:reverse]"
                />

                <div className="relative mx-auto max-w-2xl">
                    <p className="amalia-eyebrow justify-center">عائلة أماليا</p>
                    <h2
                        id="newsletter-title"
                        className="mt-4 text-3xl sm:text-4xl lg:text-5xl"
                    >
                        كوني أول من يكتشف الجديد
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-ivory/70">
                        التصاميم الجديدة، وأفكار الهدايا لكِ ولصغيرتك، والعروض الخاصة تصلك أولًا.
                    </p>

                    <AnimatePresence mode="wait" initial={false}>
                        {submitted ? (
                            <motion.p
                                key="done"
                                role="status"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-10 inline-flex items-center gap-3 rounded-full border border-gold/40 px-6 py-4 text-gold-light"
                            >
                                <Check size={18} />
                                شكرًا لكِ! تم تسجيل بريدك بنجاح.
                            </motion.p>
                        ) : (
                            <motion.form
                                key="form"
                                exit={{ opacity: 0, y: -12 }}
                                onSubmit={handleSubmit}
                                className="amalia-newsletter mx-auto mt-10 flex max-w-lg items-center gap-2 rounded-full border border-ivory/20 bg-ivory/5 p-1.5 ps-6 backdrop-blur transition-colors focus-within:border-gold"
                            >
                                <label htmlFor="newsletter-email" className="sr-only">
                                    البريد الإلكتروني
                                </label>
                                <input
                                    id="newsletter-email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="بريدك الإلكتروني"
                                    className="min-w-0 flex-1 bg-transparent py-3 text-ivory outline-none placeholder:text-ivory/45"
                                />
                                <button
                                    type="submit"
                                    className="amalia-btn amalia-btn--gold shrink-0 px-6!"
                                >
                                    <span className="relative z-10 inline-flex items-center gap-2">
                                        اشتركي
                                        <ArrowLeft size={16} strokeWidth={1.5} />
                                    </span>
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </Reveal>
        </section>
    );
}
