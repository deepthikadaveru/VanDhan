import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session';
import type { User, UserRole } from '@/types';

const OFFICER_ROLES: UserRole[] = [
  'INSTITUTION_OFFICER',
  'STATE_OFFICER',
  'MOTA_OFFICER',
  'HELPDESK_OFFICER',
  'ADMIN',
];

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

/** Throws AuthError if there is no valid session. Use inside try/catch in route handlers. */
export async function requireUser(): Promise<User> {
  const user = await getSessionUser();
  if (!user) throw new AuthError('Not authenticated.', 401);
  return user;
}

/** Throws AuthError if the session user is not a student. */
export async function requireStudent(): Promise<User> {
  const user = await requireUser();
  if (user.role !== 'STUDENT') throw new AuthError('Student account required.', 403);
  return user;
}

/** Throws AuthError if the session user does not hold an officer-class role. */
export async function requireOfficer(): Promise<User> {
  const user = await requireUser();
  if (!OFFICER_ROLES.includes(user.role)) throw new AuthError('Officer account required.', 403);
  return user;
}

export function handleAuthError(err: unknown) {
  if (err instanceof AuthError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error(err);
  return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
}
