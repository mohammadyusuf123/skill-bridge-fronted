import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: 'https://skill-bridge-backend-sooty.vercel.app/api/auth',
    fetchOptions: {
    credentials: 'include', // <-- important!
  },
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
