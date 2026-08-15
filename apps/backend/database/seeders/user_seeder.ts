import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.updateOrCreateMany('email', [
      {
        fullName: 'Administrador General',
        email: 'admin@apartadock.com',
        password: 'Admin1234!',
        documentType: 'CC',
        document: '1000000001',
        role: 'admin',
        phone: '3000000001',
      },
      {
        fullName: 'Residente Demo',
        email: 'residente@apartadock.com',
        password: 'User1234!',
        documentType: 'CC',
        document: '1000000002',
        role: 'user',
        phone: '3000000002',
      },
      {
        fullName: 'Operador Demo',
        email: 'operador@apartadock.com',
        password: 'User1234!',
        documentType: 'CE',
        document: 'X100000003',
        role: 'user',
        phone: '3000000003',
      },
    ])
  }
}
