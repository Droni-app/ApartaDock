import type { HttpContext } from '@adonisjs/core/http'
import Enrollment from '#models/enrollment'
import { createEnrollmentValidator, updateEnrollmentValidator } from '#validators/admin/enrollment_validator'


export default class EnrollmentsController {
  /**
   * Display a list of resource
   */
  async index({ request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 20))

    const enrollments = await Enrollment.query().orderBy('updated_at', 'desc').paginate(page, limit)
    return enrollments
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createEnrollmentValidator)
    const enrollment = await Enrollment.create(payload)
    return enrollment
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const enrollment = await Enrollment.findOrFail(params.id)
    return enrollment
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const enrollment = await Enrollment.findOrFail(params.id)
    const payload = await request.validateUsing(updateEnrollmentValidator)
    enrollment.merge(payload)
    await enrollment.save()
    return enrollment
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const enrollment = await Enrollment.findOrFail(params.id)
    await enrollment.delete()
    return enrollment
  }
}