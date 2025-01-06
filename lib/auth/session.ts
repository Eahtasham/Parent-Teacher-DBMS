import { cookies } from 'next/headers';
import { User } from './types';

export function createSession(user: User) {
  cookies().set('user', JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 // 24 hours
  });
}

export function clearSession() {
  cookies().delete('user');
}