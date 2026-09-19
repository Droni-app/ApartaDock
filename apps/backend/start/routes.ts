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
    router.get('redirect', [controllers.Auth, 'redirect'])
    router.get('google/callback', [controllers.Auth, 'callback']).as('google.callback')
    router.post('password/reset', [controllers.Auth, 'resetPassword']).as('password.reset')
    router.post('password/update/:id', [controllers.Auth, 'updatePassword']).as('password.update')
  })
  .prefix('auth')
  .as('auth')

router
  .group(() => {
    router.get('profile', [controllers.Profile, 'show'])
    router.put('profile/password', [controllers.Profile, 'updatePassword'])
    router.put('profile/updata', [controllers.Profile, 'upData'])
    router.get('me', [controllers.Auth, 'me'])
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
    router.post('imports/users', [controllers.admin.Imports, 'users'])
    router.resource('logs', controllers.admin.Logs).only(['index']).apiOnly()
  })
  .prefix('admin')
  .as('admin')
  .use([middleware.auth(), middleware.admin()])

// Board routes
router
  .group(() => {
    router
      .resource('parking-requests', controllers.board.ParkingRequests)
      .only(['index', 'show', 'update'])
      .apiOnly()
    router.resource('documents', controllers.board.Documents).apiOnly()
  })
  .prefix('board')
  .as('board')
  .use([middleware.auth(), middleware.board()])

// Security routes
router
  .group(() => {
    router.post('visitors/:id/checkin', [controllers.security.Visitors, 'checkin'])
    router.post('visitors/:id/checkout', [controllers.security.Visitors, 'checkout'])
    router.resource('visitors', controllers.security.Visitors).apiOnly().except(['destroy'])
    router.resource('units', controllers.security.Units).apiOnly().only(['index', 'show'])
  })
  .prefix('security')
  .as('security')
  .use([middleware.auth(), middleware.security()])

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
    router.resource('authorizations', controllers.user.Authorizations).apiOnly()
    router.resource('visitors', controllers.user.Visitors).only(['index', 'update', 'destroy'])
    router.resource('tickets', controllers.user.Tickets).only(['index', 'store', 'show'])
  })
  .prefix('user')
  .as('user')
  .use([middleware.auth()])
