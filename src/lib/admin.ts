import "server-only";

import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth } from "./auth";

/** Admin phone numbers (E.164), from ADMIN_PHONES="+9665…,+9665…". */
function adminPhones() {
    return (process.env.ADMIN_PHONES ?? "")
        .split(",")
        .map((phone) => phone.trim())
        .filter(Boolean);
}

export async function getAdminSession() {
    const session = await auth.api.getSession({ headers: await headers() });
    const phone = session?.user && "phoneNumber" in session.user ? session.user.phoneNumber : null;
    return session && phone && adminPhones().includes(String(phone)) ? session : null;
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
