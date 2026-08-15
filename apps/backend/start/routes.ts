/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import UsersController from '#controllers/admin/users_controller'
import UnitsController from '#controllers/admin/units_controller'
import EnrollmentsController from '#controllers/admin/enrollments_controller'
import ImportsController from '#controllers/admin/imports_controller'
import LogsController from '#controllers/admin/logs_controller'
import BoardParkingRequestsController from '#controllers/board/parking_requests_controller'
import BoardMinutesController from '#controllers/board/minutes_controller'
import BoardDocumentsController from '#controllers/board/documents_controller'
import UserEnrollmentsController from '#controllers/user/enrollments_controller'
import UserVehiclesController from '#controllers/user/vehicles_controller'
import UserAttachmentsController from '#controllers/user/attachments_controller'

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router.post('login', [controllers.Auth, 'login'])
  })
  .prefix('auth')
  .as('auth')

router
  .group(() => {
    router.get('profile', [controllers.Profile, 'show'])
    router.put('profile/password', [controllers.Profile, 'updatePassword'])
    router.post('logout', [controllers.AccessTokens, 'destroy'])
  })
  .prefix('account')
  .as('profile')
  .use(middleware.auth())

router
  .group(() => {
    router.resource('users', UsersController).apiOnly()
    router.resource('units', UnitsController).only(['index', 'show', 'update']).apiOnly()
    router.resource('enrollments', EnrollmentsController).apiOnly()
    router.post('imports/parking-requests', [ImportsController, 'parking_requests'])
    router.post('imports/units', [ImportsController, 'units'])
    router.resource('logs', LogsController).only(['index']).apiOnly()
  })
  .prefix('admin')
  .as('admin')
  .use([middleware.auth(), middleware.admin()])

router
  .group(() => {
    router.get('parking-requests/dashboard', [BoardParkingRequestsController, 'dashboard'])
    router.post('parking-requests/reject-by-debt', [BoardParkingRequestsController, 'rejectByDebt'])
    router.resource('parking-requests', BoardParkingRequestsController).only(['index', 'show', 'update']).apiOnly()
    router.resource('minutes', BoardMinutesController).apiOnly()
    router.resource('documents', BoardDocumentsController).apiOnly()
  })
  .prefix('board')
  .as('board')
  .use([middleware.auth(), middleware.board()])

router
  .group(() => {
    router.resource('enrollments', UserEnrollmentsController).only(['index', 'show']).apiOnly()
    router.resource('vehicles', UserVehiclesController).apiOnly()
    router.resource('attachments', UserAttachmentsController).apiOnly()
    router.post('attachments/download', [UserAttachmentsController, 'download']).as('attachments.download')
  })
  .prefix('user')
  .as('user')
  .use([middleware.auth()])
