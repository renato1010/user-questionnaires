'use server';
import { Prisma } from '@prisma/client/edge';
import prisma from '../db';
import { hashPassword } from '@/lib/auth/session';

// example of passwords that comply with the password policy
/**
 * minimum 8 characters
 * 1 lowercase letter (a-z)
 * 1 uppercase letter(A-Z)
 * 1 number (0-9)
 * 1 special character like (-._!"\`'#%&,;:)
 * ['hT7-abcD','P#ssw0Rd','aB3!defg','Xy7:zapL9','tQ5.erM!','3nD#kLp8','w&7FhG2j','sM8-9bNq','cV6!xYp:','qW9`eRty']
 */

async function createUser() {
  // default role is 'USER'
  const regularUser: Prisma.UserCreateInput = {
    username: 'tester1',
    passwordHash: await hashPassword('hT7-abcD')
  };
  try {
    await prisma.user.create({ data: regularUser });
  } catch (error) {
    console.error(error);
  }
}

async function createAdmin() {
  const adminUser: Prisma.UserCreateInput = {
    username: 'admin',
    passwordHash: await hashPassword('P#ssw0Rd'),
    role: 'ADMIN'
  };
  try {
    await prisma.user.create({ data: adminUser });
  } catch (error) {
    console.error(error);
  }
}

export async function createUsers() {
  try {
    await createUser();
    await createAdmin();
    console.log('Users created successfully');
  } catch (error) {
    console.error('Error creating users', error);
  } finally {
    await prisma.$disconnect();
  }
}
