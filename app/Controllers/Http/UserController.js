'use strict'

const User = use('App/Models/User')
const Database = use('Database')
const Helpers = use('Helpers')
const Files = use('App/Models/ProductFile')

class UserController {
  async index ({ request }) {
    const { page } = request.get()
    const users = await User.query().paginate(page)

    return users
  }

  async store ({ request, response }) {
    // const { permissions, roles, ...data } = request.only([
    //   'first_name',
    //   'last_name',
    //   'email',
    //   'password',
    //   'permissions',
    //   'roles'
    // ])
    const { permissions, roles, password_confirmation, ...data } = request.body

    // console.log(
    //   request.body,
    //   'Divisão',
    //   request.only([
    //     'first_name',
    //     'last_name',
    //     'email',
    //     'password',
    //     'permissions',
    //     'roles'
    //   ])
    // )

    const trx = await Database.beginTransaction()

    try {
      const images = request.file('files', { types: ['image'], size: '20mb' })
      const fileName = `${Date.now()}.${images.subtype}`
      await images.move(Helpers.tmpPath('uploads'), {
        name: fileName
      })
      if (!images.moved()) {
        throw images.error()
      }
      const user = await User.create({ ...data, avatar: images.fileName }, trx)

      if (roles) {
        await user.roles().attach(roles)
      }
      if (permissions) {
        await user.permissions().attach(permissions)
      }

      await user.loadMany(['roles', 'permissions'])

      await trx.commit()
      return user
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Erro no upload de arquivo' } })
    }
  }
  async show ({ params }) {
    const user = await User.findOrFail(params.id)

    await user.load('products')
    return user
  }
  async showAvatar ({ params, response }) {
    return response.download(Helpers.tmpPath(`uploads/${params.avatar}`))
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
    

    if (roles) {
      await user.roles().sync(roles)
    }
    if (permissions) {
      await user.permissions().sync(permissions)
    }

    user.merge(data, trx)
    await user.save()
    await user.loadMany(['roles', 'permissions'])
    await trx.commit()
    return user
  }
}

module.exports = UserController
