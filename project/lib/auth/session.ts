import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import type { User } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'vandhan-dev-secret-change-me';
const SESSION_COOKIE = 'vandhan_session';
const SESSION_TTL_DAYS = 7;

export interface SessionTokenPayload {
  userId: string;
  sub: string;
}

export function signSessionToken(userId: string): string {
  return jwt.sign({ userId, sub: userId }, JWT_SECRET, {
    expiresIn: `${SESSION_TTL_DAYS}d`,
  });
}

export async function createSession(userId: string) {
  const token = signSessionToken(userId);
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: { userId, token, expiresAt },
  });

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });

  return token;
}

export async function destroySession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } }).catch(() => {});
  }
  cookies().delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<User | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  const u = session.user;
  return {
    id: u.id,
    mobile: u.mobile,
    role: u.role,
    name: u.name,
    state: u.state ?? undefined,
    district: u.district ?? undefined,
  };
}

export { SESSION_COOKIE };
