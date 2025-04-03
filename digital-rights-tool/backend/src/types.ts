import { R2Bucket, KVNamespace, D1Database } from '@cloudflare/workers-types';
import { Context } from 'hono';

export type Env = {
  DATABASE_URL: string;
  DB: D1Database;
  JWT_SECRET: string;
  GEMINI_API_KEY: string;
  NODE_ENV: string;
  UPLOADS: R2Bucket;
  USERS: KVNamespace;
  ANALYSES: KVNamespace;
};

export type Variables = {
  user?: {
    id: string;
    email: string;
  };
};

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
}

export interface Upload {
  id: string;
  userId: string;
  fileType: 'IMAGE' | 'ARTICLE' | 'VIDEO';
  fileName: string;
  fileUrl: string;
  contentType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Analysis {
  id: string;
  uploadId: string;
  licensingInfo?: string;
  licensingSummary?: string;
  riskScore?: number;
  createdAt: string;
  updatedAt: string;
}

export type HonoContext = Context<{ Bindings: Env; Variables: Variables }>;

export type ApiResponse = Response;

export interface AnalysisResult {
  licensingInfo: string;
  licensingSummary: string;
  riskScore: number;
  recommendations: string[];
}

// KV Storage Keys
export const KV_KEYS = {
  // User keys
  USER_BY_EMAIL: (email: string) => `user:${email}`,
  USER_BY_ID: (id: string) => `user:${id}`,
  USER_PASSWORD: (id: string) => `user:${id}:password`,
  USER_UPLOADS: (id: string) => `user:${id}:uploads`,

  // Upload keys
  UPLOAD_BY_ID: (id: string) => `upload:${id}`,

  // Analysis keys
  ANALYSIS_BY_ID: (id: string) => `analysis:${id}`,
  UPLOAD_ANALYSES: (uploadId: string) => `upload:${uploadId}:analyses`,
} as const; 