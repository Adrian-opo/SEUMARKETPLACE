const Route = use('Route')

Route.get('/produto-digitals', 'ProdutoDigitalController.index')
Route.post('/produto-digitals', 'ProdutoDigitalController.store')
Route.get('/produto-digitals/:id', 'ProdutoDigitalController.show')
Route.put('/produto-digitals/:id', 'ProdutoDigitalController.update')
Route.delete('/produto-digitals/:id', 'ProdutoDigitalController.destroy')


Route.on('/').render('welcome')
