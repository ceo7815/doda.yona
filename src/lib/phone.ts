/**
 * נרמול ומספרי טלפון ישראלים לזיהוי לקוחות.
 */

/** מחזיר ספרות בלבד */
export function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * מנרמל למבנה ישראלי מקומי: 05XXXXXXXX
 * תומך ב-972, +972, 05x
 */
export function normalizeIsraeliPhone(phone: string): string | null {
  let digits = digitsOnly(phone);

  if (digits.startsWith("972")) {
    digits = `0${digits.slice(3)}`;
  }

  if (digits.length === 9 && digits.startsWith("5")) {
    digits = `0${digits}`;
  }

  if (!/^05\d{8}$/.test(digits)) {
    return null;
  }

  return digits;
}

export function formatIsraeliPhoneDisplay(phone: string): string {
  const normalized = normalizeIsraeliPhone(phone) ?? digitsOnly(phone);
  if (normalized.length === 10) {
    return `${normalized.slice(0, 3)}-${normalized.slice(3, 6)}-${normalized.slice(6)}`;
  }
  return phone;
}

/** קישור חיוג */
export function telHref(phone: string): string {
  const normalized = normalizeIsraeliPhone(phone);
  return normalized ? `tel:+972${normalized.slice(1)}` : `tel:${digitsOnly(phone)}`;
}

/** קישור WhatsApp (wa.me) — ללא שליחה דרך API */
export function whatsappHref(phone: string, text?: string): string {
  const normalized = normalizeIsraeliPhone(phone);
  const intl = normalized ? `972${normalized.slice(1)}` : digitsOnly(phone);
  const base = `https://wa.me/${intl}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}
