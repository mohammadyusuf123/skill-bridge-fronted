import { createAuthClient } from "better-auth/react";
import { usernameClient } from 'better-auth/client/plugins'
const API_URL = 'https://skill-bridge-backend-sooty.vercel.app/api/auth' 
const APP_NAME = 'Skill Bridge'
export const authClient = createAuthClient({
   baseURL: API_URL,
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
