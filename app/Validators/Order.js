'use strict'
const Antl = use('Antl')
class Order {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      amount: 'required'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Order
