/**
 * Global API error normalization.
 * Transforms raw Axios errors into a consistent, typed structure.
 *
 * Usage:
 *   try { ... } catch (err) {
 *     const normalized = normalizeApiError(err);
 *     toast.error(normalized.message);
 *   }
 */

import { AxiosError, isAxiosError } from 'axios';
import type { ApiError } from '@/shared/types/api';

/** Normalized error shape for the entire app */
export interface NormalizedError {
  message: string;
  statusCode: number;
  fieldErrors: Record<string, string[]>;
  isNetworkError: boolean;
  isUnauthorized: boolean;
  isForbidden: boolean;
  isNotFound: boolean;
  isValidationError: boolean;
  raw: unknown;
}

/**
 * Normalize any thrown error into a consistent shape.
 */
export function normalizeApiError(error: unknown): NormalizedError {
  // ── Axios errors ───────────────────────────────────────
  if (isAxiosError(error)) {
    const axiosErr = error as AxiosError<ApiError>;
    const status = axiosErr.response?.status ?? 0;
    const data = axiosErr.response?.data;

    return {
      message: data?.message ?? getDefaultMessage(status),
      statusCode: status,
      fieldErrors: data?.errors ?? {},
      isNetworkError: !axiosErr.response,
      isUnauthorized: status === 401,
      isForbidden: status === 403,
      isNotFound: status === 404,
      isValidationError: status === 422,
      raw: error,
    };
  }

  // ── Native errors ──────────────────────────────────────
  if (error instanceof Error) {
    return {
      message: error.message,
      statusCode: 0,
      fieldErrors: {},
      isNetworkError: false,
      isUnauthorized: false,
      isForbidden: false,
      isNotFound: false,
      isValidationError: false,
      raw: error,
    };
  }

  // ── Unknown ────────────────────────────────────────────
  return {
    message: 'An unexpected error occurred',
    statusCode: 0,
    fieldErrors: {},
    isNetworkError: false,
    isUnauthorized: false,
    isForbidden: false,
    isNotFound: false,
    isValidationError: false,
    raw: error,
  };
}

function getDefaultMessage(status: number): string {
  switch (status) {
    case 400: return 'Bad request — please check your input.';
    case 401: return 'Session expired — please log in again.';
    case 403: return 'You do not have permission for this action.';
    case 404: return 'The requested resource was not found.';
    case 422: return 'Validation failed — please correct the highlighted fields.';
    case 429: return 'Too many requests — please try again later.';
    case 500: return 'Server error — please try again later.';
    default:  return 'Something went wrong.';
  }
}
