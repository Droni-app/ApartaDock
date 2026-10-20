import type { AuthUser } from '@/types/account/profile'

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  user: AuthUser;
  enrollments: EnrollmentsItem[];
  token: string;
}

export interface EnrollmentsItem {
  id: number;
  userId: number;
  unitId: number;
  role: string;
  createdAt: string;
  updatedAt: string;
}
