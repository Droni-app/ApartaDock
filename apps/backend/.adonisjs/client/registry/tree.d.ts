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
      updatePassword: typeof routes['profile.profile.update_password']
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
      units: typeof routes['admin.imports.units']
    }
    logs: {
      index: typeof routes['admin.logs.index']
    }
  }
  board: {
    parkingRequests: {
      dashboard: typeof routes['board.parking_requests.dashboard']
      rejectByDebt: typeof routes['board.parking_requests.reject_by_debt']
      index: typeof routes['board.parking_requests.index']
      show: typeof routes['board.parking_requests.show']
      update: typeof routes['board.parking_requests.update']
    }
    minutes: {
      index: typeof routes['board.minutes.index']
      store: typeof routes['board.minutes.store']
      show: typeof routes['board.minutes.show']
      update: typeof routes['board.minutes.update']
      destroy: typeof routes['board.minutes.destroy']
    }
  }
  user: {
    enrollments: {
      index: typeof routes['user.enrollments.index']
      show: typeof routes['user.enrollments.show']
    }
    vehicles: {
      index: typeof routes['user.vehicles.index']
      store: typeof routes['user.vehicles.store']
      show: typeof routes['user.vehicles.show']
      update: typeof routes['user.vehicles.update']
      destroy: typeof routes['user.vehicles.destroy']
    }
  }
}
