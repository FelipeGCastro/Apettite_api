'use strict'

class SessionController {
  async store ({ request, auth }) {
    const { email, password } = request.all()

    const token = await auth.attempt(email, password)

    return token
  }
  async show ({ auth }) {
    const { id } = auth.user

    return id
  }
}

module.exports = SessionController
