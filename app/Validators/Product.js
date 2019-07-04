'use strict'
const Antl = use('Antl')
class Product {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      name: 'required',
      description: 'required',
      price: 'required'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Product
