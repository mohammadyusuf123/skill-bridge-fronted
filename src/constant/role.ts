export const Roles = {
  admin: 'ADMIN',
  tutor: 'TUTOR',
  student: 'STUDENT',
} as const;

export type Role = typeof Roles[keyof typeof Roles];