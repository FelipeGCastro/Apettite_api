'use strict'

const Model = use('Model')
const Env = use('Env')

class ProductFile extends Model {
  static get computed () {
    return ['url']
  }

  getUrl ({ id, path }) {
    return `${Env.get('APP_URL')}/product/${id}/files/${path}`
  }

  product () {
    return this.belongsTo('App/Models/Product')
  }
}

module.exports = ProductFile
