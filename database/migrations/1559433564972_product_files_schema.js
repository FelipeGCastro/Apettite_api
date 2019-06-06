'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductFilesSchema extends Schema {
  up () {
    this.create('product_files', table => {
      table.increments()
      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .notNullable()
      table.string('path').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('product_files')
  }
}

module.exports = ProductFilesSchema
