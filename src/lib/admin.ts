import "server-only";

import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth, type Session } from "./auth";

/** Comma-separated env list, e.g. ADMIN_PHONES="+9665…,+9665…" or ADMIN_EMAILS="a@b.com". */
function envList(name: "ADMIN_PHONES" | "ADMIN_EMAILS") {
    return (process.env[name] ?? "")
        .split(",")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean);
}

export function isAdmin(user: Session["user"]) {
    const phone = "phoneNumber" in user ? String(user.phoneNumber ?? "") : "";
    return Boolean(
        (phone && envList("ADMIN_PHONES").includes(phone)) || envList("ADMIN_EMAILS").includes(user.email.toLowerCase())
    );
}

export async function getAdminSession() {
    const session = await auth.api.getSession({ headers: await headers() });
    return session && isAdmin(session.user) ? session : null;
}

/**
 * Gate for every admin page and server action. Signed-out visitors are sent to log in;
 * signed-in customers get a 404, so the dashboard's existence isn't revealed.
 */
export async function requireAdmin(redirectTo = "/admin") {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect(`/login?redirect=${encodeURIComponent(redirectTo)}`);

    const admin = await getAdminSession();
    if (!admin) notFound();
    return admin;
}

/** Re-render every storefront page that shows products after an admin change. */
export function revalidateCatalog() {
    revalidatePath("/", "layout");
}
