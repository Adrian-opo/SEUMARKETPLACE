const ProdutoDigital = use('App/Models/ProdutoDigital')
const Categoria = use('App/Models/Categoria')

class ProdutoDigitalController {
  async index ({ view }) {
    // Buscando todos os produtos junto com a categoria associada
    const produtos = await ProdutoDigital.query().with('categoria').fetch()

    // Renderizando a view com os produtos
    return view.render('index', {
      produtos: produtos.toJSON()
    })
  }

  async store ({ request, response, view }) {
    const produtoInfo = request.only(['nome', 'descricao', 'preco', 'foto'])

    // Criar o produto digital
    console.log(produtoInfo)
    const produto = new ProdutoDigital()
    produto.nome = produtoInfo.nome
    produto.descricao = produtoInfo.descricao
    produto.preco = produtoInfo.preco
    produto.foto = produtoInfo.foto
    
    await produto.save()

    // Associar categorias ao produto
    const categoriasIds = request.input('categorias') // Array de IDs de categorias
    await produto.categorias().attach(categoriasIds)

    return view.render('index', { produtos: (await ProdutoDigital.all()).toJSON() })
    
  }

  async showCadastroPage({ view }) {
    // Buscar todas as categorias
    const categorias = await Categoria.all()
    // Renderizar a página com categorias
    return view.render('cadastro-produto-digital', { categorias: categorias.toJSON() })
  }


  async show ({ params, response }) {
    const produto = await ProdutoDigital.query()
      .where('id', params.id)
      .with('categorias')
      .first()

    return response.json(produto)
  }
  async update ({ params, request, response }) {
    const produtoInfo = request.only(['nome', 'descricao', 'preco', 'tipo_gift'])
    const produto = await ProdutoDigital.find(params.id)

    if (!produto) {
      return response.status(404).json({ data: 'Resource not found' })
    }

    produto.nome = produtoInfo.nome
    produto.descricao = produtoInfo.descricao
    produto.preco = produtoInfo.preco
    produto.tipo_gift = produtoInfo.tipo_gift
    

    await produto.save()
    return response.status(200).json(produto)
  }

  async destroy ({ params, response }) {
    const produto = await ProdutoDigital.find(params.id)

    if (!produto) {
      return response.status(404).json({ data: 'Resource not found' })
    }

    await produto.delete()
    return response.status(204).json(null)
  }
}

module.exports = ProdutoDigitalController