'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from '@/lib/auth/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        if (!mounted) return;

        const data = await response.json();

        if (response.ok && data.user) {
          setUser(data.user);
        } else if (pathname.startsWith('/parent/') || pathname.startsWith('/teacher/')) {
          router.replace('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (pathname.startsWith('/parent/') || pathname.startsWith('/teacher/')) {
          router.replace('/login');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [pathname, router]);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      router.replace('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { user, loading, logout };
}