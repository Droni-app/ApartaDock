/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.auth.login': {
    methods: ["POST"],
    pattern: '/auth/login',
    tokens: [{"old":"/auth/login","type":0,"val":"auth","end":""},{"old":"/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.auth.login']['types'],
  },
  'auth.password.reset': {
    methods: ["POST"],
    pattern: '/auth/password/reset',
    tokens: [{"old":"/auth/password/reset","type":0,"val":"auth","end":""},{"old":"/auth/password/reset","type":0,"val":"password","end":""},{"old":"/auth/password/reset","type":0,"val":"reset","end":""}],
    types: placeholder as Registry['auth.password.reset']['types'],
  },
  'auth.password.update': {
    methods: ["POST"],
    pattern: '/auth/password/update/:id',
    tokens: [{"old":"/auth/password/update/:id","type":0,"val":"auth","end":""},{"old":"/auth/password/update/:id","type":0,"val":"password","end":""},{"old":"/auth/password/update/:id","type":0,"val":"update","end":""},{"old":"/auth/password/update/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['auth.password.update']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/account/profile',
    tokens: [{"old":"/account/profile","type":0,"val":"account","end":""},{"old":"/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.profile.update_password': {
    methods: ["PUT"],
    pattern: '/account/profile/password',
    tokens: [{"old":"/account/profile/password","type":0,"val":"account","end":""},{"old":"/account/profile/password","type":0,"val":"profile","end":""},{"old":"/account/profile/password","type":0,"val":"password","end":""}],
    types: placeholder as Registry['profile.profile.update_password']['types'],
  },
  'profile.auth.logout': {
    methods: ["POST"],
    pattern: '/account/logout',
    tokens: [{"old":"/account/logout","type":0,"val":"account","end":""},{"old":"/account/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['profile.auth.logout']['types'],
  },
  'admin.users.index': {
    methods: ["GET","HEAD"],
    pattern: '/admin/users',
    tokens: [{"old":"/admin/users","type":0,"val":"admin","end":""},{"old":"/admin/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['admin.users.index']['types'],
  },
  'admin.users.store': {
    methods: ["POST"],
    pattern: '/admin/users',
    tokens: [{"old":"/admin/users","type":0,"val":"admin","end":""},{"old":"/admin/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['admin.users.store']['types'],
  },
  'admin.users.show': {
    methods: ["GET","HEAD"],
    pattern: '/admin/users/:id',
    tokens: [{"old":"/admin/users/:id","type":0,"val":"admin","end":""},{"old":"/admin/users/:id","type":0,"val":"users","end":""},{"old":"/admin/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.users.show']['types'],
  },
  'admin.users.update': {
    methods: ["PUT","PATCH"],
    pattern: '/admin/users/:id',
    tokens: [{"old":"/admin/users/:id","type":0,"val":"admin","end":""},{"old":"/admin/users/:id","type":0,"val":"users","end":""},{"old":"/admin/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.users.update']['types'],
  },
  'admin.users.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/users/:id',
    tokens: [{"old":"/admin/users/:id","type":0,"val":"admin","end":""},{"old":"/admin/users/:id","type":0,"val":"users","end":""},{"old":"/admin/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.users.destroy']['types'],
  },
  'admin.units.index': {
    methods: ["GET","HEAD"],
    pattern: '/admin/units',
    tokens: [{"old":"/admin/units","type":0,"val":"admin","end":""},{"old":"/admin/units","type":0,"val":"units","end":""}],
    types: placeholder as Registry['admin.units.index']['types'],
  },
  'admin.units.show': {
    methods: ["GET","HEAD"],
    pattern: '/admin/units/:id',
    tokens: [{"old":"/admin/units/:id","type":0,"val":"admin","end":""},{"old":"/admin/units/:id","type":0,"val":"units","end":""},{"old":"/admin/units/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.units.show']['types'],
  },
  'admin.units.update': {
    methods: ["PUT","PATCH"],
    pattern: '/admin/units/:id',
    tokens: [{"old":"/admin/units/:id","type":0,"val":"admin","end":""},{"old":"/admin/units/:id","type":0,"val":"units","end":""},{"old":"/admin/units/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.units.update']['types'],
  },
  'admin.enrollments.index': {
    methods: ["GET","HEAD"],
    pattern: '/admin/enrollments',
    tokens: [{"old":"/admin/enrollments","type":0,"val":"admin","end":""},{"old":"/admin/enrollments","type":0,"val":"enrollments","end":""}],
    types: placeholder as Registry['admin.enrollments.index']['types'],
  },
  'admin.enrollments.store': {
    methods: ["POST"],
    pattern: '/admin/enrollments',
    tokens: [{"old":"/admin/enrollments","type":0,"val":"admin","end":""},{"old":"/admin/enrollments","type":0,"val":"enrollments","end":""}],
    types: placeholder as Registry['admin.enrollments.store']['types'],
  },
  'admin.enrollments.show': {
    methods: ["GET","HEAD"],
    pattern: '/admin/enrollments/:id',
    tokens: [{"old":"/admin/enrollments/:id","type":0,"val":"admin","end":""},{"old":"/admin/enrollments/:id","type":0,"val":"enrollments","end":""},{"old":"/admin/enrollments/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.enrollments.show']['types'],
  },
  'admin.enrollments.update': {
    methods: ["PUT","PATCH"],
    pattern: '/admin/enrollments/:id',
    tokens: [{"old":"/admin/enrollments/:id","type":0,"val":"admin","end":""},{"old":"/admin/enrollments/:id","type":0,"val":"enrollments","end":""},{"old":"/admin/enrollments/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.enrollments.update']['types'],
  },
  'admin.enrollments.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/enrollments/:id',
    tokens: [{"old":"/admin/enrollments/:id","type":0,"val":"admin","end":""},{"old":"/admin/enrollments/:id","type":0,"val":"enrollments","end":""},{"old":"/admin/enrollments/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.enrollments.destroy']['types'],
  },
  'admin.imports.users': {
    methods: ["POST"],
    pattern: '/admin/imports/users',
    tokens: [{"old":"/admin/imports/users","type":0,"val":"admin","end":""},{"old":"/admin/imports/users","type":0,"val":"imports","end":""},{"old":"/admin/imports/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['admin.imports.users']['types'],
  },
  'admin.logs.index': {
    methods: ["GET","HEAD"],
    pattern: '/admin/logs',
    tokens: [{"old":"/admin/logs","type":0,"val":"admin","end":""},{"old":"/admin/logs","type":0,"val":"logs","end":""}],
    types: placeholder as Registry['admin.logs.index']['types'],
  },
  'board.parking_requests.dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/board/parking-requests/dashboard',
    tokens: [{"old":"/board/parking-requests/dashboard","type":0,"val":"board","end":""},{"old":"/board/parking-requests/dashboard","type":0,"val":"parking-requests","end":""},{"old":"/board/parking-requests/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['board.parking_requests.dashboard']['types'],
  },
  'board.parking_requests.reject_by_debt': {
    methods: ["POST"],
    pattern: '/board/parking-requests/reject-by-debt',
    tokens: [{"old":"/board/parking-requests/reject-by-debt","type":0,"val":"board","end":""},{"old":"/board/parking-requests/reject-by-debt","type":0,"val":"parking-requests","end":""},{"old":"/board/parking-requests/reject-by-debt","type":0,"val":"reject-by-debt","end":""}],
    types: placeholder as Registry['board.parking_requests.reject_by_debt']['types'],
  },
  'board.parking_requests.index': {
    methods: ["GET","HEAD"],
    pattern: '/board/parking-requests',
    tokens: [{"old":"/board/parking-requests","type":0,"val":"board","end":""},{"old":"/board/parking-requests","type":0,"val":"parking-requests","end":""}],
    types: placeholder as Registry['board.parking_requests.index']['types'],
  },
  'board.parking_requests.show': {
    methods: ["GET","HEAD"],
    pattern: '/board/parking-requests/:id',
    tokens: [{"old":"/board/parking-requests/:id","type":0,"val":"board","end":""},{"old":"/board/parking-requests/:id","type":0,"val":"parking-requests","end":""},{"old":"/board/parking-requests/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['board.parking_requests.show']['types'],
  },
  'board.parking_requests.update': {
    methods: ["PUT","PATCH"],
    pattern: '/board/parking-requests/:id',
    tokens: [{"old":"/board/parking-requests/:id","type":0,"val":"board","end":""},{"old":"/board/parking-requests/:id","type":0,"val":"parking-requests","end":""},{"old":"/board/parking-requests/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['board.parking_requests.update']['types'],
  },
  'board.documents.index': {
    methods: ["GET","HEAD"],
    pattern: '/board/documents',
    tokens: [{"old":"/board/documents","type":0,"val":"board","end":""},{"old":"/board/documents","type":0,"val":"documents","end":""}],
    types: placeholder as Registry['board.documents.index']['types'],
  },
  'board.documents.store': {
    methods: ["POST"],
    pattern: '/board/documents',
    tokens: [{"old":"/board/documents","type":0,"val":"board","end":""},{"old":"/board/documents","type":0,"val":"documents","end":""}],
    types: placeholder as Registry['board.documents.store']['types'],
  },
  'board.documents.show': {
    methods: ["GET","HEAD"],
    pattern: '/board/documents/:id',
    tokens: [{"old":"/board/documents/:id","type":0,"val":"board","end":""},{"old":"/board/documents/:id","type":0,"val":"documents","end":""},{"old":"/board/documents/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['board.documents.show']['types'],
  },
  'board.documents.update': {
    methods: ["PUT","PATCH"],
    pattern: '/board/documents/:id',
    tokens: [{"old":"/board/documents/:id","type":0,"val":"board","end":""},{"old":"/board/documents/:id","type":0,"val":"documents","end":""},{"old":"/board/documents/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['board.documents.update']['types'],
  },
  'board.documents.destroy': {
    methods: ["DELETE"],
    pattern: '/board/documents/:id',
    tokens: [{"old":"/board/documents/:id","type":0,"val":"board","end":""},{"old":"/board/documents/:id","type":0,"val":"documents","end":""},{"old":"/board/documents/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['board.documents.destroy']['types'],
  },
  'user.enrollments.index': {
    methods: ["GET","HEAD"],
    pattern: '/user/enrollments',
    tokens: [{"old":"/user/enrollments","type":0,"val":"user","end":""},{"old":"/user/enrollments","type":0,"val":"enrollments","end":""}],
    types: placeholder as Registry['user.enrollments.index']['types'],
  },
  'user.enrollments.show': {
    methods: ["GET","HEAD"],
    pattern: '/user/enrollments/:id',
    tokens: [{"old":"/user/enrollments/:id","type":0,"val":"user","end":""},{"old":"/user/enrollments/:id","type":0,"val":"enrollments","end":""},{"old":"/user/enrollments/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['user.enrollments.show']['types'],
  },
  'user.vehicles.index': {
    methods: ["GET","HEAD"],
    pattern: '/user/vehicles',
    tokens: [{"old":"/user/vehicles","type":0,"val":"user","end":""},{"old":"/user/vehicles","type":0,"val":"vehicles","end":""}],
    types: placeholder as Registry['user.vehicles.index']['types'],
  },
  'user.vehicles.store': {
    methods: ["POST"],
    pattern: '/user/vehicles',
    tokens: [{"old":"/user/vehicles","type":0,"val":"user","end":""},{"old":"/user/vehicles","type":0,"val":"vehicles","end":""}],
    types: placeholder as Registry['user.vehicles.store']['types'],
  },
  'user.vehicles.show': {
    methods: ["GET","HEAD"],
    pattern: '/user/vehicles/:id',
    tokens: [{"old":"/user/vehicles/:id","type":0,"val":"user","end":""},{"old":"/user/vehicles/:id","type":0,"val":"vehicles","end":""},{"old":"/user/vehicles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['user.vehicles.show']['types'],
  },
  'user.vehicles.update': {
    methods: ["PUT","PATCH"],
    pattern: '/user/vehicles/:id',
    tokens: [{"old":"/user/vehicles/:id","type":0,"val":"user","end":""},{"old":"/user/vehicles/:id","type":0,"val":"vehicles","end":""},{"old":"/user/vehicles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['user.vehicles.update']['types'],
  },
  'user.vehicles.destroy': {
    methods: ["DELETE"],
    pattern: '/user/vehicles/:id',
    tokens: [{"old":"/user/vehicles/:id","type":0,"val":"user","end":""},{"old":"/user/vehicles/:id","type":0,"val":"vehicles","end":""},{"old":"/user/vehicles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['user.vehicles.destroy']['types'],
  },
  'user.attachments.index': {
    methods: ["GET","HEAD"],
    pattern: '/user/attachments',
    tokens: [{"old":"/user/attachments","type":0,"val":"user","end":""},{"old":"/user/attachments","type":0,"val":"attachments","end":""}],
    types: placeholder as Registry['user.attachments.index']['types'],
  },
  'user.attachments.store': {
    methods: ["POST"],
    pattern: '/user/attachments',
    tokens: [{"old":"/user/attachments","type":0,"val":"user","end":""},{"old":"/user/attachments","type":0,"val":"attachments","end":""}],
    types: placeholder as Registry['user.attachments.store']['types'],
  },
  'user.attachments.show': {
    methods: ["GET","HEAD"],
    pattern: '/user/attachments/:id',
    tokens: [{"old":"/user/attachments/:id","type":0,"val":"user","end":""},{"old":"/user/attachments/:id","type":0,"val":"attachments","end":""},{"old":"/user/attachments/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['user.attachments.show']['types'],
  },
  'user.attachments.update': {
    methods: ["PUT","PATCH"],
    pattern: '/user/attachments/:id',
    tokens: [{"old":"/user/attachments/:id","type":0,"val":"user","end":""},{"old":"/user/attachments/:id","type":0,"val":"attachments","end":""},{"old":"/user/attachments/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['user.attachments.update']['types'],
  },
  'user.attachments.destroy': {
    methods: ["DELETE"],
    pattern: '/user/attachments/:id',
    tokens: [{"old":"/user/attachments/:id","type":0,"val":"user","end":""},{"old":"/user/attachments/:id","type":0,"val":"attachments","end":""},{"old":"/user/attachments/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['user.attachments.destroy']['types'],
  },
  'user.attachments.download': {
    methods: ["POST"],
    pattern: '/user/attachments/download',
    tokens: [{"old":"/user/attachments/download","type":0,"val":"user","end":""},{"old":"/user/attachments/download","type":0,"val":"attachments","end":""},{"old":"/user/attachments/download","type":0,"val":"download","end":""}],
    types: placeholder as Registry['user.attachments.download']['types'],
  },
  'user.documents.index': {
    methods: ["GET","HEAD"],
    pattern: '/user/documents',
    tokens: [{"old":"/user/documents","type":0,"val":"user","end":""},{"old":"/user/documents","type":0,"val":"documents","end":""}],
    types: placeholder as Registry['user.documents.index']['types'],
  },
  'user.documents.show': {
    methods: ["GET","HEAD"],
    pattern: '/user/documents/:id',
    tokens: [{"old":"/user/documents/:id","type":0,"val":"user","end":""},{"old":"/user/documents/:id","type":0,"val":"documents","end":""},{"old":"/user/documents/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['user.documents.show']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
