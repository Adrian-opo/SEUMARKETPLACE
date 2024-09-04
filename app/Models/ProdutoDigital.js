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
  categoria() {
    return this.belongsTo('App/Models/Categoria') // Define que cada produto pertence a uma categoria
  }
}

module.exports = ProdutoDigital