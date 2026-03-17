/**
 * Common utility types used globally across the application.
 */

/** Branded type for database IDs */
export type ID = string;

/** ISO 8601 date string */
export type ISOString = string;

/** Make a type nullable */
export type Nullable<T> = T | null;

/** Make selected keys optional */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Extract the resolved type from a Promise */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

/** Generic select option for dropdowns */
export interface SelectOption<V = string> {
  label: string;
  value: V;
}
