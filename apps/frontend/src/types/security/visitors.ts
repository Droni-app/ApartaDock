export type VisitorVehicleType = 'car' | 'motorcycle'

export interface Visitor {
  id: number
  userId: number
  unitId: number
  authorizationId: number | null
  fullName: string
  document: string | null
  plate: string | null
  vehicleType: VisitorVehicleType | null
  checkinDate: string | null
  checkoutDate: string | null
  createdAt: string
  updatedAt: string
  unit?: {
    id: number
    name: string
    tower: number
    apto: number
    floor: number
    typology: number
    status: string
  } | null
}

export interface VisitorForm {
  unitId: number | null
  authorizationId: number | null
  fullName: string
  document: string
  plate: string | null
  vehicleType: VisitorVehicleType | null
  checkinDate: string | null
  checkoutDate: string | null
}
