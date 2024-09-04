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

    // Criando os produtos associados ao pedido e verificando a quantidade disponível
    const itensInfo = request.input('itens')
    const produtosInfo = []

    for (let item of itensInfo) {
      const produto = await ProdutoDigital.find(item.produto_digital_id)

      // Verificar se há quantidade suficiente disponível
      if (produto.quantidade_disponivel < item.quantidade) {
        return response.status(400).json({ error: `Quantidade insuficiente para o produto: ${produto.nome}` })
      }

      // Atualizar a quantidade disponível (diminuindo a quantidade comprada)
      produto.quantidade_disponivel -= item.quantidade
      await produto.save()  // Salvar a nova quantidade no banco

      // Criar o produto do pedido
      const produtoPedido = new ProdutoPedido()
      produtoPedido.pedido_id = pedido.id
      produtoPedido.produto_digital_id = item.produto_digital_id
      produtoPedido.quantidade = item.quantidade
      produtoPedido.valor_unitario = item.valor_unitario

      // Gera serial para cada item
      produtoPedido.serial = crypto.randomBytes(16).toString('hex')
      await produtoPedido.save()

      // Adicionar ao array para o envio de e-mail
      produtosInfo.push({
        nome: produto.nome,
        descricao: produto.descricao,
        categorias: (await produto.categorias().fetch()).toJSON().map(c => c.nome).join(', '),
        serial: produtoPedido.serial,
        quantidade: produtoPedido.quantidade,
        valor_unitario: produtoPedido.valor_unitario
      })
    }

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