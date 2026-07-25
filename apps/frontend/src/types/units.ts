export interface Unit {
  id: number
  name: string
  tower: number
  apto: number
  floor: number
  typology: number | boolean
  buildArea: string | null
  privateArea: string | null
  coefficient: string | null
  status: string
}
