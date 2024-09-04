 'use strict'

const Model = use('Model')

class ProdutoDigital extends Model {
  static get table () {
    return 'produtos_digitais' // Nome correto da tabela
  }
  
  itensPedido () {
    return this.hasMany('App/Models/ItemPedido')
  }
  categorias () {
    return this.belongsToMany('App/Models/Categoria').pivotTable('produto_categorias')
  }
}

module.exports = ProdutoDigital