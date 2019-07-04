'use strict'

const Model = use('Model')
const Env = use('Env')

class ProductFile extends Model {
  static get computed () {
    return ['url']
  }

  getUrl ({ id, product_id }) {
    return `${Env.get('APP_URL')}/products/${product_id}/files/${id}`
  }

  product () {
    return this.belongsTo('App/Models/Product')
  }
}

module.exports = ProductFile
