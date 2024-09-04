'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class FormaPagamento extends Model {
  pedidos () {
    return this.hasMany('App/Models/Pedido')
  }
}

module.exports = FormaPagamento
