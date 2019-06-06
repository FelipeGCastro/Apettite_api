'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
  up () {
    this.create('products', table => {
      table.increments()
      table
        .integer('provider_id')
        .unsigned()
        .notNullable()
      table
        .foreign('provider_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')

      table.string('name').notNullable()
      table.text('description').notNullable()
      table.decimal('price').notNullable()
      table
        .boolean('public')
        .notNullable()
        .defaultTo(true)
      table
        .boolean('available')
        .notNullable()
        .defaultTo(true)
      table.timestamps()
    })
  }

  down () {
    this.drop('products')
  }
}

module.exports = ProductSchema
