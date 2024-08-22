const ItemPedido = use('App/Models/ItemPedido')

class ItemPedidoController {
  async index ({ response }) {
    let itensPedido = await ItemPedido.all()
    return response.json(itensPedido)
  }

  async store ({ request, response }) {
    const itemPedidoInfo = request.only(['quantidade', 'valor_unitario', 'produto_digital_id', 'pedido_id'])
    const itemPedido = new ItemPedido()
    itemPedido.quantidade = itemPedidoInfo.quantidade
    itemPedido.valor_unitario = itemPedidoInfo.valor_unitario
    itemPedido.produto_digital_id = itemPedidoInfo.produto_digital_id
    itemPedido.pedido_id = itemPedidoInfo.pedido_id

    await itemPedido.save()
    return response.status(201).json(itemPedido)
  }

  async show ({ params, response }) {
    const itemPedido = await ItemPedido.find(params.id)
    return response.json(itemPedido)
  }

  async update ({ params, request, response }) {
    const itemPedidoInfo = request.only(['quantidade', 'valor_unitario', 'produto_digital_id', 'pedido_id'])
    const itemPedido = await ItemPedido.find(params.id)

    if (!itemPedido) {
      return response.status(404).json({ data: 'Resource not found' })
    }

    itemPedido.quantidade = itemPedidoInfo.quantidade
    itemPedido.valor_unitario = itemPedidoInfo.valor_unitario
    itemPedido.produto_digital_id = itemPedidoInfo.produto_digital_id
    itemPedido.pedido_id = itemPedidoInfo.pedido_id

    await itemPedido.save()
    return response.status(200).json(itemPedido)
  }

  async destroy ({ params, response }) {
    const itemPedido = await ItemPedido.find(params.id)

    if (!itemPedido) {
      return response.status(404).json({ data: 'Resource not found' })
    }

    await itemPedido.delete()
    return response.status(204).json(null)
  }
}

module.exports = ItemPedidoController