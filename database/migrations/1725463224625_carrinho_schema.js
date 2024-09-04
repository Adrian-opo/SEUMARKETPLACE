'use strict'

const Schema = use('Schema')

class CarrinhoSchema extends Schema {
  up () {
    this.create('carrinhos', (table) => {
      table.increments()
      table.integer('cliente_id').unsigned().references('id').inTable('clientes').onDelete('CASCADE')  // Relaciona o carrinho ao cliente
      table.timestamps()
    })
  }

  down () {
    this.drop('carrinhos')
  }
}

module.exports = CarrinhoSchema