import NextAuth from "next-auth";
import Email from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export function isAdminEmail(email?: string | null) {
  if (!email) {
    return false;
  }

  const configured = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!configured) {
    return true;
  }

  return email.toLowerCase() === configured;
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Email({
      server: {
        host: process.env.SMTP_HOST || "localhost",
        port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 1025,
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASSWORD
            ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
              }
            : undefined,
      },
      from: process.env.EMAIL_FROM || "admin@ichaka.com.ng",
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
});
