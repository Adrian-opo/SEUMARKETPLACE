const Route = use('Route')

Route.post('/carrinho/add', 'CarrinhoController.addToCart')  // Adicionar produto ao carrinho
Route.get('/carrinho/:cliente_id', 'CarrinhoController.getCarrinho');
Route.post('/pedidos/finalizar', 'PedidoController.finalizarPedido');  // Finalizar o pedido
Route.get('/cart/:id', 'CarrinhoController.show')
Route.get('/checkout', 'CarrinhoController.showCheckoutPage')  // Adicione esta linha para renderizar a página de checkout
Route.post('/checkout', 'CarrinhoController.finalizarPedido')  
// ProdutoDigital Routes
Route.get('/produto-digitals', 'ProdutoDigitalController.index')
Route.post('/produto-digitals', 'ProdutoDigitalController.store')
Route.get('/produto-digitals/:id', 'ProdutoDigitalController.show')
Route.put('/produto-digitals/:id', 'ProdutoDigitalController.update')
Route.delete('/produto-digitals/:id', 'ProdutoDigitalController.destroy')

// Cliente Routes
Route.get('/clientes', 'ClienteController.index')
Route.post('/clientes', 'ClienteController.store')
Route.get('/clientes/:id', 'ClienteController.show')
Route.put('/clientes/:id', 'ClienteController.update')
Route.delete('/clientes/:id', 'ClienteController.destroy')

// Pedido Routes
Route.get('/pedidos', 'PedidoController.index')
Route.post('/pedidos', 'PedidoController.store')
Route.get('/pedidos/:id', 'PedidoController.show')
Route.put('/pedidos/:id', 'PedidoController.update')
Route.delete('/pedidos/:id', 'PedidoController.destroy')

// ItemPedido Routes
Route.get('/item-pedidos', 'ItemPedidoController.index')
Route.post('/item-pedidos', 'ItemPedidoController.store')
Route.get('/item-pedidos/:id', 'ItemPedidoController.show')
Route.put('/item-pedidos/:id', 'ItemPedidoController.update')
Route.delete('/item-pedidos/:id', 'ItemPedidoController.destroy')

// FormaPagamento Routes
Route.get('/forma-pagamentos', 'FormaPagamentoController.index')
Route.post('/forma-pagamentos', 'FormaPagamentoController.store')
Route.get('/forma-pagamentos/:id', 'FormaPagamentoController.show')
Route.put('/forma-pagamentos/:id', 'FormaPagamentoController.update')
Route.delete('/forma-pagamentos/:id', 'FormaPagamentoController.destroy')

// Categoria Routes
Route.get('/categorias', 'CategoriaController.index')
Route.post('/categorias', 'CategoriaController.store')
Route.get('/categorias/:id', 'CategoriaController.show')
Route.put('/categorias/:id', 'CategoriaController.update')
Route.delete('/categorias/:id', 'CategoriaController.destroy')

// ProdutoCategoria Routes
Route.get('/produto-categorias', 'ProdutoCategoriaController.index')
Route.post('/produto-categorias', 'ProdutoCategoriaController.store')
Route.get('/produto-categorias/:id', 'ProdutoCategoriaController.show')
Route.put('/produto-categorias/:id', 'ProdutoCategoriaController.update')
Route.delete('/produto-categorias/:id', 'ProdutoCategoriaController.destroy')

Route.get('/produtos-digitais', 'ProdutoDigitalController.index')
Route.post('/produtos-digitais', 'ProdutoDigitalController.store')
Route.get('/produtos-digitais/:id', 'ProdutoDigitalController.show')
Route.put('/produtos-digitais/:id', 'ProdutoDigitalController.update')

Route.get('/', 'ProdutoDigitalController.index')  // Home
Route.on('/contact').render('contact.edge')  // Contato
Route.get('/cart', 'CarrinhoController.showCart')  // Carrinho
Route.on('/chackout').render('chackout.edge')  // Chackout
Route.on('/404').render('404.edge')  // Erro
Route.on('/detail').render('shop-detail.edge')  // Produto detalhado
Route.on('/shop').render('shop.edge')  // 
Route.on('/testimonial').render('testimonial.edge') 
Route.get('/produtoDigital', 'ProdutoDigitalController.showCadastroPage')
