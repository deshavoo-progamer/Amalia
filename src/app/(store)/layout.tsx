import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

/** Storefront chrome. The admin dashboard (/admin) has its own layout without it. */
export default function StoreLayout({ children }: LayoutProps<"/">) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
