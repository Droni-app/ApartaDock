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

export interface ValidationErrors {
  errors: ErrorsItem[];
}

export interface ErrorsItem {
  message: string;
  rule: string;
  field: string;
}