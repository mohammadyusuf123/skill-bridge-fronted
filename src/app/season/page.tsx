import { userService } from '@/services/userSeason';
import { cookies } from 'next/headers';
import React from 'react'

export default  function page() {
 const  getSession=async () => {
    try {
      const cookieStore = await cookies();

      console.log(cookieStore.toString());

      const res = await fetch(`https://skill-bridge-backend-sooty.vercel.app/api/auth/get-session`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const session = await res.json();

      console.log(session);

      if (session === null) {
        return { data: null, error: { message: "Session is missing." } };
      }

      return { data: session, error: null };
    } catch (err) {
      console.error(err);
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  }
  const session =  getSession();
  console.log('Session in season page:', session);
  return (
    <div>This is from season</div>
  )
}
