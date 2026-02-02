'use client';

import { useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { apiClient } from '@/lib/api-client';

export function AuthTokenProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    // When session changes, get a fresh JWT token
    const fetchToken = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/auth/get-backend-token');
          if (response.ok) {
            const { token } = await response.json();
            if (token) {
              apiClient.setToken(token);
            }
          }
        } catch (error) {
          console.error('Failed to fetch backend token:', error);
        }
      } else {
        // No session, clear the token
        apiClient.clearToken();
      }
    };

    fetchToken();
  }, [session]);

  return <>{children}</>;
}