const Pedido = use('App/Models/Pedido')
const ProdutoDigital = use('App/Models/ProdutoDigital')
const Cliente = use('App/Models/Cliente')
const Mail = use('Mail')
const crypto = require('crypto')

class PedidoController {
  async store ({ request, response }) {
    // Criando o pedido com status "pendente"
    const pedidoInfo = request.only(['valor_total', 'cliente_id', 'forma_pagamento_id', 'produto_digital_id'])
    const pedido = new Pedido()
    pedido.data_pedido = new Date() // Define a data do pedido como a data atual
    pedido.status = 'pendente' // Define o status inicial como "pendente"
    pedido.valor_total = pedidoInfo.valor_total
    pedido.cliente_id = pedidoInfo.cliente_id
    pedido.forma_pagamento_id = pedidoInfo.forma_pagamento_id
    await pedido.save()

    // Recuperar o cliente associado ao pedido
    const cliente = await Cliente.find(pedidoInfo.cliente_id)

    if (!cliente) {
      return response.status(404).json({ error: 'Cliente não encontrado' })
    }

    // Gerando serial aleatório para os produtos do pedido
    const produtos = await ProdutoDigital.query().where('id', pedidoInfo.produto_digital_id).fetch()

    try {
      produtos.rows.forEach(async (produto) => {
        produto.serial = crypto.randomBytes(16).toString('hex') // Gera um serial de 16 bytes em formato hexadecimal
        await produto.save()

        // Enviando e-mail para o cliente
        await Mail.send('emails.serial', { nome: produto.nome, serial: produto.serial }, (message) => {
          message
            .to(cliente.email) // Usando o e-mail do cliente cadastrado
            .from('no-reply@seumarketplace.com')
            .subject('Seu Serial do Gift Card')
        })
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