'use strict'

const Schema = use('Schema')

class AddQuantidadeDisponivelToProdutosDigitaisSchema extends Schema {
  up () {
    this.table('produtos_digitais', (table) => {
      table.integer('quantidade_disponivel').unsigned().notNullable().defaultTo(0)
    })
  }

  down () {
    this.table('produtos_digitais', (table) => {
      table.dropColumn('quantidade_disponivel')
    })
  }
}

module.exports = AddQuantidadeDisponivelToProdutosDigitaisSchema