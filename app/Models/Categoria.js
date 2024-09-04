'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Categoria extends Model {
    produtosDigitais () {
        return this.belongsToMany('App/Models/ProdutoDigital').pivotTable('produto_categorias')
      }
}

module.exports = Categoria
