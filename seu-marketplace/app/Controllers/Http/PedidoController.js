const Pedido = use('App/Models/Pedido')

class PedidoController {
  async index ({ response }) {
    let pedidos = await Pedido.all()
    return response.json(pedidos)
  }

  async store ({ request, response }) {
    const pedidoInfo = request.only(['data_pedido', 'status', 'valor_total', 'cliente_id', 'forma_pagamento_id'])
    const pedido = new Pedido()
    pedido.data_pedido = pedidoInfo.data_pedido
    pedido.status = pedidoInfo.status
    pedido.valor_total = pedidoInfo.valor_total
    pedido.cliente_id = pedidoInfo.cliente_id
    pedido.forma_pagamento_id = pedidoInfo.forma_pagamento_id

    await pedido.save()
    return response.status(201).json(pedido)
  }

  async show ({ params, response }) {
    const pedido = await Pedido.find(params.id)
    return response.json(pedido)
  }

  async update ({ params, request, response }) {
    const pedidoInfo = request.only(['data_pedido', 'status', 'valor_total', 'cliente_id', 'forma_pagamento_id'])
    const pedido = await Pedido.find(params.id)

    if (!pedido) {
      return response.status(404).json({ data: 'Resource not found' })
    }

    pedido.data_pedido = pedidoInfo.data_pedido
    pedido.status = pedidoInfo.status
    pedido.valor_total = pedidoInfo.valor_total
    pedido.cliente_id = pedidoInfo.cliente_id
    pedido.forma_pagamento_id = pedidoInfo.forma_pagamento_id

    await pedido.save()
    return response.status(200).json(pedido)
  }

  async destroy ({ params, response }) {
    const pedido = await Pedido.find(params.id)

    if (!pedido) {
      return response.status(404).json({ data: 'Resource not found' })
    }

    await pedido.delete()
    return response.status(204).json(null)
  }
}

module.exports = PedidoController