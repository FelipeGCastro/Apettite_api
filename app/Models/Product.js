'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Product extends Model {
  user () {
    return this.belongsTo('App/Models/User', 'provider_id', 'id')
  }

  orders () {
    return this.hasMany('App/Models/Order')
  }

  files () {
    return this.hasMany('App/Models/ProductFile')
  }
}

module.exports = Product
