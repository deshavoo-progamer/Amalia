import "server-only";

/**
 * Sends a one-time login code by SMS.
 *
 * Development: the code is printed to the server console, so sign-in can be tested
 * without an SMS account. Production: wire a Saudi SMS gateway here (e.g. Unifonic,
 * Taqnyat or Msegat) — until then sending fails loudly instead of silently dropping codes.
 */
export async function sendLoginCode(phoneNumber: string, code: string) {
    if (process.env.NODE_ENV !== "production") {
        console.info(`[sms] Amalia Jewellery login code for ${phoneNumber}: ${code}`);
        return;
    }

    throw new Error("SMS provider is not configured: add one in src/lib/sms.ts before going live.");
}
