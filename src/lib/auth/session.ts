import { compare, hash } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = 'secret';
const key = new TextEncoder().encode(secretKey);
const SALT_ROUNDS = 10;
const cookieStore = await cookies();

export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export async function comparePasswords(plainTextPassword: string, hashedPassword: string) {
  return compare(plainTextPassword, hashedPassword);
}

type SessionData = {
  user: { id: number };
  expires: string;
};
export async function signToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('10 sec from now')
    .sign(key);
}

export async function verifyToken(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256']
  });
  return payload as SessionData;
}

export async function login(formData: FormData) {
  // Verify credentials && get the user

  const user = { email: formData.get('email'), name: 'John' };

  // Create the session
  const expires = new Date(Date.now() + 10 * 1000);
  const session = await signToken({ user, expires });

  // Save the session in a cookie
  cookieStore.set('session', session, { expires, httpOnly: true });
}

export async function logout() {
  // Destroy the session
  cookieStore.set('session', '', { expires: new Date(0) });
}

export async function getSession() {
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  return await verifyToken(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await verifyToken(session);
  parsed.expires = new Date(Date.now() + 10 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: 'session',
    value: await signToken(parsed),
    httpOnly: true,
    expires: parsed.expires
  });
  return res;
}
