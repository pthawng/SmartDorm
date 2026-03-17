/**
 * Generic utility functions.
 */

/** Capitalize the first letter of a string */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/** Generate a unique client-side ID (for optimistic updates) */
export function generateId(): string {
  return crypto.randomUUID();
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
