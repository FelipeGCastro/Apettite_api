'use strict'

const Helpers = use('Helpers')
const Product = use('App/Models/Product')
const Files = use('App/Models/ProductFile')

class ProductFileController {
  async index ({ params }) {
    const files = await Files.query()
      .where('product_id', params.products_id)
      .fetch()

    return files
  }
  async show ({ params, response }) {
    const file = await Files.findOrFail(params.id)

    return response.download(Helpers.tmpPath(`uploads/${file.path}`))
  }

  async store ({ params, request, response }) {
    try {
      if (!request.file('files')) return

      const product = await Product.findOrFail(params.products_id)

      const images = request.file('files', { types: ['image'], size: '20mb' })

      await images.moveAll(Helpers.tmpPath('uploads'), file => ({
        name: `${Date.now()}-${file.clientName}`
      }))

      if (!images.movedAll()) {
        return images.errors()
      }

      await Promise.all(
        images
          .movedList()
          .map(image => product.files().create({ path: image.fileName }))
      )
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Erro no upload de arquivo' } })
    }
  }
  async destroy ({ params, request, response }) {
    const image = await Files.findOrFail(params.id)

    await image.delete()
  }
}

module.exports = ProductFileController
