import { cookies } from 'next/headers';
import React from 'react';

export default async function Page() {
async function getSession() {
  try {
    // TRY BOTH ENDPOINTS
    const endpoints = [
      'https://skill-bridge-backend-production-27ac.up.railway.app/api/auth/session',
      'https://skill-bridge-backend-production-27ac.up.railway.app/api/auth/get-session'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          credentials: 'include', // CRITICAL
          headers: {
            'Accept': 'application/json',
            'Origin': 'https://skill-bridge-fronted-production.up.railway.app'
          }
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

  const session = await getSession();

  console.log('Session in session page:', session);

  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <p>This is from session</p>
    </div>
  );
}