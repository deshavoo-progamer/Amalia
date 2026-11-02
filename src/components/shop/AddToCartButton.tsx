"use client";

import { useEffect, useState } from "react";
import { Check, ShoppingBag } from "lucide-react";

import { cart } from "@/lib/cart";
import { cn } from "@/lib/cn";

type AddToCartButtonProps = {
    productId: string;
    name: string;
    available: boolean;
    /** "icon": round niche action · "primary": product page CTA · "compact": phone buy bar. */
    variant?: "icon" | "primary" | "compact";
    className?: string;
};

export default function AddToCartButton({ productId, name, available, variant = "primary", className }: AddToCartButtonProps) {
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (!added) return;
        const timer = window.setTimeout(() => setAdded(false), 1800);
        return () => window.clearTimeout(timer);
    }, [added]);

    function handleClick() {
        cart.add(productId);
        setAdded(true);
    }

    const label = added ? "أُضيفت إلى الحقيبة" : "أضيفي إلى الحقيبة";

    if (variant === "icon") {
        return (
            <button
                type="button"
                onClick={handleClick}
                disabled={!available}
                aria-label={available ? `أضيفي ${name} إلى الحقيبة` : `${name} غير متوفر حاليًا`}
                className={cn("amalia-niche-action disabled:cursor-not-allowed disabled:opacity-40", className)}
            >
                {added ? <Check size={16} strokeWidth={1.8} /> : <ShoppingBag size={16} strokeWidth={1.5} />}
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={!available}
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                variant === "primary"
                    ? "min-h-13 bg-forest px-8 text-[0.9375rem] text-ivory hover:bg-forest-deep"
                    : "h-11 bg-gold px-6 text-sm text-forest-deep hover:bg-gold-light",
                className
            )}
        >
            {added ? <Check size={18} strokeWidth={1.8} /> : <ShoppingBag size={18} strokeWidth={1.5} />}
            <span aria-live="polite">{available ? label : "نفدت الكمية"}</span>
        </button>
    );
}
