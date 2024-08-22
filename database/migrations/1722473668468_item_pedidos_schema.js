'use strict'

const Schema = use('Schema')

class ItemPedidoSchema extends Schema {
  up () {
    this.create('item_pedidos', (table) => {
      table.increments()
      table.integer('quantidade').notNullable()
      table.decimal('valor_unitario', 10, 2).notNullable()
      table.integer('produto_digital_id').unsigned().references('id').inTable('produto_digitals')
      table.integer('pedido_id').unsigned().references('id').inTable('pedidos')
      table.timestamps()
    })
  }

  down () {
    this.drop('item_pedidos')
  }
}

module.exports = ItemPedidoSchema