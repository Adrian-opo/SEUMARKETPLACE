'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Carrinho extends Model {
   
    cliente() {
      return this.belongsTo('App/Models/Cliente', 'cliente_id', 'id')
    }
    
    itens() {
      return this.hasMany('App/Models/ItemCarrinho', 'id', 'carrinho_id')
    }
  }

module.exports = Carrinho
