'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Order extends Model {
  static boot () {
    super.boot()

    this.addHook('afterSave', 'OrderHook.sendPendingOrderMail')
  }

  product () {
    return this.belongsTo('App/Models/Product')
  }
  customer () {
    return this.belongsTo('App/Models/User', 'customer_id', 'id')
  }
  provider () {
    return this.belongsTo('App/Models/User', 'provider_id', 'id')
  }
}

module.exports = Order
