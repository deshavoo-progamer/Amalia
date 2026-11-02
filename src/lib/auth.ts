import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { phoneNumber } from "better-auth/plugins";

import { db } from "@/db";
import * as schema from "@/db/schema";

import { siteConfig } from "./site";
import { sendLoginCode } from "./sms";

/** Saudi mobile numbers in E.164: +9665XXXXXXXX. */
export const SAUDI_MOBILE = /^\+9665\d{8}$/;

export const auth = betterAuth({
    baseURL: siteConfig.url,
    secret: process.env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, { provider: "pg", schema }),
    session: {
        expiresIn: 60 * 60 * 24 * 30,
        updateAge: 60 * 60 * 24,
    },
    // Serverless instances don't share memory, so OTP throttling is kept in the database.
    rateLimit: {
        enabled: true,
        storage: "database",
        modelName: "rateLimit",
        customRules: {
            "/phone-number/send-otp": { window: 60, max: 3 },
            "/phone-number/verify": { window: 60, max: 5 },
        },
    },
    plugins: [
        phoneNumber({
            otpLength: 6,
            expiresIn: 5 * 60,
            allowedAttempts: 3,
            phoneNumberValidator: (value) => SAUDI_MOBILE.test(value),
            sendOTP: ({ phoneNumber, code }) => sendLoginCode(phoneNumber, code),
            // Phone-only accounts: Better Auth still needs an email, so a private placeholder is stored.
            signUpOnVerification: {
                getTempEmail: (value) => `${value.replace(/\D/g, "")}@phone.babyamalia.local`,
                getTempName: () => "عميلة بيبي أماليا",
            },
        }),
        // Must stay last: lets server actions set the session cookie.
        nextCookies(),
    ],
});

export type Session = typeof auth.$Infer.Session;
