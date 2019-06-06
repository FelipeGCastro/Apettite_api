'use strict'

const Order = use('App/Models/Order')
const Product = use('App/Models/Product')

class OrderController {
  async index ({ auth }) {
    const { id } = auth.user
    const orders = await Order.query()
      .where('customer_id', id)
      .with('provider')
      .fetch()

    return orders
  }

  async store ({ auth, request, params, response }) {
    const { id } = auth.user
    const productId = params.products_id
    const product = await Product.findOrFail(productId)

    const check = await Order.query()
      .where('customer_id', id)
      .andWhere('product_id', productId)
      .fetch()

    if (check.rows.length) {
      return response.status(400).send({
        error: {
          message: 'Você já tem uma ordem para esse produto'
        },
        orderId: check
      })
    }
    const amount = request.input('amount')
    const amountPrice = product.price * amount
    const order = await Order.create({
      amount,
      customer_id: id,
      product_id: product.id,
      total_price_pending: amountPrice,
      pending_amount: amount,
      total_amount_paid: null,
      total_price_paid: null,
      provider_id: product.provider_id
    })
    return order
  }

  async show ({ params }) {
    const order = await Order.findOrFail(params.id)

    return order
  }

  async update ({ params, request }) {
    const order = await Order.findOrFail(params.id)
    const product = await Product.findOrFail(order.product_id)
    const amount = request.input('amount')
    const amountPrice = product.price * amount
    console.log(amount, order.amount)
    const data = {
      pending_amount: order.pending_amount + amount,
      total_price_pending:
        parseFloat(order.total_price_pending) + parseFloat(amountPrice),
      total_amount_paid: null,
      total_price_paid: null,
      amount: amount
    }

    order.merge(data)

    await order.save()
    return order
  }

  async destroy ({ params, auth, response }) {
    const order = await Order.findOrFail(params.id)
    const { id } = auth.user
    if (!order.customer_id === id) {
      return response.status(400).send({
        error: {
          message: 'Você não tem autorização para apagar essa oferta'
        }
      })
    }
    await order.delete()
  }
}
module.exports = OrderController

// const checkOrder = await Order.query()
//   .where({
//     customer_id: id,
//     product_id: productId
//   })
//   .fetch()
