'use strict'

const Schema = use('Schema')

class ProdutoDigitalSchema extends Schema {
  up () {
    this.create('produto_digitals', (table) => {
      table.increments()
      table.string('nome', 255).notNullable()
      table.text('descricao').notNullable()
      table.decimal('preco', 10, 2).notNullable()
      table.string('tipo_gift', 10).notNullable()
      table.string('serial', 255)
      table.timestamps()
    })
  }

  down () {
    this.drop('produto_digitals')
  }
}

module.exports = ProdutoDigitalSchema