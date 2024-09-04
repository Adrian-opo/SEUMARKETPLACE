'use strict'

/** @type {import('@adonisjs/lucid/src/Lucid/Model')} */
const Categoria = use('App/Models/Categoria')

class CategoriaSeeder {
  async run () {
    // Adicionar categorias
    await Categoria.createMany([
      { nome: 'Netflix' },
      { nome: 'Amazon Prime' },
      { nome: 'Hulu' },
      { nome: 'Disney+' },
      { nome: 'HBO Max' },
      { nome: 'LOL' },
      { nome: 'Frefire' },
      { nome: 'HBO Max' }

    ])
  }
}

module.exports = CategoriaSeeder
