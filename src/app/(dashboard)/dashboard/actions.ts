'use server';

import { getUser } from '@/lib/auth/queries';
import { getAllRegularUsers } from '@/lib/db/queries';

export async function getAllUsers() {
  const user = await getUser();
  if (!user) {
    return { ok: false, message: 'Unauthorized', data: null };
  }
  // get all users with Role of 'USER'
  try {
    const data = await getAllRegularUsers();
    return { ok: true, message: 'success', data };
  } catch (_error) {
    return { ok: false, message: 'error getting data', data: null };
  }
}
