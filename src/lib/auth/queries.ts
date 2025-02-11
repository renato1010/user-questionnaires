'use server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db/db';
import { comparePasswords, verifyToken } from '@/lib/auth/session';

export async function getUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);

  if (!sessionData || !sessionData.user || typeof sessionData.user.id !== 'number') {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionData.user.id },
    select: { id: true, role: true, username: true }
  });

  if (!user) {
    return null;
  }

  return user;
}

export async function getUserByUsername(username: string, password: string) {
  const userByName = await prisma.user.findUnique({
    where: { username },
    select: { id: true, role: true, username: true, passwordHash: true }
  });
  if (!userByName) {
    return null;
  }
  // check password
  const isPasswordValid = await comparePasswords(password, userByName.passwordHash);
  // no need to return the password hash
  const { passwordHash, ...rest } = userByName;
  return isPasswordValid ? rest : null;
}
