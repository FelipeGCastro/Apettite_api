'use strict'

const Offer = use('App/Models/OfferBooking')
const Product = use('App/Models/Product')

class OfferBookingController {
  async index ({ request, response, auth }) {
    const { id } = auth.user
    const offers = await Offer.query()
      .where('provider_id', id)
      .with('product')
      .fetch()

    return offers
  }

  async store ({ request, response, auth, params }) {
    const { id } = auth.user
    const productId = params.products_id
    const product = await Product.findOrFail(productId)

    const check = await Offer.query()
      .where('provider_id', id)
      .andWhere('product_id', productId)
      .fetch()

    if (check.rows.length) {
      return response.status(400).send({
        error: {
          message: 'Você já disponibilizou reserva para esse produto'
        },
        offerId: check
      })
    }

    if (!product.provider_id === id) {
      return response.status(400).send({
        error: {
          message:
            'Você não tem autorização para criar uma oferta de um produto que não é seu'
        }
      })
    }

    const data = request.only([
      'limited_amount',
      'total_amount',
      'limited_date',
      'start_date',
      'due_date',
      'comments'
    ])

    const offer = await Offer.create({
      ...data,
      product_id: productId,
      provider_id: id
    })
    return offer
  }

  async show ({ params }) {
    const offer = await Offer.findOrFail(params.id)

    return offer
  }

  async update ({ auth, params, request, response }) {
    const offer = await Offer.findOrFail(params.id)
    const { id } = auth.user
    const data = request.only([
      'limited_amount',
      'total_amount',
      'limited_date',
      'start_date',
      'due_date',
      'comments'
    ])
    if (!offer.provider_id === id) {
      return response.status(400).send({
        error: {
          message: 'Você não tem autorização para editar essa oferta'
        }
      })
    }

    offer.merge(data)

    await offer.save()
    return offer
  }

  async destroy ({ params, auth, response }) {
    const offer = await Offer.findOrFail(params.id)
    const { id } = auth.user
    if (!offer.provider_id === id) {
      return response.status(400).send({
        error: {
          message: 'Você não tem autorização para apagar essa oferta'
        }
      })
    }
    await offer.delete()
  }
}

module.exports = OfferBookingController
