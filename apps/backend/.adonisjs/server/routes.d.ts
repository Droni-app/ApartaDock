import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.auth.login': { paramsTuple?: []; params?: {} }
    'auth.password.reset': { paramsTuple?: []; params?: {} }
    'auth.password.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.profile.update_password': { paramsTuple?: []; params?: {} }
    'profile.auth.logout': { paramsTuple?: []; params?: {} }
    'admin.users.index': { paramsTuple?: []; params?: {} }
    'admin.users.store': { paramsTuple?: []; params?: {} }
    'admin.users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.units.index': { paramsTuple?: []; params?: {} }
    'admin.units.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.units.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.enrollments.index': { paramsTuple?: []; params?: {} }
    'admin.enrollments.store': { paramsTuple?: []; params?: {} }
    'admin.enrollments.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.enrollments.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.enrollments.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.imports.users': { paramsTuple?: []; params?: {} }
    'admin.logs.index': { paramsTuple?: []; params?: {} }
    'board.parking_requests.dashboard': { paramsTuple?: []; params?: {} }
    'board.parking_requests.reject_by_debt': { paramsTuple?: []; params?: {} }
    'board.parking_requests.index': { paramsTuple?: []; params?: {} }
    'board.parking_requests.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'board.parking_requests.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'board.documents.index': { paramsTuple?: []; params?: {} }
    'board.documents.store': { paramsTuple?: []; params?: {} }
    'board.documents.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'board.documents.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'board.documents.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user.enrollments.index': { paramsTuple?: []; params?: {} }
    'user.enrollments.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user.vehicles.index': { paramsTuple?: []; params?: {} }
    'user.vehicles.store': { paramsTuple?: []; params?: {} }
    'user.vehicles.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user.vehicles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user.vehicles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user.attachments.index': { paramsTuple?: []; params?: {} }
    'user.attachments.store': { paramsTuple?: []; params?: {} }
    'user.attachments.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user.attachments.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user.attachments.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user.attachments.download': { paramsTuple?: []; params?: {} }
    'user.documents.index': { paramsTuple?: []; params?: {} }
    'user.documents.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'admin.users.index': { paramsTuple?: []; params?: {} }
    'admin.users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.units.index': { paramsTuple?: []; params?: {} }
    'admin.units.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.enrollments.index': { paramsTuple?: []; params?: {} }
    'admin.enrollments.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.logs.index': { paramsTuple?: []; params?: {} }
    'board.parking_requests.dashboard': { paramsTuple?: []; params?: {} }
    'board.parking_requests.index': { paramsTuple?: []; params?: {} }
    'board.parking_requests.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'board.documents.index': { paramsTuple?: []; params?: {} }
    'board.documents.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user.enrollments.index': { paramsTuple?: []; params?: {} }
    'user.enrollments.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user.vehicles.index': { paramsTuple?: []; params?: {} }
    'user.vehicles.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user.attachments.index': { paramsTuple?: []; params?: {} }
    'user.attachments.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user.documents.index': { paramsTuple?: []; params?: {} }
    'user.documents.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'admin.users.index': { paramsTuple?: []; params?: {} }
    'admin.users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.units.index': { paramsTuple?: []; params?: {} }
    'admin.units.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.enrollments.index': { paramsTuple?: []; params?: {} }
    'admin.enrollments.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.logs.index': { paramsTuple?: []; params?: {} }
    'board.parking_requests.dashboard': { paramsTuple?: []; params?: {} }
    'board.parking_requests.index': { paramsTuple?: []; params?: {} }
    'board.parking_requests.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'board.documents.index': { paramsTuple?: []; params?: {} }
    'board.documents.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user.enrollments.index': { paramsTuple?: []; params?: {} }
    'user.enrollments.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user.vehicles.index': { paramsTuple?: []; params?: {} }
    'user.vehicles.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user.attachments.index': { paramsTuple?: []; params?: {} }
    'user.attachments.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user.documents.index': { paramsTuple?: []; params?: {} }
    'user.documents.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.auth.login': { paramsTuple?: []; params?: {} }
    'auth.password.reset': { paramsTuple?: []; params?: {} }
    'auth.password.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.auth.logout': { paramsTuple?: []; params?: {} }
    'admin.users.store': { paramsTuple?: []; params?: {} }
    'admin.enrollments.store': { paramsTuple?: []; params?: {} }
    'admin.imports.users': { paramsTuple?: []; params?: {} }
    'board.parking_requests.reject_by_debt': { paramsTuple?: []; params?: {} }
    'board.documents.store': { paramsTuple?: []; params?: {} }
    'user.vehicles.store': { paramsTuple?: []; params?: {} }
    'user.attachments.store': { paramsTuple?: []; params?: {} }
    'user.attachments.download': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'profile.profile.update_password': { paramsTuple?: []; params?: {} }
    'admin.users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.units.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.enrollments.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'board.parking_requests.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'board.documents.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user.vehicles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user.attachments.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'admin.users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.units.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.enrollments.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'board.parking_requests.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'board.documents.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user.vehicles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user.attachments.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'admin.users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.enrollments.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'board.documents.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user.vehicles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user.attachments.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}