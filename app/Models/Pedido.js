'use strict'

const Model = use('Model')

class Pedido extends Model {
  cliente () {
    return this.belongsTo('App/Models/Cliente')
  }

  formaPagamento () {
    return this.belongsTo('App/Models/FormaPagamento')
  }

  produtos () {
    return this.hasMany('App/Models/ProdutoPedido')
  }
}

module.exports = Pedido