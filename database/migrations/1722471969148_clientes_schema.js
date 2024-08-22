'use strict'

const Schema = use('Schema')

class ClienteSchema extends Schema {
  up () {
    this.create('clientes', (table) => {
      table.increments()
      table.string('nome', 255).notNullable()
      table.string('email', 255).notNullable()
      table.string('telefone', 20).notNullable()
      table.string('endereco', 255).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('clientes')
  }
}

module.exports = ClienteSchema