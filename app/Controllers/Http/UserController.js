'use strict'

const User = use('App/Models/User')
const Database = use('Database')

class UserController {
  async store ({ request }) {
    const { permissions, roles, ...data } = request.only([
      'first_name',
      'last_name',
      'email',
      'password',
      'permissions',
      'roles'
    ])

    const trx = await Database.beginTransaction()
    const user = await User.create(data, trx)

    if (roles) {
      await user.roles().attach(roles)
    }
    if (permissions) {
      await user.permissions().attach(permissions)
    }

    await user.loadMany(['roles', 'permissions'])

    await trx.commit()
    return user
  }
  async update ({ request, params }) {
    const { permissions, roles, ...data } = request.only([
      'first_name',
      'last_name',
      'email',
      'password',
      'permissions',
      'roles'
    ])
    const trx = await Database.beginTransaction()
    const user = await User.findOrFail(params.id)
    await user.save()

    if (roles) {
      await user.roles().sync(roles)
    }
    if (permissions) {
      await user.permissions().sync(permissions)
    }

    user.merge(data, trx)
    await user.loadMany(['roles', 'permissions'])
    await trx.commit()
    return user
  }
}

module.exports = UserController
