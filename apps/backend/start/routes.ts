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
    router.post('logout', [controllers.AccessTokens, 'destroy'])
  })
  .prefix('account')
  .as('profile')
  .use(middleware.auth())

router
  .group(() => {
    router.resource('users', UsersController).apiOnly()
    router.resource('units', UnitsController).only(['index', 'show', 'update']).apiOnly()
  })
  .prefix('admin')
  .as('admin')
  .use([middleware.auth(), middleware.admin()])
