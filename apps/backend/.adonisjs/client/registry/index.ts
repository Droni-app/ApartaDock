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
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/account/profile',
    tokens: [{"old":"/account/profile","type":0,"val":"account","end":""},{"old":"/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/account/logout',
    tokens: [{"old":"/account/logout","type":0,"val":"account","end":""},{"old":"/account/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['profile.access_tokens.destroy']['types'],
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
