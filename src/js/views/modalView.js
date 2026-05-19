function formatarPreco(valor) {
  return valor.toFixed(2).replace(".", ",");
}

export function renderConfig(nome, preco) {
  return `
    <button class="fechar-x" id="fecharModal">
      <i class="fa-solid fa-xmark"></i>
    </button>

    <div class="modal-scroll">

    <div class="modal-header">
      <h2>${nome}</h2>

      <p id="precoTotal">
        R$ ${formatarPreco(preco)}
      </p>
    </div>

    <div class="modal-body">

      <div class="secao">
        <h3>Quantidade</h3>

        <input
          type="number"
          id="quantidade"
          value="1"
          min="1"
        >
      </div>

      <div class="secao">

        <div id="extras"></div>
      </div>

      <button class="btn" id="btnContinuar">
        Continuar
      </button>
      
      </div>
       </div>
  `;
}

export function renderEntrega(total) {
  return `
<button class="fechar-x" id="fecharModal">
      <i class="fa-solid fa-xmark"></i>
    </button>

    <div class="modal-scroll">

    <div class="resumo-pedido">
      <span>Informações de entrega</span>

      <h2>Seu pedido</h2>

      <p>
        R$ ${formatarPreco(total)}
      </p>
    </div>

    <div class="resumo">

    <div class="endereco-header">
    <div
    class="editar-endereco"
    id="btnVoltarConfig"
  >
    ← Voltar
    </div>
  </div>

      <h3>Endereço de entrega</h3>

      <span>Bairro*</span>
      <input
        id="bairro"
        placeholder="Digite seu bairro"
      >

      <span>Rua*</span>
      <input
        id="rua"
        placeholder="Digite sua rua"
      >

      <span>Número*</span>
      <input
        id="numero"
        placeholder="Número da residência"
      >

      <span>Complemento</span>
      <input
        id="complemento"
        placeholder="Apartamento, bloco, referência..."
      >

      <button class="btn" id="btnPagamento">
        Continuar para pagamento
      </button>

      </div>

    </div>
  `;
}

export function renderPagamento(total, endereco) {
  return `
   <button class="fechar-x" id="fecharModal">
      <i class="fa-solid fa-xmark"></i>
    </button>

    <div class="modal-scroll">

    <div class="resumo-topo">

      <span class="titulo-topo">
        Pagamento
      </span>

      <h2>Finalizar pedido</h2>

      <p>
        R$ ${formatarPreco(total)}
      </p>

    </div>

    <div class="pagamento-conteudo">

      <div class="endereco-box">

        <div class="endereco-header">
          <div
            class="editar-endereco"
            id="btnEditarEndereco"
          >
            ← Editar endereço
          </div>
        </div>

        <div class="endereco-dados">
          <p>
            ${endereco.rua}, ${endereco.numero}
          </p>

          <p>
            ${endereco.bairro}
          </p>
        </div>

      </div>

      <h3 class="pagamento-titulo">
        Escolha a forma de pagamento
      </h3>

      <div class="pagamento-cards">

        <div class="pag-card" data-pag="pix">

          <div class="icon-circle">
            <i class="fa-solid fa-qrcode"></i>
          </div>

          <div>
            <strong>Pix</strong>
            <p>Pagamento instantâneo</p>
          </div>

        </div>

        <div class="pag-card" data-pag="dinheiro">

          <div class="icon-circle">
            <i class="fa-solid fa-money-bill"></i>
          </div>

          <div>
            <strong>Dinheiro</strong>
            <p>Pagamento na entrega</p>
          </div>

        </div>

        <div class="pag-card" data-pag="cartao">

          <div class="icon-circle">
            <i class="fa-solid fa-credit-card"></i>
          </div>

          <div>
            <strong>Cartão</strong>
            <p>Crédito ou débito</p>
          </div>

        </div>

      </div>

    </div>
  `;
}