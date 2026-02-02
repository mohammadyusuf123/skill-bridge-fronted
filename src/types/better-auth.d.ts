import "better-auth";

declare module "better-auth" {
  interface User {
    role: "STUDENT" | "TUTOR" | "ADMIN";
    status?: string;
    phone?: string | null;
  }

  interface Session {
    user: User;
  }
}
