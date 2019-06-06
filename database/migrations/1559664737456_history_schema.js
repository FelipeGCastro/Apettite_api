'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HistorySchema extends Schema {
  up () {
    this.create('histories', table => {
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
        .references('id')
        .inTable('users')
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
      table.string('provider_name')
      table.string('customer_name')
      table.integer('amount')
      table.decimal('total_price_paid')
      table.timestamp('date_at')
      table.timestamps()
    })
  }

  down () {
    this.drop('histories')
  }
}

module.exports = HistorySchema
