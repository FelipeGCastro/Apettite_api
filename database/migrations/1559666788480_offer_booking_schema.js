'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OfferBookingSchema extends Schema {
  up () {
    this.create('offer_bookings', table => {
      table.increments()
      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .notNullable()
      table
        .integer('provider_id')
        .unsigned()
        .notNullable()
      table
        .foreign('provider_id')
        .references('users.id')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.text('comments')

      table
        .boolean('limited_amount')
        .notNullable()
        .defaultTo(false)
      table.integer('total_amount')

      table
        .boolean('limited_date')
        .notNullable()
        .defaultTo(false)
      table.timestamp('start_date')
      table.timestamp('due_date')
      table.integer('strategy')
      table
        .boolean('active')
        .notNullable()
        .defaultTo(true)
      table
        .boolean('expired')
        .notNullable()
        .defaultTo(false)

      table.timestamps()
    })
  }

  down () {
    this.drop('offer_bookings')
  }
}

module.exports = OfferBookingSchema
