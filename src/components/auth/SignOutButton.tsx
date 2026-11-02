"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, LogOut } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        setLoading(true);
        await authClient.signOut();
        router.replace("/");
        router.refresh();
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={loading}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-forest/20 px-6 text-sm text-forest transition-colors hover:border-gold hover:text-gold-deep disabled:opacity-60"
        >
            {loading ? <LoaderCircle size={16} className="animate-spin" /> : <LogOut size={16} strokeWidth={1.5} />}
            تسجيل الخروج
        </button>
    );
}
