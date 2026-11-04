import { cn } from "@/lib/cn";

/**
 * "Amalia Jewellery" logotype. The official artwork is used as a CSS mask,
 * so it takes `currentColor` just like the SVG marks.
 */
export default function Wordmark({ className }: { className?: string }) {
    return <span aria-hidden="true" className={cn("amalia-logotype", className)} />;
}
