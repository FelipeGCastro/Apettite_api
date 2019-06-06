'use strict'

const Product = use('App/Models/Product')
const User = use('App/Models/User')

class ProductController {
  async index ({ request }) {
    const { page } = request.get()
    const products = await Product.query()
      .with('user')
      .paginate(page)

    return products
  }

  async store ({ auth, request }) {
    const { id } = auth.user
    const user = await User.findOrFail(id)

    const data = request.only([
      'name',
      'description',
      'price',
      'public',
      'available'
    ])

    const product = Product.create({ ...data, provider_id: id })
    user.merge({ provider: true })
    await user.save()
    return product
  }

  async show ({ params }) {
    const product = await Product.findOrFail(params.id)

    await product.loadMany(['user', 'files'])
    return product
  }

  async update ({ params, request }) {
    const product = await Product.findOrFail(params.id)
    const data = request.only([
      'name',
      'description',
      'price',
      'public',
      'available'
    ])

    product.merge(data)
    await product.save()
    return product
  }

  async destroy ({ params }) {
    const product = await Product.findOrFail(params.id)

    await product.delete()
  }
}

module.exports = ProductController

/**
 * Delete a product with id.
 * DELETE products/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 */
