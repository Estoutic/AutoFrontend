import { Locale } from "./types";

/**
 * Gets the default currency code for a locale
 */
export const getDefaultCurrencyCode = (locale: Locale): string => {
  switch (locale) {
    case Locale.EU:
      return "USD";
    case Locale.ZH:
      return "CNY";
    case Locale.RU:
    default:
      return "RUB";
  }
};

/**
 * Determines if mileage should be displayed in miles based on locale
 */
export const isLocaleUsingMiles = (locale: Locale): boolean => {
  return locale === Locale.EU;
};

/**
 * Formats a price value with its currency symbol
 */
export const formatPrice = (price: number | undefined, currencyCode: string = "RUB"): string => {
  if (price === undefined) return "";
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0
  }).format(price);
};

/**
 * Formats a mileage value with appropriate unit
 */
export const formatMileage = (mileage: number | undefined, isMiles: boolean = false): string => {
  if (mileage === undefined) return "";
  
  return `${new Intl.NumberFormat("en-US").format(mileage)} ${isMiles ? "mi" : "km"}`;
};

/**
 * Gets display name for a locale
 */
export const getLocaleDisplayName = (locale: Locale): string => {
  switch (locale) {
    case Locale.RU:
      return "Russia (RUB, km)";
    case Locale.EU:
      return "Europe (USD, miles)";
    case Locale.ZH:
      return "China (CNY, km)";
    default:
      return locale;
  }
};