'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', table => {
      table.increments()
      table
        .string('first_name', 80)
        .notNullable()
      table
        .string('last_name', 80)
        .notNullable()
      table
        .string('email', 254)
        .notNullable()
        .unique()
      table.string('password', 60).notNullable()
      table.string('avatar')
      table.integer('phone_number')
      table
        .boolean('provider')
        .notNullable()
        .defaultTo(false)
      table
        .boolean('public')
        .notNullable()
        .defaultTo(true)
      table.string('token')
      table.timestamp('token_created_at')
      table.timestamps()

      // table
      //   .foreign('user_id', 'provider_id')
      //   .references('provider_id')
      //   .inTable('orders')
      //   .onUpdate('CASCADE')
      //   .onDelete('CASCADE')
      // table
      //   .foreign('user_id', 'provider_id')
      //   .references('provider_id')
      //   .inTable('orders')
      //   .onUpdate('CASCADE')
      //   .onDelete('CASCADE')
      // table
      //   .foreign('user_id', 'customer_id')
      //   .references('provider_id')
      //   .inTable('orders')
      //   .onUpdate('CASCADE')
      //   .onDelete('CASCADE')
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
