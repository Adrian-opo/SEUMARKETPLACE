'use strict'

const Schema = use('Schema')

class ProdutoDigitalSchema extends Schema {
  up () {
    this.create('produtos_digitais', (table) => {
      table.increments()
      table.string('nome', 255).notNullable()
      table.text('descricao').notNullable()
      table.decimal('preco', 10, 2).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('produtos_digitais')
  }
}

module.exports = ProdutoDigitalSchema