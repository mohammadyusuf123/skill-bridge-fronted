import { userService } from '@/services/userSeason';
import React from 'react'

export default async function page() {
   const { data: session} = await userService.getSession();
  console.log('Session data:', session);
  return (
    <div>This is from season</div>
  )
}
