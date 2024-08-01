'use strict'

const Schema = use('Schema')

class ProdutoCategoriaSchema extends Schema {
  up () {
    this.create('produto_categorias', (table) => {
      table.increments()
      table.integer('produto_digital_id').unsigned().references('id').inTable('produto_digitals')
      table.integer('categoria_id').unsigned().references('id').inTable('categorias')
      table.timestamps()
    })
  }

  down () {
    this.drop('produto_categorias')
  }
}

module.exports = ProdutoCategoriaSchema