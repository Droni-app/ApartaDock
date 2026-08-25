/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    auth: {
      login: typeof routes['auth.auth.login']
    }
    password: {
      reset: typeof routes['auth.password.reset']
      update: typeof routes['auth.password.update']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
      updatePassword: typeof routes['profile.profile.update_password']
    }
    auth: {
      logout: typeof routes['profile.auth.logout']
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
      users: typeof routes['admin.imports.users']
    }
    logs: {
      index: typeof routes['admin.logs.index']
    }
  }
  board: {
    parkingRequests: {
      index: typeof routes['board.parking_requests.index']
      show: typeof routes['board.parking_requests.show']
      update: typeof routes['board.parking_requests.update']
    }
    documents: {
      index: typeof routes['board.documents.index']
      store: typeof routes['board.documents.store']
      show: typeof routes['board.documents.show']
      update: typeof routes['board.documents.update']
      destroy: typeof routes['board.documents.destroy']
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
    attachments: {
      index: typeof routes['user.attachments.index']
      store: typeof routes['user.attachments.store']
      show: typeof routes['user.attachments.show']
      update: typeof routes['user.attachments.update']
      destroy: typeof routes['user.attachments.destroy']
      download: typeof routes['user.attachments.download']
    }
    documents: {
      index: typeof routes['user.documents.index']
      show: typeof routes['user.documents.show']
    }
  }
}
