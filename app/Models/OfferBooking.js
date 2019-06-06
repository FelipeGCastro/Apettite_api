'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OfferBooking extends Model {
  product () {
    return this.belongsTo('App/Models/Product')
  }
  provider () {
    return this.belongsTo('App/Models/User', 'provider_id', 'id')
  }
}

module.exports = OfferBooking
