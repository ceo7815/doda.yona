/**
 * עזרים לסכומי כסף באגורות — מונע שגיאות נקודה צפה.
 */

export function agorotToShekels(agorot: number): number {
  return agorot / 100;
}

export function shekelsToAgorot(shekels: number): number {
  return Math.round(shekels * 100);
}

export function formatIls(agorot: number): string {
  const value = agorotToShekels(agorot);
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}
