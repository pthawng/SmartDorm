/**
 * Typed environment variables.
 * Vite exposes env vars via `import.meta.env`.
 */

export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string || 'http://localhost:8080/api/v1',
  APP_NAME: import.meta.env.VITE_APP_NAME as string || 'SmartDorm',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;
