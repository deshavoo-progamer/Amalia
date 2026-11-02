import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { collections } from "@/data/editorial";
import { cn } from "@/lib/cn";

import CollectionCard from "./CollectionCard";

// Bento placement per card, in data order.
const layout = [
    {
        className:
            "min-h-120 sm:col-span-2 lg:col-span-5 lg:row-span-2 lg:min-h-0",
        sizes: "(min-width: 1024px) 40vw, 100vw",
    },
    {
        className: "min-h-96 lg:col-span-4 lg:min-h-0",
        sizes: "(min-width: 1024px) 33vw, 100vw",
    },
    {
        className: "min-h-96 lg:col-span-3 lg:min-h-0",
        sizes: "(min-width: 1024px) 25vw, 100vw",
    },
    {
        className: "min-h-80 lg:col-span-3 lg:min-h-0",
        sizes: "(min-width: 1024px) 25vw, 100vw",
    },
    {
        className: "min-h-96 lg:col-span-4 lg:min-h-0",
        sizes: "(min-width: 1024px) 33vw, 100vw",
    },
];

export default function Collections() {
    return (
        <section
            id="collections"
            aria-labelledby="collections-title"
            className="bg-ivory py-24 sm:py-32"
        >
            <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
                <SectionHeading
                    id="collections-title"
                    eyebrow="المجموعات"
                    title="لكِ، ولصغيرتك"
                    description="من قطعك اليومية وأجمل مناسباتك، إلى أول ذهب في حياة صغيرتك — مجموعات مصممة بعناية لكل لحظة ولكل عمر."
                />

                <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-88 lg:grid-cols-12 lg:gap-5">
                    {collections.map((collection, index) => (
                        <Reveal
                            key={collection.id}
                            delay={index * 0.08}
                            className={cn("flex", layout[index]?.className)}
                        >
                            <CollectionCard
                                collection={collection}
                                index={index}
                                sizes={layout[index]?.sizes ?? "100vw"}
                                className="w-full"
                            />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
