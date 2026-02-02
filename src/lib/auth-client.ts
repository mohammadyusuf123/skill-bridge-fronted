import { createAuthClient } from "better-auth/react";
import type { UserRole, UserStatus } from '@/types';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL 
    ? `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/auth`
    : "http://localhost:3000/auth", // fallback for build time
  fetchOptions: {
    credentials: "include",
  },
});



export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;