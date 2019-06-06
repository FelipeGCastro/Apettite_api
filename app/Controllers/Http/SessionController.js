'use strict'

class SessionController {
  async store ({ request, auth }) {
    const { email, password } = request.all()

    const token = await auth.attempt(email, password)

    return token
  }
  async check ({ auth, response }) {
    try {
      await auth.check()
      return auth.user.token
    } catch (error) {
      return response.send('You are not logged in')
    }
  }
}

module.exports = SessionController
