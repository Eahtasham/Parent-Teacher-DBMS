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
    let retryCount = 0;
    const maxRetries = 3;

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        if (!mounted) return;

        if (!response.ok) {
          throw new Error('Auth check failed');
        }

        const data = await response.json();

        if (data.user) {
          setUser(data.user);
          setLoading(false);
        } else if (pathname !== '/login' && pathname !== '/') {
          router.replace('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(checkAuth, 1000); // Retry after 1 second
        } else if (pathname !== '/login' && pathname !== '/') {
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
  }, [router, pathname]);

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { 
        method: 'POST',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      setUser(null);
      router.replace('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { user, loading, logout };
}