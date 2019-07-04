'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
const Env = use('Env')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async userInstance => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }
  static get computed () {
    return ['url']
  }

  getUrl ({ avatar }) {
    return `${Env.get('APP_URL')}/avatar/${avatar}`
  }

  tokens () {
    return this.hasMany('App/Models/Token')
  }

  products () {
    return this.hasMany('App/Models/Product', 'id', 'provider_id')
  }

  orders () {
    return this.hasMany('App/Models/Order')
  }

  static get traits () {
    return [
      '@provider:Adonis/Acl/HasRole',
      '@provider:Adonis/Acl/HasPermission'
    ]
  }
}

module.exports = User
