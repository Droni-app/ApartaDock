export interface Authorization {
  id: number;
  unitId: number;
  userId: number;
  fullName: string;
  document: string;
  plate: string | null;
  authorizedDate: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface AuthorizationNew {
  unitId: number | null;
  fullName: string;
  document: string;
  plate: string | null;
  authorizedDate: string | null;
}
