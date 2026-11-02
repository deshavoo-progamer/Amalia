/** Keeps post-login redirects on this site (no protocol-relative or absolute URLs). */
export function safeRedirect(value: string | string[] | undefined, fallback = "/account") {
    const target = Array.isArray(value) ? value[0] : value;
    return target && target.startsWith("/") && !target.startsWith("//") && !target.startsWith("/\\") ? target : fallback;
}
