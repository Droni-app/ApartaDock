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
