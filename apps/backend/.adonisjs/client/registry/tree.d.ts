/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    auth: {
      login: typeof routes['auth.auth.login']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
  }
  admin: {
    users: {
      index: typeof routes['admin.users.index']
      store: typeof routes['admin.users.store']
      show: typeof routes['admin.users.show']
      update: typeof routes['admin.users.update']
      destroy: typeof routes['admin.users.destroy']
    }
    units: {
      index: typeof routes['admin.units.index']
      show: typeof routes['admin.units.show']
      update: typeof routes['admin.units.update']
    }
    enrollments: {
      index: typeof routes['admin.enrollments.index']
      store: typeof routes['admin.enrollments.store']
      show: typeof routes['admin.enrollments.show']
      update: typeof routes['admin.enrollments.update']
      destroy: typeof routes['admin.enrollments.destroy']
    }
    imports: {
      parkingRequests: typeof routes['admin.imports.parking_requests']
    }
  }
  board: {
    parkingRequests: {
      dashboard: typeof routes['board.parking_requests.dashboard']
      index: typeof routes['board.parking_requests.index']
      show: typeof routes['board.parking_requests.show']
      update: typeof routes['board.parking_requests.update']
    }
  }
}
