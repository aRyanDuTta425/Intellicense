import { encode as base64Encode } from '@cfworker/base64url';
import * as jose from 'jose';

// Helper function to convert string to Uint8Array
function str2ab(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Helper function to convert Uint8Array to string
function ab2str(buf: ArrayBuffer): string {
  return new TextDecoder().decode(buf);
}

// Helper function to convert ArrayBuffer to base64url string
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return base64Encode(ab2str(bytes.buffer));
}

// Generate a JWT token using jose
export async function generateToken(payload: any, secret: string): Promise<string> {
  const key = await jose.importJWK(
    {
      kty: 'oct',
      k: base64Encode(secret),
      alg: 'HS256',
    },
    'HS256'
  );

  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(key);

  return token;
}

// Verify a JWT token using jose
export async function verifyToken(token: string, secret: string): Promise<any> {
  const key = await jose.importJWK(
    {
      kty: 'oct',
      k: base64Encode(secret),
      alg: 'HS256',
    },
    'HS256'
  );

  const { payload } = await jose.jwtVerify(token, key);
  return payload;
}

// Hash a password using PBKDF2
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    str2ab(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const key = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const hash = new Uint8Array(key);
  const result = new Uint8Array(salt.length + hash.length);
  result.set(salt);
  result.set(hash, salt.length);

  return arrayBufferToBase64(result.buffer);
}

// Verify a password against its hash
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const combined = str2ab(atob(hashedPassword));
  const salt = combined.slice(0, 16);
  const hash = combined.slice(16);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    str2ab(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const key = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const newHash = new Uint8Array(key);
  return newHash.every((byte, i) => byte === hash[i]);
} 