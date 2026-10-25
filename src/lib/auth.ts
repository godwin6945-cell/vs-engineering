import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "vs-engineering-secret-key-2026";
const AUTH_COOKIE_NAME = "vse_auth_token";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "CUSTOMER";
  customerId?: string;
  companyName?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: UserSession): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSession;
  } catch {
    return null;
  }
}

/**
 * Get current logged in user from cookies in Next.js Server Components or Route Handlers
 */
export async function getSession(): Promise<UserSession | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

/**
 * Enforce Admin Role
 */
export async function requireAdmin(): Promise<UserSession> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin privileges required");
  }
  return session;
}

/**
 * Enforce Authenticated User
 */
export async function requireAuth(): Promise<UserSession> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized: Authentication required");
  }
  return session;
}

export { AUTH_COOKIE_NAME };
