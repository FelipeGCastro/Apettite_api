'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderSchema extends Schema {
  up () {
    this.create('orders', table => {
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

      table.integer('amount')
      table.integer('pending_amount')
      table.decimal('total_price_pending')
      table.decimal('total_price_paid')
      table.integer('total_amount_paid')
      table
        .string('status')
        .notNullable()
        .defaultTo('opened')
      table
        .string('status_pending')
        .notNullable()
        .defaultTo('opened')
      table.timestamps()
    })
  }

  down () {
    this.drop('orders')
  }
}

module.exports = OrderSchema
