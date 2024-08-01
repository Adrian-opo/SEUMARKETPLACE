const FormaPagamento = use('App/Models/FormaPagamento')

class FormaPagamentoController {
  async index ({ response }) {
    let formasPagamento = await FormaPagamento.all()
    return response.json(formasPagamento)
  }

  async store ({ request, response }) {
    const formaPagamentoInfo = request.only(['nome'])
    const formaPagamento = new FormaPagamento()
    formaPagamento.nome = formaPagamentoInfo.nome

    await formaPagamento.save()
    return response.status(201).json(formaPagamento)
  }

  async show ({ params, response }) {
    const formaPagamento = await FormaPagamento.find(params.id)
    return response.json(formaPagamento)
  }

  async update ({ params, request, response }) {
    const formaPagamentoInfo = request.only(['nome'])
    const formaPagamento = await FormaPagamento.find(params.id)

    if (!formaPagamento) {
      return response.status(404).json({ data: 'Resource not found' })
    }

    formaPagamento.nome = formaPagamentoInfo.nome

    await formaPagamento.save()
    return response.status(200).json(formaPagamento)
  }

  async destroy ({ params, response }) {
    const formaPagamento = await FormaPagamento.find(params.id)

    if (!formaPagamento) {
      return response.status(404).json({ data: 'Resource not found' })
    }

    await formaPagamento.delete()
    return response.status(204).json(null)
  }
}

module.exports = FormaPagamentoController