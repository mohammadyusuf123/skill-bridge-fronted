// app/season/page.tsx - SERVER COMPONENT
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// This runs on the SERVER, so we need to pass cookies manually
async function getSessionFromBackend() {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    
    // Convert cookies to header string
    const cookieHeader = allCookies
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');
    
    const endpoints = [
      'https://skill-bridge-backend-production-27ac.up.railway.app/api/auth/session',
      'https://skill-bridge-backend-production-27ac.up.railway.app/api/auth/get-session'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cookie': cookieHeader, // Pass cookies manually
            'Origin': 'https://skill-bridge-fronted-production.up.railway.app'
          },
          cache: 'no-store' // Important for auth
        });
        
        console.log(`Trying ${endpoint}:`, response.status);
        
        if (response.ok) {
          const session = await response.json();
          console.log('Session found at:', endpoint, session);
          return session;
        }
      } catch (error) {
        console.log(`Failed at ${endpoint}:`, error);
      }
    }
    
    throw new Error('No session endpoint worked');
  } catch (error) {
    console.error('Session fetch failed:', error);
    return { data: null, error: { message: 'Session is missing.' } };
  }
}

export default async function SeasonPage() {
  const session = await getSessionFromBackend();
  
  console.log('Session in season page:', session);
  
  if (!session?.data) {
    // Redirect to login if no session
    redirect('/login');
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Session Data</h1>
      <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
        {JSON.stringify(session, null, 2)}
      </pre>
      <p className="mt-4">This is from session page</p>
    </div>
  );
}