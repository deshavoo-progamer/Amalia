import JsonLd from "@/components/JsonLd";
import Collections from "@/components/sections/Collections";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import GiftExperience from "@/components/sections/GiftExperience";
import Hero from "@/components/sections/Hero";
import KidsCollection from "@/components/sections/KidsCollection";
import Lookbook from "@/components/sections/Lookbook";
import Manifesto from "@/components/sections/Manifesto";
import Marquee from "@/components/sections/Marquee";
import Newsletter from "@/components/sections/Newsletter";
import Promises from "@/components/sections/Promises";
import StickyStory from "@/components/sections/StickyStory";

export default function Home() {
  return (
    <>
      <JsonLd />

      <main id="main-content">
        <Hero />
        <Marquee />
        <Collections />
        <StickyStory />
        <FeaturedProducts />
        <Manifesto />
        <Lookbook />
        <KidsCollection />
        <GiftExperience />
        <Promises />
        <Newsletter />
      </main>
    </>
  );
}
