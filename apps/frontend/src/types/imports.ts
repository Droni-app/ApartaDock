export interface ImportError {
  index: number
  row: string
  message: string
}

export interface ParkingRequestImportResult {
  total: number
  processed: number
  users: { created: number; updated: number }
  vehicles: { created: number; updated: number }
  parkingRequests: { created: number }
  enrollments: { created: number; updated: number }
  errors: ImportError[]
}
