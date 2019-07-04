'use strict'

class SessionController {
  async store ({ request, auth }) {
    const { email, password } = request.all()

    const token = await auth.attempt(email, password)

    return token
  }
  async show ({ auth }) {
    const user = auth.user

    return user
  }
}

module.exports = SessionController
