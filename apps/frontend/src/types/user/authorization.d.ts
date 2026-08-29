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
  unit: Unit
}
export interface Unit {
  id: number
  name: string
  tower: number
  apto: number
  floor: number
  typology: number
  buildArea: string
  privateArea: string
  coefficient: string
  status: string
  notes: any
  createdAt: string
  updatedAt: string
}
export interface AuthorizationNew {
  unitId: number | null;
  fullName: string;
  document: string;
  plate: string | null;
  authorizedDate: string | null;
}

