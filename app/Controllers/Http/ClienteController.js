const Cliente = use('App/Models/Cliente')

class ClienteController {
  async index ({ response }) {
    let clientes = await Cliente.all()
    return response.json(clientes)
  }

  async store ({ request, response }) {
    const clienteInfo = request.only(['nome', 'email', 'telefone', 'endereco'])
    
    // Método correto para criar um novo cliente
    const cliente = await Cliente.create(clienteInfo)

    return response.status(201).json(cliente)
  }

  async show ({ params, response }) {
    const cliente = await Cliente.find(params.id)
    return response.json(cliente)
  }

  async update ({ params, request, response }) {
    const clienteInfo = request.only(['nome', 'email', 'telefone', 'endereco'])
    const cliente = await Cliente.find(params.id)

    if (!cliente) {
      return response.status(404).json({ data: 'Resource not found' })
    }

    cliente.nome = clienteInfo.nome
    cliente.email = clienteInfo.email
    cliente.telefone = clienteInfo.telefone
    cliente.endereco = clienteInfo.endereco

    await cliente.save()
    return response.status(200).json(cliente)
  }

  async destroy ({ params, response }) {
    const cliente = await Cliente.find(params.id)

    if (!cliente) {
      return response.status(404).json({ data: 'Resource not found' })
    }

    await cliente.delete()
    return response.status(204).json(null)
  }
}

module.exports = ClienteController

