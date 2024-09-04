'use strict'

  const Model = use('Model')
  
  class ProdutoPedido extends Model {
    static get table () {
      return 'produtos_pedido' // Nome correto da tabela
    }
  
    pedido () {
      return this.belongsTo('App/Models/Pedido')
    }
  
    produtoDigital () {
      return this.belongsTo('App/Models/ProdutoDigital', 'produto_digital_id', 'id')
    }
  }
  
  module.exports = ProdutoPedido