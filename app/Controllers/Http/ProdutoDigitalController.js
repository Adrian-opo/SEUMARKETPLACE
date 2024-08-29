const ProdutoDigital = use('App/Models/ProdutoDigital')

class ProdutoDigitalController {
  async index ({ response }) {
    let produtos = await ProdutoDigital.all()
    return response.json(produtos)
  }

  async store ({ request, response }) {
    const produtoInfo = request.only(['nome', 'descricao', 'preco', 'tipo_gift'])
    const produto = new ProdutoDigital()
    produto.nome = produtoInfo.nome
    produto.descricao = produtoInfo.descricao
    produto.preco = produtoInfo.preco
    produto.tipo_gift = produtoInfo.tipo_gift

    await produto.save()
    return response.status(201).json(produto)
  }

  async show ({ params, response }) {
    const produto = await ProdutoDigital.find(params.id)
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