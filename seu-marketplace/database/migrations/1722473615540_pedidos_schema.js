'use strict'

const Schema = use('Schema')

class PedidoSchema extends Schema {
  up () {
    this.create('pedidos', (table) => {
      table.increments()
      table.datetime('data_pedido').notNullable()
      table.string('status', 20).notNullable()
      table.decimal('valor_total', 10, 2).notNullable()
      table.integer('cliente_id').unsigned().references('id').inTable('clientes')
      table.integer('forma_pagamento_id').unsigned().references('id').inTable('forma_pagamentos')
      table.timestamps()
    })
  }

  down () {
    this.drop('pedidos')
  }
}

module.exports = PedidoSchema