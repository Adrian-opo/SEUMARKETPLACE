'use strict'

const Schema = use('Schema')

class ItensCarrinhoSchema extends Schema {
  up () {
    this.create('itens_carrinho', (table) => {
      table.increments()
      table.integer('carrinho_id').unsigned().references('id').inTable('carrinhos').onDelete('CASCADE') // Relaciona com o carrinho
      table.integer('produto_digital_id').unsigned().references('id').inTable('produtos_digitais').onDelete('CASCADE')  // Relaciona com o produto digital
      table.integer('quantidade').unsigned().notNullable()  // Quantidade do produto
      table.timestamps()
    })
  }

  down () {
    this.drop('itens_carrinho')
  }
}

module.exports = ItensCarrinhoSchema