/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'auth.auth.login': {
    methods: ["POST"]
    pattern: '/auth/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth_validator').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth_validator').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['login']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['login']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.password.reset': {
    methods: ["POST"]
    pattern: '/auth/password/reset'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['resetPassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['resetPassword']>>>
    }
  }
  'auth.password.update': {
    methods: ["POST"]
    pattern: '/auth/password/update/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth_validator').updatePasswordValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/auth_validator').updatePasswordValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['updatePassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['updatePassword']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'profile.profile.show': {
    methods: ["GET","HEAD"]
    pattern: '/account/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
    }
  }
  'profile.profile.update_password': {
    methods: ["PUT"]
    pattern: '/account/profile/password'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').updatePasswordValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').updatePasswordValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['updatePassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['updatePassword']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'profile.auth.logout': {
    methods: ["POST"]
    pattern: '/account/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['logout']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['logout']>>>
    }
  }
  'admin.users.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['index']>>>
    }
  }
  'admin.users.store': {
    methods: ["POST"]
    pattern: '/admin/users'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin/user_validator').createUserValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/admin/user_validator').createUserValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.users.show': {
    methods: ["GET","HEAD"]
    pattern: '/admin/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['show']>>>
    }
  }
  'admin.users.update': {
    methods: ["PUT","PATCH"]
    pattern: '/admin/users/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin/user_validator').updateUserValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/admin/user_validator').updateUserValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.users.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['destroy']>>>
    }
  }
  'admin.units.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/units'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/units_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/units_controller').default['index']>>>
    }
  }
  'admin.units.show': {
    methods: ["GET","HEAD"]
    pattern: '/admin/units/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/units_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/units_controller').default['show']>>>
    }
  }
  'admin.units.update': {
    methods: ["PUT","PATCH"]
    pattern: '/admin/units/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/units_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/units_controller').default['update']>>>
    }
  }
  'admin.enrollments.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/enrollments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/enrollments_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/enrollments_controller').default['index']>>>
    }
  }
  'admin.enrollments.store': {
    methods: ["POST"]
    pattern: '/admin/enrollments'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin/enrollment_validator').createEnrollmentValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/admin/enrollment_validator').createEnrollmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/enrollments_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/enrollments_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.enrollments.show': {
    methods: ["GET","HEAD"]
    pattern: '/admin/enrollments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/enrollments_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/enrollments_controller').default['show']>>>
    }
  }
  'admin.enrollments.update': {
    methods: ["PUT","PATCH"]
    pattern: '/admin/enrollments/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin/enrollment_validator').updateEnrollmentValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/admin/enrollment_validator').updateEnrollmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/enrollments_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/enrollments_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.enrollments.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/enrollments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/enrollments_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/enrollments_controller').default['destroy']>>>
    }
  }
  'admin.imports.users': {
    methods: ["POST"]
    pattern: '/admin/imports/users'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin/import_validator').usersValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/admin/import_validator').usersValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/imports_controller').default['users']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/imports_controller').default['users']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.logs.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/logs'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/logs_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/logs_controller').default['index']>>>
    }
  }
  'board.parking_requests.index': {
    methods: ["GET","HEAD"]
    pattern: '/board/parking-requests'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/board/parking_requests_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/board/parking_requests_controller').default['index']>>>
    }
  }
  'board.parking_requests.show': {
    methods: ["GET","HEAD"]
    pattern: '/board/parking-requests/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/board/parking_requests_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/board/parking_requests_controller').default['show']>>>
    }
  }
  'board.parking_requests.update': {
    methods: ["PUT","PATCH"]
    pattern: '/board/parking-requests/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/board/parking_request_validator').updateParkingRequestValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/board/parking_request_validator').updateParkingRequestValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/board/parking_requests_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/board/parking_requests_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'board.documents.index': {
    methods: ["GET","HEAD"]
    pattern: '/board/documents'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/board/documents_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/board/documents_controller').default['index']>>>
    }
  }
  'board.documents.store': {
    methods: ["POST"]
    pattern: '/board/documents'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/board/document_validator').createDocumentValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/board/document_validator').createDocumentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/board/documents_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/board/documents_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'board.documents.show': {
    methods: ["GET","HEAD"]
    pattern: '/board/documents/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/board/documents_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/board/documents_controller').default['show']>>>
    }
  }
  'board.documents.update': {
    methods: ["PUT","PATCH"]
    pattern: '/board/documents/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/board/document_validator').updateDocumentValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/board/document_validator').updateDocumentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/board/documents_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/board/documents_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'board.documents.destroy': {
    methods: ["DELETE"]
    pattern: '/board/documents/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/board/documents_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/board/documents_controller').default['destroy']>>>
    }
  }
  'user.enrollments.index': {
    methods: ["GET","HEAD"]
    pattern: '/user/enrollments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/enrollments_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/user/enrollments_controller').default['index']>>>
    }
  }
  'user.enrollments.show': {
    methods: ["GET","HEAD"]
    pattern: '/user/enrollments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/enrollments_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/user/enrollments_controller').default['show']>>>
    }
  }
  'user.vehicles.index': {
    methods: ["GET","HEAD"]
    pattern: '/user/vehicles'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/vehicles_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/user/vehicles_controller').default['index']>>>
    }
  }
  'user.vehicles.store': {
    methods: ["POST"]
    pattern: '/user/vehicles'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user/vehicle_validator').createVehicleValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user/vehicle_validator').createVehicleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/vehicles_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/user/vehicles_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'user.vehicles.show': {
    methods: ["GET","HEAD"]
    pattern: '/user/vehicles/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/vehicles_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/user/vehicles_controller').default['show']>>>
    }
  }
  'user.vehicles.update': {
    methods: ["PUT","PATCH"]
    pattern: '/user/vehicles/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user/vehicle_validator').updateVehicleValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/user/vehicle_validator').updateVehicleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/vehicles_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/user/vehicles_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'user.vehicles.destroy': {
    methods: ["DELETE"]
    pattern: '/user/vehicles/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/vehicles_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/user/vehicles_controller').default['destroy']>>>
    }
  }
  'user.attachments.index': {
    methods: ["GET","HEAD"]
    pattern: '/user/attachments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/attachments_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/user/attachments_controller').default['index']>>>
    }
  }
  'user.attachments.store': {
    methods: ["POST"]
    pattern: '/user/attachments'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/attachment').storeAttachmentValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/attachment').storeAttachmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/attachments_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/user/attachments_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'user.attachments.show': {
    methods: ["GET","HEAD"]
    pattern: '/user/attachments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/attachments_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/user/attachments_controller').default['show']>>>
    }
  }
  'user.attachments.update': {
    methods: ["PUT","PATCH"]
    pattern: '/user/attachments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/attachments_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/user/attachments_controller').default['update']>>>
    }
  }
  'user.attachments.destroy': {
    methods: ["DELETE"]
    pattern: '/user/attachments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/attachments_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/user/attachments_controller').default['destroy']>>>
    }
  }
  'user.attachments.download': {
    methods: ["POST"]
    pattern: '/user/attachments/download'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/attachments_controller').default['download']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/user/attachments_controller').default['download']>>>
    }
  }
  'user.documents.index': {
    methods: ["GET","HEAD"]
    pattern: '/user/documents'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/documents_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/user/documents_controller').default['index']>>>
    }
  }
  'user.documents.show': {
    methods: ["GET","HEAD"]
    pattern: '/user/documents/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/documents_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/user/documents_controller').default['show']>>>
    }
  }
}
