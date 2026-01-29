'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as ReduxProvider } from 'react-redux';
import { makeStore } from '@/store';
import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { apiClient } from '@/lib/api-client';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  const [store] = useState(() => makeStore());

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ReduxProvider>
  );
}

// Auth provider to sync session with API client
function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.session?.token) {
      apiClient.setAuthToken(session.session.token);
    } else {
      apiClient.clearAuthToken();
    }
  }, [session]);

  return <>{children}</>;
}
