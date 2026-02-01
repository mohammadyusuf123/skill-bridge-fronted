import 'better-auth';

declare module 'better-auth' {
  interface User {
    role: 'STUDENT' | 'TUTOR' | 'ADMIN';
    status?: 'ACTIVE' | 'BANNED' | 'SUSPENDED';
  }
}
