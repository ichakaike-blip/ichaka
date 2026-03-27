import NextAuth from "next-auth";
import Email from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

const hasSmtpConfig = Boolean(process.env.SMTP_HOST);
const authSecret =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  (process.env.NODE_ENV === "development" ? "dev-only-change-me" : undefined);

export const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "";

export function isAdminEmail(email?: string | null) {
  if (!email) {
    return false;
  }

  const configured = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!configured) {
    return false; // deny access rather than grant it when ADMIN_EMAIL is not set
  }

  return email.toLowerCase() === configured;
}

export function hasAdminAccess(email?: string | null, passcodeCookieValue?: string | null) {
  return isAdminEmail(email) || passcodeCookieValue === "1";
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as never),
  secret: authSecret,
  providers: [
    Email({
      // In local development, allow magic-link flow without a running SMTP server.
      server: hasSmtpConfig
        ? {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
            auth:
              process.env.SMTP_USER && process.env.SMTP_PASSWORD
                ? {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,
                  }
                : undefined,
          }
        : {
            jsonTransport: true,
          },
      ...(!hasSmtpConfig
        ? {
            async sendVerificationRequest({ identifier, url }: { identifier: string; url: string }) {
              console.log("\n[auth] Dev magic link requested for:", identifier);
              console.log("[auth] Open this URL to sign in:", url, "\n");
            },
          }
        : {}),
      from: process.env.EMAIL_FROM || "admin@ichaka.com.ng",
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
});
