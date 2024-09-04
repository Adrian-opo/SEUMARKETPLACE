'use strict'

const Schema = use('Schema')

class ProdutoPedidoSchema extends Schema {
  up () {
    this.create('produtos_pedido', (table) => {
      table.increments()
      table.integer('pedido_id').unsigned().references('id').inTable('pedidos').onDelete('CASCADE')
      table.integer('produto_digital_id').unsigned().references('id').inTable('produtos_digitais').onDelete('CASCADE')
      table.integer('quantidade').notNullable()
      table.decimal('valor_unitario', 10, 2).notNullable()
      table.string('serial', 255).nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('produtos_pedido')
  }
}

module.exports = ProdutoPedidoSchema