const Carrinho = use('App/Models/Carrinho')
const ProdutoDigital = use('App/Models/ProdutoDigital')
const ItemCarrinho = use('App/Models/ItemCarrinho')
const Pedido = use('App/Models/Pedido')
const ProdutoPedido = use('App/Models/ProdutoPedido')
const crypto = require('crypto')
const Mail = use('Mail')
const Cliente = use('App/Models/Cliente')


class CarrinhoController {
  async addToCart ({ request, response }) {
    const { produto_digital_id, quantidade, cliente_id } = request.only(['produto_digital_id', 'quantidade', 'cliente_id'])
    
    // Verifica se o cliente já tem um carrinho
    let carrinho = await Carrinho.query().where('cliente_id', cliente_id).first()

    // Se não existir carrinho, cria um novo
    if (!carrinho) {
      carrinho = new Carrinho()
      carrinho.cliente_id = cliente_id
      await carrinho.save()
    }

    // Verifica se o produto já está no carrinho
    let itemCarrinho = await ItemCarrinho.query()
      .where('carrinho_id', carrinho.id)
      .where('produto_digital_id', produto_digital_id)
      .first()

    // Se já existe, apenas aumenta a quantidade
    if (itemCarrinho) {
      itemCarrinho.quantidade += quantidade
    } else {
      // Caso contrário, adiciona o item ao carrinho
      itemCarrinho = new ItemCarrinho()
      itemCarrinho.carrinho_id = carrinho.id
      itemCarrinho.produto_digital_id = produto_digital_id
      itemCarrinho.quantidade = quantidade
    }

    await itemCarrinho.save()

    return response.status(200).json({ message: 'Produto adicionado ao carrinho', carrinho })
  }
  async showCart({ params, view }) {
    // Buscar o carrinho do cliente
    const carrinho = await Carrinho.query()
      .where('cliente_id', 1)
      .with('itens.produtoDigital')  // Incluir os produtos do carrinho
      .first()

    // Se o carrinho não existir, retornamos uma página vazia ou um carrinho vazio
    if (!carrinho) {
      return view.render('cart', { itens: [], total: 0 })
    }

    // Coletar os itens do carrinho e seus produtos associados
    const itens = carrinho.toJSON().itens.map(item => ({
      nome: item.produtoDigital.nome,
      preco: parseFloat(item.produtoDigital.preco),
      quantidade: item.quantidade,
      total: parseFloat(item.produtoDigital.preco) * item.quantidade
    }))

    // Calcular o total do carrinho
    const total = itens.reduce((acc, item) => acc + item.total, 0)

    // Renderizar a view 'cart' passando os itens do carrinho e o total
    return view.render('cart', { itens, total: total.toFixed(2) })
}
async showCheckoutPage({ view }) {
  const carrinho = await Carrinho.query()
    .where('cliente_id', 1)  // Substitua pelo ID do cliente logado
    .with('itens.produtoDigital')  // Incluir produtos associados
    .first()

  if (!carrinho) {
    return view.render('cart', { itens: [] })
  }

  // Convertendo para JSON e garantindo que `itens` seja um array
  let itens = carrinho.toJSON().itens
  itens = itens.map(item => ({
    nome: item.produtoDigital.nome,
    preco: parseFloat(item.produtoDigital.preco), // Garantir que o preço seja um número
    quantidade: item.quantidade,
    total: parseFloat(item.produtoDigital.preco) * item.quantidade // Garantir que total seja um número
  }))

  const total = itens.reduce((acc, item) => acc + item.total, 0)
  
  return view.render('checkout', { itens, total: total.toFixed(2) }) // Passa o total formatado
}

async finalizarPedido({ request, response, view }) {
  let { cliente_id, forma_pagamento_id } = request.only(['cliente_id', 'forma_pagamento_id'])
  cliente_id = 1 // Definir cliente_id fixo para teste, ajustar conforme necessário

  // Recuperar o carrinho do cliente
  const carrinho = await Carrinho.query()
    .where('cliente_id', cliente_id)
    .with('itens.produtoDigital') // Incluir os produtos do carrinho
    .first()

  if (!carrinho) {
    return response.status(400).json({ error: 'Carrinho está vazio' })
  }

  // Coletar os itens do carrinho
  const itens = carrinho.toJSON().itens.map(item => ({
    id: item.produtoDigital.id,
    nome: item.produtoDigital.nome,
    preco: parseFloat(item.produtoDigital.preco),
    quantidade: item.quantidade,
    total: parseFloat(item.produtoDigital.preco) * item.quantidade
  }))

  // Criar o pedido
  const pedido = new Pedido()
  pedido.data_pedido = new Date()
  pedido.status = 'pendente'
  pedido.valor_total = itens.reduce((total, item) => total + item.total, 0)
  pedido.cliente_id = cliente_id
  pedido.forma_pagamento_id = forma_pagamento_id
  await pedido.save()

  // Processar cada item do carrinho e associar ao pedido
  const produtosInfo = []
  for (let item of itens) {
    const produto = await ProdutoDigital.find(item.id)

    // Verificar estoque
    if (!produto || produto.quantidade_disponivel < item.quantidade) {
      return response.status(400).json({ error: `Quantidade insuficiente para o produto: ${produto ? produto.nome : 'Produto não encontrado'}` })
    }

    // Atualizar a quantidade disponível (diminuindo a quantidade comprada)
    produto.quantidade_disponivel -= item.quantidade
    await produto.save()

    // Criar o produto do pedido
    const produtoPedido = new ProdutoPedido()
    produtoPedido.pedido_id = pedido.id
    produtoPedido.produto_digital_id = item.id
    produtoPedido.quantidade = item.quantidade
    produtoPedido.valor_unitario = item.preco
    produtoPedido.serial = crypto.randomBytes(16).toString('hex')
    await produtoPedido.save()

    // Adicionar informações para o envio de e-mail
    produtosInfo.push({
      nome: produto.nome,
      descricao: produto.descricao,
      categorias: (await produto.categorias().fetch()).toJSON().map(c => c.nome).join(', '),
      serial: produtoPedido.serial,
      quantidade: produtoPedido.quantidade,
      valor_unitario: produtoPedido.valor_unitario
    })
  }

  // Limpar o carrinho
  await carrinho.itens().delete()

  // Enviar e-mail com os detalhes do pedido
  try {
    const cliente = await Cliente.find(cliente_id)
    if (!cliente) {
      return response.status(404).json({ error: 'Cliente não encontrado' })
    }

    await Mail.send('emails.serial', { cliente: cliente.nome, produtos: produtosInfo }, (message) => {
      message
        .to(cliente.email)
        .from('no-reply@seumarketplace.com')
        .subject('Seus Seriais do Gift Card')
    })

    // Atualizar o status do pedido para "concluído"
    pedido.status = 'concluído'
    await pedido.save()

    return view.render('pedido-concluido', { pedido })
  } catch (error) {
    console.error('Erro ao enviar o e-mail ou atualizar o pedido:', error)
    return response.status(500).json({ error: 'Erro ao enviar o e-mail ou atualizar o pedido' })
  }
}

  
  async show({ params, response }) {
    const carrinho = await Carrinho.query().where('cliente_id', params.id).fetch()
    return response.json(carrinho)
  }
  async getCarrinho ({ params, response }) {
    const carrinho = await Carrinho.query()
      .where('cliente_id', params.cliente_id)
      .with('itens.produto')
      .first()

    return response.status(200).json(carrinho)
  }
}

module.exports = CarrinhoController
