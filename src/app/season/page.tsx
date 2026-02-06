// app/season/page.tsx - DEBUG VERSION
'use client';

import { useSession } from '@/lib/auth-client';
import { useState, useEffect } from 'react';

export default function SeasonPage() {
  const { data: session, error } = useSession();
  const [rawFetchResult, setRawFetchResult] = useState<any>(null);

  // Direct fetch to compare
  useEffect(() => {
    async function testDirectFetch() {
      try {
        const response = await fetch(
          'https://skill-bridge-backend-production-27ac.up.railway.app/api/auth/get-session',
          {
            credentials: 'include',
            headers: { 'Accept': 'application/json' }
          }
        );
        const data = await response.json();
        console.log('Direct fetch result:', data);
        setRawFetchResult(data);
      } catch (err) {
        console.error('Direct fetch error:', err);
      }
    }
    testDirectFetch();
  }, []);

  console.log('DEBUG - useSession():', {
    session,
    error,
    hasSession: !!session,
    sessionType: typeof session
  });

 

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Session Data</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">From useSession():</h2>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
          {JSON.stringify({ session,error }, null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">From Direct Fetch:</h2>
        <pre className="bg-blue-100 p-4 rounded-lg overflow-auto">
          {JSON.stringify(rawFetchResult, null, 2)}
        </pre>
      </div>

      {/* Don't redirect yet - let's see the data first */}
    </div>
  );
}