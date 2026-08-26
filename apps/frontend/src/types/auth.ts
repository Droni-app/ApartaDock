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

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  documentType: string;
  document: string;
  role: string;
  phone: string;
  consentDate: string | null;
  createdAt: string;
  updatedAt: string;
}