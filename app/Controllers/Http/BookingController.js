'use strict'

const Product = use('App/Models/Product')
const Offer = use('App/Models/OfferBooking')
const Booking = use('App/Models/Booking')

class BookingController {
  async index ({ auth }) {
    const { id } = auth.user
    const books = await Booking.query()
      .where('customer_id', id)
      .with('product')
      .fetch()

    return books
  }

  async store ({ auth, request, response, params }) {
    const { id } = auth.user
    const productId = params.products_id
    const offer = await Offer.findByOrFail('product_id', productId)
    const product = await Product.findOrFail(productId)
    const check = await Booking.query()
      .where('customer_id', id)
      .andWhere('product_id', productId)
      .fetch()

    if (check.rows.length) {
      return response.status(400).send({
        error: {
          message: 'Você já possui uma reserva para esse produto'
        },
        bookingId: check
      })
    }

    // amount
    // total_price_amount
    // confirmed
    // status_pending
    const data = request.only(['amount', 'total_price_amount', 'comments'])
    console.log(data.amount)
    const amountPrice = product.price * data.amount
    const booking = await Booking.create({
      ...data,
      total_price_amount: amountPrice,
      product_id: parseInt(productId),
      provider_id: offer.provider_id,
      customer_id: id
    })
    return booking
  }

  async show ({ auth, params, response }) {
    const { id } = auth.user
    const book = await Booking.findOrFail(params.id)
    if (!book.customer_id === id || book.provider_id === params.products_id) {
      return response.status(400).send({
        error: {
          message: 'Você não tem autorização para apagar essa reserva'
        }
      })
    }
    return book
  }

  async update ({ auth, params, request, response }) {
    const { id } = auth.user
    const productId = params.products_id
    const product = await Product.findOrFail(productId)
    const book = await Booking.findOrFail(params.id)

    if (!book.customer_id === id || !book.provider_id === id) {
      return response.status(400).send({
        error: {
          message: 'Você não tem autorização para apagar essa reserva'
        }
      })
    }
    if (book.provider_id === id) {
      const data = request.input('confirmed')
      book.merge(data)
      await book.save()
    } else {
      const data = request.only([
        'amount',
        'total_price_amount',
        'comments',
        'confirmed'
      ])
      const amountPrice = product.price * data.amount
      book.merge({
        ...data,
        total_price_amount: amountPrice
      })
    }

    return book
  }

  async destroy ({ auth, params, response }) {
    const books = await Booking.findOrFail(params.products_id)
    const { id } = auth.user
    if (!books.customer_id === id || books.provider_id === params.products_id) {
      return response.status(400).send({
        error: {
          message: 'Você não tem autorização para apagar essa reserva'
        }
      })
    }
    await books.delete()
  }
}

module.exports = BookingController
