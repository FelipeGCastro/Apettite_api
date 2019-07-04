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

      const images = request.file('files', { types: ['image'], size: '40mb' })

      if (images._files) {
        console.log('multiple images')
        await images.moveAll(Helpers.tmpPath('uploads'), file => ({
          name: `${Date.now()}-${file.clientName}`
        }))

        if (!images.movedAll()) {
          return images.errors()
        }

        await Promise.all(
          images.movedList().map(image =>
            product.files().create({
              path: image.fileName,
              product_id: params.products_id
            })
          )
        )
      } else {
        console.log('single images')
        const fileName = `${Date.now()}.${images.subtype}`
        await images.move(Helpers.tmpPath('uploads'), {
          name: fileName
        })
        if (!images.moved()) {
          throw images.error()
        }

        const files = Files.create({
          path: images.fileName,
          product_id: params.products_id
        })

        return files
      }
    } catch (error) {
      console.log(error)
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
