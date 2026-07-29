export type VehicleType = 'car' | 'motorcycle' | 'bicycle' | 'truck' | 'other'

export interface Vehicle {
  id: number
  userId: number
  plate: string | null
  isOwner: boolean | null
  ownerCard: string
  ownerName: string
  ownerDocument: string
  driverLicense: string | null
  brand: string | null
  model: string | null
  color: string | null
  year: number
  vehicleType: VehicleType | string
}
