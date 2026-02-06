import { createAuthClient } from "better-auth/react";
import { usernameClient } from 'better-auth/client/plugins'
const API_URL = 'https://skill-bridge-backend-production-27ac.up.railway.app/api/auth' 
const APP_NAME = 'Skill Bridge'
// Define your custom user type
interface CustomUser {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'TUTOR' | 'ADMIN';
  phone?: string | null;
  status?: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
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
}) as any


export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
