'use strict'

const Model = use('Model')

class Cliente extends Model {
  pedidos () {
    return this.hasMany('App/Models/Pedido')
  }
}

module.exports = Cliente