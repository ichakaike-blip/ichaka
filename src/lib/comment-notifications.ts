import { createHmac, timingSafeEqual } from "crypto";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getNotificationSecret() {
  return process.env.NEXTAUTH_SECRET || "change-me-in-env";
}

export function normalizeEmail(input?: string | null) {
  if (!input) return null;
  const trimmed = input.trim().toLowerCase();
  return trimmed.length > 0 ? trimmed : null;
}

export function isValidEmail(input: string) {
  return EMAIL_REGEX.test(input);
}

export function buildUnsubscribeToken(commentId: string, email: string) {
  return createHmac("sha256", getNotificationSecret())
    .update(`${commentId}:${email}`)
    .digest("hex");
}

export function verifyUnsubscribeToken(commentId: string, email: string, token: string) {
  const expected = buildUnsubscribeToken(commentId, email);
  const expectedBuffer = Buffer.from(expected, "utf8");
  const tokenBuffer = Buffer.from(token, "utf8");

  if (expectedBuffer.length !== tokenBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, tokenBuffer);
}
