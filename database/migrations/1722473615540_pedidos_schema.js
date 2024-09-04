'use strict'

const Schema = use('Schema')

class PedidoSchema extends Schema {
  up () {
    this.create('pedidos', (table) => {
      table.increments()
      table.integer('cliente_id').unsigned().references('id').inTable('clientes').onDelete('CASCADE')
      table.integer('forma_pagamento_id').unsigned().references('id').inTable('forma_pagamentos').onDelete('CASCADE')
      table.dateTime('data_pedido').notNullable()
      table.string('status', 20).notNullable().defaultTo('pendente')
      table.decimal('valor_total', 10, 2).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('pedidos')
  }
}

module.exports = PedidoSchema