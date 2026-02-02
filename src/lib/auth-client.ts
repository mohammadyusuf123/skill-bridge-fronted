import { User, UserRole, UserStatus } from "@/types";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/auth`,
  fetchOptions: {
    credentials: "include",
  },
});
// Extend Better Auth types to match your AppUser
export type AppUser = User & {
  status?: UserStatus;
}
export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
