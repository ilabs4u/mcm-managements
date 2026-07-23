// Formatting utilities — consistent display across all components.

/**
 * Format a date string to "Mon, 20 Jul 2026" display format.
 * @param {string|Date} date
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format a date to "July 2026" for month headings.
 * @param {string|Date} date
 */
export function formatMonth(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format a timestamp to "10:30 AM" for entry timestamps.
 * @param {string|Date} date
 */
export function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get YYYY-MM-DD string for a date (used in API calls and DB queries).
 * @param {Date} date — defaults to today
 */
export function toDateString(date = new Date()) {
  return date.toISOString().split('T')[0];
}

/**
 * Get YYYY-MM string for a month (used in history/reports queries).
 * @param {Date} date — defaults to current month
 */
export function toMonthString(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

/**
 * Format a number to 2 decimal places, trimming trailing zeros.
 * e.g. 2.500 → "2.5", 4.000 → "4"
 * @param {number} value
 */
export function formatQuantity(value) {
  return parseFloat(value.toFixed(2)).toString();
}

/**
 * Format ingredient quantity with unit for display.
 * e.g. { quantity: 2.5, unit: 'kg' } → "2.5 kg"
 * @param {number} quantity
 * @param {string} unit
 */
export function formatIngredient(quantity, unit) {
  return `${formatQuantity(quantity)} ${unit}`;
}
