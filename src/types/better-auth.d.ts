// types/better-auth.d.ts or add to your existing types
import 'better-auth';

declare module 'better-auth' {
  interface User {
    role: 'STUDENT' | 'TUTOR' | 'ADMIN';
    phone?: string | null;
    status?: string;
  }
}

declare module 'better-auth/react' {
  interface User {
    role: 'STUDENT' | 'TUTOR' | 'ADMIN';
    phone?: string | null;
    status?: string;
  }
}