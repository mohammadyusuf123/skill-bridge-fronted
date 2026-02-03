import { cookies } from 'next/headers';
import React from 'react';

export default async function Page() {

  const getSession = async () => {
    try {
        const cookieStore = await cookies();
        console.log('Cookies in getSession:', cookieStore);
      const res = await fetch(
        'https://skill-bridge-backend-sooty.vercel.app/api/auth/get-session',
        {
          headers: {
            Cookie: cookieStore.toString(),
          },
          cache: 'no-store',
          credentials: 'include' 
        }
      );

      if (!res.ok) {
        throw new Error('Failed to fetch session');
      }

      const session = await res.json();

      if (!session) {
        return { data: null, error: { message: 'Session is missing.' } };
      }

      return { data: session, error: null };
    } catch (err) {
      console.error(err);
      return { data: null, error: { message: 'Something went wrong' } };
    }
  };

  // ✅ MUST await here
  const session = await getSession();

  console.log('Session in session page:', session);

  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      This is from session
    </div>
  );
}
