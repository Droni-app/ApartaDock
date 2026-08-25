import type { HttpContext } from '@adonisjs/core/http'
import { readFile } from 'node:fs/promises'
import { usersValidator } from '#validators/admin/import_validator'
import string from '@adonisjs/core/helpers/string'
import User from '#models/user'
import Unit from '#models/unit'
import Enrollment from '#models/enrollment'

export default class ImportsController {
  async users({ request }: HttpContext) {
    // Validate the request
    const payload = await request.validateUsing(usersValidator)
    if (!payload.file.tmpPath) {
      throw new Error('File not found')
    }
    // Parse CSV to json
    const fileBuffer = await readFile(payload.file.tmpPath)
    const fileContent = fileBuffer.toString('utf-8')
    const rows = fileContent
      .split('\n')
      .map((row) => row.split(',').map((cell) => cell.trim()))
      .filter((row) => row.length > 0)
      .map((row) => ({
        fullName: string.capitalCase(row[0]),
        email: row[1].toLowerCase(),
        documentType: row[2] as 'CC' | 'CE' | 'TI' | 'PP',
        document:
          row[3]?.length > 5 ? row[3] : 'temp_' + Math.random().toString(36).substring(2, 15),
        phone: row[4],
        unit: Number(row[5]),
        role: row[6] as 'tenant' | 'owner' | 'resident',
      }))
    rows.shift() // Remove header row
    //return rows

    // Loop records and insert them into the database
    const createdUsers: Enrollment[] = []
    const failedUsers: { row: any; error: string }[] = []

    for (const row of rows) {
      const user = await User.firstOrCreate(
        { email: row.email },
        {
          password: 'temp_' + Math.random().toString(36).substring(2, 15),
          fullName: row.fullName,
          documentType: row.documentType,
          document: row.document,
          phone: row.phone,
          role: row.role,
        }
      )
      const unit = await Unit.findByOrFail('name', row.unit).catch(() => {
        failedUsers.push({ row, error: `Unit ${row.unit} not found` })
        return null
      })
      const enrollment = await Enrollment.firstOrCreate(
        { userId: user.id, unitId: unit?.id || 0 },
        { role: row.role }
      )
      createdUsers.push(enrollment)
    }
    return { createdUsers, failedUsers }
  }
}
//fullName	email	documentType	document	phone	unit	role
