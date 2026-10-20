export interface NewTicket {
  unitId: number;
  name: string;
  owners: string[];
  content: string;
  attachment: string | null;
}
export interface Ticket {
  id: number;
  userId: number;
  unitId: number;
  name: string;
  owners: string[];
  priority: string | null;
  content: string;
  attachment: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  unit: Unit;
}

export interface Unit {
  id: number;
  name: string;
  tower: number;
  apto: number;
  floor: number;
  typology: number;
  buildArea: string;
  privateArea: string;
  coefficient: string;
  status: string;
  notes: null;
  createdAt: string;
  updatedAt: string;
}