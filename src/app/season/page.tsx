import { cookies } from 'next/headers';
import React from 'react';

export default async function Page() {
  const getSession = async () => {
    try {
      const cookieStore = await cookies();
      
      // ✅ Convert cookies to proper Cookie header format
      const cookieHeader = cookieStore
        .getAll()
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join('; ');

      console.log('Cookie header:', cookieHeader);

      const res = await fetch(
        'https://skill-bridge-backend-production-27ac.up.railway.app/api/auth/session', // ✅ Use /session not /get-session
        {
          headers: {
            Cookie: cookieHeader, // ✅ Properly formatted cookie string
          },
          cache: 'no-store',
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Session fetch failed:', res.status, errorText);
        throw new Error('Failed to fetch session');
      }

      const session = await res.json();
      return { data: session, error: null };
    } catch (err) {
      console.error('Session error:', err);
      return { data: null, error: { message: 'Session is missing.' } };
    }
  };

  const session = await getSession();

  console.log('Session in session page:', session);

  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <p>This is from session</p>
    </div>
  );
}