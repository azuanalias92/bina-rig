import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMYR(amount: number, locale: "ms" | "en" = "ms") {
  const ll = locale === "ms" ? "ms-MY" : "en-MY";
  return new Intl.NumberFormat(ll, {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
