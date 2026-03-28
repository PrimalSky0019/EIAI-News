/**
 * Type definitions for the application
 */

// Database types
export interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  embedding?: number[];
  created_at: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  preference_embedding?: number[];
  onboarding_completed: boolean;
  created_at: string;
  updated_at?: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Server Action types
export type ServerActionResponse<T = unknown> = Promise<ApiResponse<T>>;

// Chat message types
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

// Interest topics type
export type InterestTopic = string;

export interface UserPreferences {
  topics: InterestTopic[];
  embedding?: number[];
}

// Supabase Auth Error types
export interface AuthError {
  message: string;
  status?: number;
  code?: string;
}

export interface SupabaseAuthError extends Error {
  status?: number;
  code?: string;
}

// Type guard for Supabase errors
export function isAuthError(error: unknown): error is SupabaseAuthError {
  return error instanceof Error && 'message' in error;
}

// Common Supabase error codes
export const AUTH_ERROR_CODES = {
  RATE_LIMIT: 'rate_limit_exceeded',
  INVALID_CREDENTIALS: 'invalid_credentials',
  USER_NOT_FOUND: 'user_not_found',
  EMAIL_NOT_CONFIRMED: 'email_not_confirmed',
  WEAK_PASSWORD: 'weak_password',
} as const;

// Agent types
export interface AgentMessage {
  role: 'user' | 'assistant';
  content: string;
  actions?: string[];
  timestamp?: Date;
}

export type AgentToolName =
  | 'searchNews'
  | 'getNewsByCategory'
  | 'semanticSearch'
  | 'getUserPreferences'
  | 'fetchLiveNews'
  | 'ingestToDatabase';

export interface AgentResult {
  success: boolean;
  briefing?: string;
  error?: string;
  actionsTaken?: string[];
}
