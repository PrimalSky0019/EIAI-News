/**
 * Professional logging utility for server-side operations
 * Only logs in development, silent in production
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  error: (message: string, error?: unknown) => {
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, error);
    }
  },

  warn: (message: string, data?: unknown) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, data);
    }
  },

  info: (message: string, data?: unknown) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, data);
    }
  },

  debug: (message: string, data?: unknown) => {
    if (isDevelopment) {
      console.log(`[DEBUG] ${message}`, data);
    }
  },
};

/**
 * Format error messages for user-facing responses
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}
