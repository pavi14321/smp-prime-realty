// DEMO ONLY — swap this for a real SMS/email OTP provider (Twilio, MSG91,
// Firebase Auth, etc.) once this connects to your Express/Neon backend.

const pending = new Map(); // identifier (phone/email) -> { code, expiresAt }

function generateCode() {
  return String(Math.floor(1000 + Math.random() * 9000)); // 4-digit
}

export function sendOtp(identifier) {
  const code = generateCode();
  pending.set(identifier, { code, expiresAt: Date.now() + 5 * 60 * 1000 });
  return code; // in production: don't return this, just fire the SMS/email
}

export function verifyOtp(identifier, code) {
  const entry = pending.get(identifier);
  if (!entry) return { ok: false, reason: 'No OTP was requested for this contact.' };
  if (Date.now() > entry.expiresAt) return { ok: false, reason: 'OTP expired, please resend.' };
  if (entry.code !== String(code).trim()) return { ok: false, reason: 'Incorrect OTP.' };
  pending.delete(identifier);
  return { ok: true };
}