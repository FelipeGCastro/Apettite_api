'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BookingSchema extends Schema {
  up () {
    this.create('bookings', table => {
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
      table
        .integer('customer_id')
        .unsigned()
        .notNullable()
      table
        .foreign('customer_id')
        .references('users.id')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')

      table.text('comments')

      table.integer('amount').notNullable()
      table.decimal('total_price_amount')
      table
        .boolean('confirmed')
        .notNullable()
        .defaultTo(false)
      table
        .string('status_pending')
        .notNullable()
        .defaultTo('opened')
      table.timestamps()
    })
  }

  down () {
    this.drop('bookings')
  }
}

module.exports = BookingSchema
