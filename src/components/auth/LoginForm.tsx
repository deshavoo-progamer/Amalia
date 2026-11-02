"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle, MessageSquareText, PencilLine } from "lucide-react";

import { authClient } from "@/lib/auth-client";

const RESEND_SECONDS = 60;
const CODE_LENGTH = 6;

/** Accepts 05XXXXXXXX, 5XXXXXXXX, 9665XXXXXXXX or +9665XXXXXXXX (Arabic digits too). */
function toSaudiE164(raw: string) {
    const digits = raw
        .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
        .replace(/\D/g, "");
    const local = digits.replace(/^(00966|966|0)/, "");
    return /^5\d{8}$/.test(local) ? `+966${local}` : null;
}

function errorMessage(error: { status?: number; message?: string } | null | undefined) {
    if (!error) return "حدث خطأ غير متوقع، حاولي مرة أخرى.";
    if (error.status === 429) return "محاولات كثيرة خلال وقت قصير. انتظري دقيقة ثم حاولي مجددًا.";
    if (/attempt/i.test(error.message ?? "")) return "تجاوزتِ عدد المحاولات لهذا الرمز. اطلبي رمزًا جديدًا.";
    if (/expired/i.test(error.message ?? "")) return "انتهت صلاحية الرمز. اطلبي رمزًا جديدًا.";
    if (/invalid|otp|code/i.test(error.message ?? "")) return "الرمز غير صحيح، تأكدي منه وحاولي مجددًا.";
    return "تعذّر إكمال العملية الآن، حاولي بعد قليل.";
}

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
    const router = useRouter();
    const [step, setStep] = useState<"phone" | "code">("phone");
    const [phoneInput, setPhoneInput] = useState("");
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const codeRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = window.setTimeout(() => setCooldown((value) => value - 1), 1000);
        return () => window.clearTimeout(timer);
    }, [cooldown]);

    useEffect(() => {
        if (step === "code") codeRef.current?.focus();
    }, [step]);

    async function sendCode(target: string) {
        setLoading(true);
        setError("");
        const { error: sendError } = await authClient.phoneNumber.sendOtp({ phoneNumber: target });
        setLoading(false);

        if (sendError) {
            setError(errorMessage(sendError));
            return false;
        }

        setCooldown(RESEND_SECONDS);
        return true;
    }

    async function handlePhoneSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const normalized = toSaudiE164(phoneInput);

        if (!normalized) {
            setError("أدخلي رقم جوال سعودي صحيح يبدأ بـ 5، مثل 5XXXXXXXX.");
            return;
        }

        setPhone(normalized);
        if (await sendCode(normalized)) {
            setCode("");
            setStep("code");
        }
    }

    async function verify(value: string) {
        setLoading(true);
        setError("");
        const { error: verifyError } = await authClient.phoneNumber.verify({ phoneNumber: phone, code: value });

        if (verifyError) {
            setLoading(false);
            setError(errorMessage(verifyError));
            setCode("");
            codeRef.current?.focus();
            return;
        }

        router.replace(redirectTo);
        router.refresh();
    }

    function handleCodeChange(value: string) {
        const digits = value.replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))).replace(/\D/g, "").slice(0, CODE_LENGTH);
        setCode(digits);
        if (digits.length === CODE_LENGTH && !loading) void verify(digits);
    }

    return (
        <div>
            {step === "phone" ? (
                <form onSubmit={handlePhoneSubmit} noValidate>
                    <label htmlFor="phone" className="block text-sm font-medium text-forest">
                        رقم الجوال
                    </label>
                    <div className="mt-2 flex items-stretch overflow-hidden rounded-2xl border border-forest/20 bg-white transition-colors focus-within:border-gold" dir="ltr">
                        <span className="grid place-items-center border-r border-forest/10 bg-ivory-warm px-4 text-base text-forest/70 tabular-nums">+966</span>
                        <input
                            id="phone"
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel-national"
                            placeholder="5X XXX XXXX"
                            value={phoneInput}
                            onChange={(event) => setPhoneInput(event.target.value)}
                            aria-invalid={Boolean(error)}
                            aria-describedby={error ? "login-error" : "phone-help"}
                            className="min-w-0 flex-1 bg-transparent px-4 py-4 text-lg text-forest outline-none placeholder:text-forest/35 tabular-nums"
                        />
                    </div>
                    <p id="phone-help" className="mt-2 text-xs text-forest/70">
                        سنرسل لكِ رمز تحقق من 6 أرقام في رسالة نصية.
                    </p>

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
                        {loading ? <LoaderCircle size={18} className="animate-spin" /> : <MessageSquareText size={18} strokeWidth={1.5} />}
                        {loading ? "جارٍ الإرسال…" : "أرسلي رمز التحقق"}
                    </button>
                </form>
            ) : (
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (code.length === CODE_LENGTH) void verify(code);
                    }}
                    noValidate
                >
                    <p className="text-sm leading-7 text-forest/70">
                        أرسلنا رمزًا إلى{" "}
                        <span dir="ltr" className="font-medium text-forest tabular-nums">
                            {phone}
                        </span>
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setStep("phone");
                            setError("");
                        }}
                        className="mt-1 inline-flex h-11 items-center gap-1.5 text-sm text-gold-ink hover:text-forest"
                    >
                        <PencilLine size={15} strokeWidth={1.5} />
                        تغيير الرقم
                    </button>

                    <label htmlFor="code" className="mt-4 block text-sm font-medium text-forest">
                        رمز التحقق
                    </label>
                    <input
                        ref={codeRef}
                        id="code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        dir="ltr"
                        maxLength={CODE_LENGTH}
                        value={code}
                        onChange={(event) => handleCodeChange(event.target.value)}
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? "login-error" : undefined}
                        placeholder="••••••"
                        className="mt-2 w-full rounded-2xl border border-forest/20 bg-white px-4 py-4 text-center text-2xl tracking-[0.6em] text-forest outline-none transition-colors placeholder:text-forest/25 focus:border-gold tabular-nums"
                    />

                    {error && (
                        <p id="login-error" role="alert" className="mt-4 rounded-xl bg-forest/5 px-4 py-3 text-sm text-forest">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || code.length !== CODE_LENGTH}
                        className="mt-6 flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-forest px-6 text-[0.9375rem] font-medium text-ivory transition-colors hover:bg-forest-deep disabled:opacity-60"
                    >
                        {loading ? <LoaderCircle size={18} className="animate-spin" /> : <ArrowLeft size={18} strokeWidth={1.5} />}
                        {loading ? "جارٍ التحقق…" : "تأكيد الدخول"}
                    </button>

                    <p className="mt-5 text-center text-sm text-forest/70" aria-live="polite">
                        {cooldown > 0 ? (
                            <>
                                يمكنك طلب رمز جديد بعد <span className="tabular-nums">{cooldown}</span> ثانية
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => void sendCode(phone)}
                                disabled={loading}
                                className="inline-flex h-11 items-center font-medium text-gold-ink hover:text-forest"
                            >
                                إعادة إرسال الرمز
                            </button>
                        )}
                    </p>
                </form>
            )}
        </div>
    );
}
