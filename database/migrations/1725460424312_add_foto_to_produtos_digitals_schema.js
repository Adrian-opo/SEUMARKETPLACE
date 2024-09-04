'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddFotoToProdutosDigitalsSchema extends Schema {
  up () {
    this.table('produtos_digitais', (table) => {
      table.string('foto').nullable() // Adicionando o campo foto, que pode ser uma URL ou caminho da imagem
    })
  }

  down () {
    this.table('produtos_digitais', (table) => {
      table.dropColumn('foto') // Removendo o campo foto
    })
  }
}

module.exports = AddFotoToProdutosDigitalsSchema
