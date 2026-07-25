export interface ApiWrappedResponse<T> {
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  meta?: {
    currentPage?: number
    lastPage?: number
    perPage?: number
    total?: number
  }
}

export interface ApiErrorResponse {
  errors?: Array<{ message?: string }>
  message?: string
}
