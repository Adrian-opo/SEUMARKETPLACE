'use strict'

const Schema = use('Schema')

class FormaPagamentoSchema extends Schema {
  up () {
    this.create('forma_pagamentos', (table) => {
      table.increments()
      table.string('nome', 255).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('forma_pagamentos')
  }
}

module.exports = FormaPagamentoSchema