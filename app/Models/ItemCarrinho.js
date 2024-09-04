'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ItemCarrinho extends Model {
  // Define o nome correto da tabela
  static get table() {
    return 'itens_carrinho' // O nome correto da tabela
  }

  produtoDigital () {
    return this.belongsTo('App/Models/ProdutoDigital', 'produto_digital_id', 'id')
  }
}

module.exports = ItemCarrinho