import { createAuthClient } from "better-auth/react";
import { usernameClient } from 'better-auth/client/plugins'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
const APP_NAME = 'Skill Bridge'
export const authClient = createAuthClient({
   baseURL: API_URL,
  basePath: "/auth",
  baseURLType: 'server',
  plugins: [usernameClient()],
  // Enable smooth cookie handling
  fetchOptions: {
    credentials: 'include',
  },
  // Session fetching configuration
  sessionFetchOptions: {
    cache: 'no-store',
  },
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
