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
    router.post('logout', [controllers.Auth, 'logout'])
  })
  .prefix('account')
  .as('profile')
  .use(middleware.auth())

// Admin routes
router
  .group(() => {
    router.resource('users', controllers.admin.Users).apiOnly()
    router.resource('units', controllers.admin.Units).only(['index', 'show', 'update']).apiOnly()
    router.resource('enrollments', controllers.admin.Enrollments).apiOnly()
    router.post('imports/parking-requests', [controllers.admin.Imports, 'parking_requests'])
    router.post('imports/units', [controllers.admin.Imports, 'units'])
    router.resource('logs', controllers.admin.Logs).only(['index']).apiOnly()
  })
  .prefix('admin')
  .as('admin')
  .use([middleware.auth(), middleware.admin()])

// Board routes
router
  .group(() => {
    router.get('parking-requests/dashboard', [controllers.board.ParkingRequests, 'dashboard'])
    router.post('parking-requests/reject-by-debt', [
      controllers.board.ParkingRequests,
      'rejectByDebt',
    ])
    router
      .resource('parking-requests', controllers.board.ParkingRequests)
      .only(['index', 'show', 'update'])
      .apiOnly()
    router.resource('documents', controllers.board.Documents).apiOnly()
  })
  .prefix('board')
  .as('board')
  .use([middleware.auth(), middleware.board()])

// User routes
router
  .group(() => {
    router.resource('enrollments', controllers.user.Enrollments).only(['index', 'show'])
    router.resource('vehicles', controllers.user.Vehicles).apiOnly()
    router.resource('attachments', controllers.user.Attachments).apiOnly()
    router
      .post('attachments/download', [controllers.user.Attachments, 'download'])
      .as('attachments.download')
    router.resource('documents', controllers.user.Documents).only(['index', 'show'])
  })
  .prefix('user')
  .as('user')
  .use([middleware.auth()])
