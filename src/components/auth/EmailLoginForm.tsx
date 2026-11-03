"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, LoaderCircle, UserPlus } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/cn";

const MIN_PASSWORD = 8;

type Mode = "sign-in" | "sign-up";

function errorMessage(error: { status?: number; code?: string } | null | undefined) {
    if (error?.status === 429) return "محاولات كثيرة خلال وقت قصير. انتظري دقيقة ثم حاولي مجددًا.";
    switch (error?.code) {
        case "INVALID_EMAIL_OR_PASSWORD":
            return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
        case "USER_ALREADY_EXISTS":
        case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
            return "هذا البريد مسجّل بالفعل. سجّلي الدخول بدلًا من ذلك.";
        case "INVALID_EMAIL":
            return "أدخلي بريدًا إلكترونيًا صحيحًا.";
        case "PASSWORD_TOO_SHORT":
            return `كلمة المرور يجب ألا تقل عن ${MIN_PASSWORD} أحرف.`;
        default:
            return "تعذّر إكمال العملية الآن، حاولي بعد قليل.";
    }
}

const inputClass =
    "mt-2 w-full rounded-2xl border border-forest/20 bg-white px-4 py-4 text-base text-forest outline-none transition-colors placeholder:text-forest/35 focus:border-gold";

export default function EmailLoginForm({ redirectTo }: { redirectTo: string }) {
    const router = useRouter();
    const [mode, setMode] = useState<Mode>("sign-in");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const signingUp = mode === "sign-up";

    function switchMode(next: Mode) {
        setMode(next);
        setError("");
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const cleanEmail = email.trim().toLowerCase();

        if (signingUp && !name.trim()) return setError("أدخلي اسمك.");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return setError("أدخلي بريدًا إلكترونيًا صحيحًا.");
        if (password.length < MIN_PASSWORD) return setError(`كلمة المرور يجب ألا تقل عن ${MIN_PASSWORD} أحرف.`);

        setLoading(true);
        setError("");
        const { error: authError } = signingUp
            ? await authClient.signUp.email({ name: name.trim(), email: cleanEmail, password })
            : await authClient.signIn.email({ email: cleanEmail, password });

        if (authError) {
            setLoading(false);
            setError(errorMessage(authError));
            return;
        }

        router.replace(redirectTo);
        router.refresh();
    }

    return (
        <div>
            <div role="group" aria-label="نوع الدخول" className="grid grid-cols-2 rounded-full border border-forest/15 bg-white p-1">
                {(["sign-in", "sign-up"] as const).map((value) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => switchMode(value)}
                        aria-pressed={mode === value}
                        className={cn(
                            "h-11 rounded-full text-sm transition-colors",
                            mode === value ? "bg-forest text-ivory" : "text-forest/70 hover:text-forest"
                        )}
                    >
                        {value === "sign-in" ? "تسجيل الدخول" : "حساب جديد"}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-6">
                {signingUp && (
                    <div className="mb-5">
                        <label htmlFor="name" className="block text-sm font-medium text-forest">
                            الاسم
                        </label>
                        <input
                            id="name"
                            type="text"
                            autoComplete="name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className={inputClass}
                        />
                    </div>
                )}

                <label htmlFor="email" className="block text-sm font-medium text-forest">
                    البريد الإلكتروني
                </label>
                <input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    dir="ltr"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "login-error" : undefined}
                    className={cn(inputClass, "text-end")}
                />

                <label htmlFor="password" className="mt-5 block text-sm font-medium text-forest">
                    كلمة المرور
                </label>
                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete={signingUp ? "new-password" : "current-password"}
                        dir="ltr"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        aria-invalid={Boolean(error)}
                        aria-describedby={[signingUp && "password-help", error && "login-error"].filter(Boolean).join(" ") || undefined}
                        className={cn(inputClass, "ps-14")}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                        aria-pressed={showPassword}
                        className="absolute inset-y-0 end-1 mt-2 grid w-12 place-items-center text-forest/60 hover:text-forest"
                    >
                        {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                    </button>
                </div>
                {signingUp && (
                    <p id="password-help" className="mt-2 text-xs text-forest/70">
                        {MIN_PASSWORD} أحرف على الأقل.
                    </p>
                )}

                {error && (
                    <p id="login-error" role="alert" className="mt-4 rounded-xl bg-forest/5 px-4 py-3 text-sm text-forest">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-forest px-6 text-[0.9375rem] font-medium text-ivory transition-colors hover:bg-forest-deep disabled:opacity-60"
                >
                    {loading ? (
                        <LoaderCircle size={18} className="animate-spin" />
                    ) : signingUp ? (
                        <UserPlus size={18} strokeWidth={1.5} />
                    ) : (
                        <ArrowLeft size={18} strokeWidth={1.5} />
                    )}
                    {loading ? "لحظة…" : signingUp ? "إنشاء الحساب" : "دخول"}
                </button>
            </form>
        </div>
    );
}
