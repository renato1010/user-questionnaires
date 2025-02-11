'use server';
import { compare, hash } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import ms from 'ms';
import { getUserByUsername } from './queries';
import { signInSchema } from '../schemas/sign-in';
import { UserFrontend } from '../db/types';

const key = new TextEncoder().encode(process.env.AUTH_SECRET!);
const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export async function comparePasswords(plainTextPassword: string, hashedPassword: string) {
  return compare(plainTextPassword, hashedPassword);
}

type SessionData = {
  user: UserFrontend;
  expires: Date;
};
export async function signToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1 day from now')
    .sign(key);
}

export async function verifyToken(input: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256']
    });
    return payload as SessionData;
  } catch (error) {
    return null;
  }
}

export async function login(formData: { username: string; password: string }) {
  // server-side data validation with zod schema
  const signInValidation = signInSchema.safeParse(formData);
  if (!signInValidation.success) {
    return { ok: false, message: 'Invalid data', user: null };
  }

  const cookieStore = await cookies();

  // Verify credentials && get the user

  const user = await getUserByUsername(formData.username, formData.password);
  if (!user) {
    return { ok: false, message: 'User not found', user: null };
  }

  // Create the session
  const expires = new Date(Date.now() + ms('1d'));
  const session = await signToken({ user, expires });

  // Save the session in a cookie
  cookieStore.set('session', session, { expires, httpOnly: true });
  return { ok: true, message: 'Succesful Login', user };
}

export async function logout() {
  const cookieStore = await cookies();

  // Destroy the session
  cookieStore.set('session', '', { expires: new Date(0) });
}

export async function getSession() {
  const cookieStore = await cookies();

  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  try {
    return verifyToken(session) as Promise<SessionData>;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await verifyToken(session);
  if (!parsed) return;
  parsed.expires = new Date(Date.now() + ms('1d'));
  const res = NextResponse.next();
  res.cookies.set({
    name: 'session',
    value: await signToken(parsed),
    httpOnly: true,
    expires: parsed.expires
  });
  return res;
}
