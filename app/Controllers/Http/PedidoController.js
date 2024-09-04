const Pedido = use('App/Models/Pedido')
const ProdutoDigital = use('App/Models/ProdutoDigital')
const ProdutoPedido = use('App/Models/ProdutoPedido')
const Cliente = use('App/Models/Cliente')
const Mail = use('Mail')
const crypto = require('crypto')

class PedidoController {
  async store ({ request, response }) {
    const pedidoInfo = request.only(['valor_total', 'cliente_id', 'forma_pagamento_id'])

    // Criando o pedido
    const pedido = new Pedido()
    pedido.data_pedido = new Date()
    pedido.status = 'pendente'
    pedido.valor_total = pedidoInfo.valor_total
    pedido.cliente_id = pedidoInfo.cliente_id
    pedido.forma_pagamento_id = pedidoInfo.forma_pagamento_id
    await pedido.save()

    // Recuperar o cliente
    const cliente = await Cliente.find(pedido.cliente_id)
    if (!cliente) {
      return response.status(404).json({ error: 'Cliente não encontrado' })
    }

    // Criando os produtos associados ao pedido e gerando os seriais
    const itensInfo = request.input('itens')
    console.log(itensInfo)
    const produtosInfo = []

    for (let item of itensInfo) {
      const produtoPedido = new ProdutoPedido()
      produtoPedido.pedido_id = pedido.id
      produtoPedido.produto_digital_id = item.produto_digital_id
      produtoPedido.quantidade = item.quantidade
      produtoPedido.valor_unitario = item.valor_unitario
      // Gera serial para cada item
      produtoPedido.serial = crypto.randomBytes(16).toString('hex')
      await produtoPedido.save()

      // Recupera o produto digital e suas categorias associadas
      const produto = await ProdutoDigital.query()
        .where('id', item.produto_digital_id)
        .with('categorias')
        .first()

      const categorias = produto.toJSON().categorias.map(c => c.nome).join(', ')

      // Adiciona o produto e as categorias ao array para o envio do e-mail
      produtosInfo.push({
        nome: produto.nome,
        descricao: produto.descricao,
        categorias: categorias, // Inclui as categorias do produto
        serial: produtoPedido.serial,
        quantidade: produtoPedido.quantidade,
        valor_unitario: produtoPedido.valor_unitario
      })
    }
    console.log(produtosInfo)
    // Enviar um único e-mail com todos os produtos do pedido
    try {
      await Mail.send('emails.serial', { cliente: cliente.nome, produtos: produtosInfo }, (message) => {
        message
          .to(cliente.email)
          .from('no-reply@seumarketplace.com')
          .subject('Seus Seriais do Gift Card')
      })

      // Atualizar o status do pedido para "concluído"
      pedido.status = 'concluído'
      await pedido.save()
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error: 'Erro ao enviar o e-mail ou atualizar o pedido' })
    }

    return response.status(201).json(pedido)
  }

  async index ({ response }) {
    let pedidos = await Pedido.all()
    return response.json(pedidos)
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