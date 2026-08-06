import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** מיזוג מחלקות Tailwind בצורה בטוחה */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
