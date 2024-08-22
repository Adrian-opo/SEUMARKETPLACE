const Categoria = use('App/Models/Categoria')

class CategoriaController {
  async index ({ response }) {
    let categorias = await Categoria.all()
    return response.json(categorias)
  }

  async store ({ request, response }) {
    const categoriaInfo = request.only(['nome'])
    const categoria = new Categoria()
    categoria.nome = categoriaInfo.nome

    await categoria.save()
    return response.status(201).json(categoria)
  }

  async show ({ params, response }) {
    const categoria = await Categoria.find(params.id)
    return response.json(categoria)
  }

  async update ({ params, request, response }) {
    const categoriaInfo = request.only(['nome'])
    const categoria = await Categoria.find(params.id)

    if (!categoria) {
      return response.status(404).json({ data: 'Resource not found' })
    }

    categoria.nome = categoriaInfo.nome

    await categoria.save()
    return response.status(200).json(categoria)
  }

  async destroy ({ params, response }) {
    const categoria = await Categoria.find(params.id)

    if (!categoria) {
      return response.status(404).json({ data: 'Resource not found' })
    }

    await categoria.delete()
    return response.status(204).json(null)
  }
}

module.exports = CategoriaController