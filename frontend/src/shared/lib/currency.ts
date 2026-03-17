/**
 * Currency formatting helpers.
 */

/**
 * Format a number as Vietnamese Dong.
 * @example formatCurrency(1500000) => '1,500,000 ₫'
 */
export function formatCurrency(amount: number, locale = 'vi-VN', currency = 'VND'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number with commas.
 * @example formatNumber(1500000) => '1,500,000'
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}
