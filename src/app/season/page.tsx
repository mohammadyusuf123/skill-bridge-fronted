// app/season/page.tsx - UPDATED VERSION
'use client'; // Must be a client component

import { useSession } from '@/lib/auth-client'; // Your auth client
import { redirect } from 'next/navigation';

export default function SeasonPage() {
  // ✅ Use the auth client's session hook
  const { data: session, error } = useSession();
  
  console.log('Session from useSession():', session);
  
 
  if (!session || error) {
    // Redirect to login if no session
    redirect('/login');
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Session Data</h1>
      <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
        {JSON.stringify(session, null, 2)}
      </pre>
      <p className="mt-4">Welcome, {session.user?.email}!</p>
    </div>
  );
}