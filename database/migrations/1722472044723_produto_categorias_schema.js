'use strict'

const Schema = use('Schema')

class ProdutoCategoriaSchema extends Schema {
  up () {
    this.create('produto_categorias', (table) => {
      table.increments()
      table.integer('produto_digital_id').unsigned().references('id').inTable('produtos_digitais').onDelete('CASCADE')
      table.integer('categoria_id').unsigned().references('id').inTable('categorias').onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('produto_categorias')
  }
}

module.exports = ProdutoCategoriaSchema