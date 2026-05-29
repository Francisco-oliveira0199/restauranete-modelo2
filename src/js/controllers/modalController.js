import { modalState } from "../state/modalState.js";
import { calcularTotal } from "../services/pedidoService.js";
import * as view from "../views/modalView.js";
import { carrinho } from "../main.js";
import { atualizarBadge } from "../ui/badge.js";
import { mostrarToast, mostrarErro, animarCarrinho } from "../ui/feedback.js";
import { resetState } from "../state/modalState.js";
import { normalizarItem } from "../utils/helpers.js";
import { atualizarCarrinhoUI } from "../ui/atualizarCarrinhoUI.js";

function getModalElements() {
  return {
    modal: document.getElementById("modalPedido"),
    box: document.querySelector(".modal-box")
  };
}

modalState.modo = "compra-direta";
export function abrirConfigCarrinho(nome, preco, sabor = null) {

  modalState.modo = "carrinho";

  abrirConfig(nome, preco, sabor);

}

export function abrirConfig(nome, preco, sabor = null) {

  const { modal, box } = getModalElements();

  const mesmoItem =
  modalState.item.nome === nome &&
  modalState.item.sabor === sabor;

if (!mesmoItem) {

  const modoAtual = modalState.modo;

  resetState();

  modalState.modo = modoAtual;

  modalState.item.nome = nome;

  modalState.precoBase = preco;

  modalState.item.sabor = sabor;
}

  modal.classList.add("active");

  box.innerHTML = view.renderConfig(nome, preco);

  montarExtras();

  bindEvents();

  bindCloseModal();

  restaurarConfig();

  atualizarPreco();
}

function getTipo() {
  const nome = modalState.item.nome.toLowerCase();

  if (nome.includes("pizza")) return "pizza";
  if (nome.includes("x-") || nome.includes("burger")) return "hamburguer";
  if (nome.includes("pastel")) return "pastel";

  return "outro";
}

function montarExtras() {
  const tipo = getTipo();

  const el = document.getElementById("extras");

  if (!el) return;

  if (tipo === "pizza") {

    el.innerHTML = `

     <div class="secao">

    <h3>Borda recheada</h3>

    <label class="radio-option">
      <input
        type="radio"
        name="borda"
        value=""
        checked
      >
      <p>Sem borda</p>
    </label>

    <label class="radio-option">
      <input
        type="radio"
        name="borda"
        value="catupiry"
      >
      <p>Catupiry</p> <span>+R$ 5</span>
    </label>

    <label class="radio-option">
      <input
        type="radio"
        name="borda"
        value="cheddar"
      >
      <p>Cheddar</p> <span>+R$ 6</span>
    </label>

    <label class="radio-option">
      <input
        type="radio"
        name="borda"
        value="chocolate"
      >
      <p>Chocolate</p> <span>+R$ 8</span>
    </label>

    <label class="radio-option">
      <input
        type="radio"
        name="borda"
        value="cream-cheese"
      >
      <p>Cream Cheese</p> <span>+R$ 8</span>
    </label>

  </div>

  <div class="secao">

    <h3>Pizza meio a meio</h3>

    <label class="radio-option">
      <input
        type="checkbox"
        id="meioMeio"
      >
      Quero metade com outro sabor
    </label>

    <div
      id="saboresMeioMeio"
      style="display:none;"
    >

      <h4>Escolha o segundo sabor</h4>

      <label class="radio-option">
        <input
          type="radio"
          name="sabor2"
          value="calabresa"
        >
        Calabresa
      </label>

      <label class="radio-option">
        <input
          type="radio"
          name="sabor2"
          value="frango-com-catupiry"
        >
        Frango com Catupiry
      </label>

      <label class="radio-option">
        <input
          type="radio"
          name="sabor2"
          value="mussarela"
        >
        Mussarela
      </label>

      <label class="radio-option">
      <input
        type="radio"
        name="sabor2"
        value="portuguesa"
      >
      Portuguesa
    </label>

    <label class="radio-option">
      <input
        type="radio"
        name="sabor2"
        value="quatro-queijos"
      >
      Quatro Queijos
    </label>

    <label class="radio-option">
      <input
        type="radio"
        name="sabor2"
        value="pepperoni"
      >
      Pepperoni
    </label>

    </div>

  </div>

  <div class="secao">

    <h3>Extras</h3>

    <label class="radio-option">
      <input
        type="checkbox"
        class="extra"
        value="bacon"
      >
      <p>Bacon</p> <span>+R$ 3</span>
    </label>

    <label class="radio-option">
      <input
        type="checkbox"
        class="extra"
        value="queijo"
      >
      <p>Queijo extra</p> <span>+R$ 2</span>
    </label>

    <label class="radio-option">
      <input
        type="checkbox"
        class="extra"
        value="calabresa"
      >
      <p>Calabresa</p> <span>+R$ 4</span>
    </label>

    <label class="radio-option">
      <input
        type="checkbox"
        class="extra"
        value="ovo"
      >
      <p>Ovo</p> <span>+R$ 2</span>
    </label>

    <label class="radio-option">
      <input
        type="checkbox"
        class="extra"
        value="milho"
      >
      <p>Milho</p> <span>+R$ 2</span>
    </label>

    <label class="radio-option">
      <input
        type="checkbox"
        class="extra"
        value="cebola"
      >
      <p>Cebola</p> <span>+R$ 1,50</span>
    </label>

  </div>

  <div class="secao">

    <h3>Bebida</h3>

    <label class="radio-option">
      <input
        type="radio"
        name="bebida"
        value=""
        checked
      >
      <p>Sem bebida</p>
    </label>

    <label class="radio-option">
      <input
        type="radio"
        name="bebida"
        value="coca-lata"
      >
      <p>Coca-Cola Lata</p> <span>+R$ 6</span>
    </label>

    <label class="radio-option">
      <input
        type="radio"
        name="bebida"
        value="guarana"
      >
      <p>Guaraná Antarctica</p> <span>+R$ 6</span>
    </label>

    <label class="radio-option">
      <input
        type="radio"
        name="bebida"
        value="coca-1l"
      >
      <p>Coca-Cola 1L</p> <span>+R$ 10,00</span>
    </label>

    <label class="radio-option">
      <input
        type="radio"
        name="bebida"
        value="laranja"
      >
      <p>Suco de Laranja</p> <span>+R$ 12,00</span>
    </label>

    <label class="radio-option">
      <input
        type="radio"
        name="bebida"
        value="agua"
      >
      <p>Água Mineral</p> <span>+R$ 4,00</span>
    </label>

  </div>

  <div class="secao">

    <h3>Observações</h3>

    <textarea
      id="observacoes"
      placeholder="Ex: sem cebola, mais assada..."
    ></textarea>

  </div>

    `;

    document
  .getElementById("meioMeio")
  ?.addEventListener("change", e => {

    const box =
      document.getElementById("saboresMeioMeio");

    box.style.display =
      e.target.checked ? "block" : "none";

    if (!e.target.checked) {

      document
        .querySelectorAll('input[name="sabor2"]')
        .forEach(radio => {

          radio.checked = false;

        });

    }

    atualizarPreco();

});

    const meioMeio =
  document.getElementById("meioMeio");

document.getElementById("saboresMeioMeio").style.display =
  meioMeio?.checked ? "block" : "none";
  }

  if (tipo === "hamburguer") {

    el.innerHTML = `

      <div class="secao">

  <h3>Adicionais</h3>

  <label class="radio-option">
    <input
      type="checkbox"
      class="extra"
      value="bacon"
    >
    <p>Bacon</p>
    <span>+R$ 4</span>
  </label>

  <label class="radio-option">
    <input
      type="checkbox"
      class="extra"
      value="queijo"
    >
    <p>Queijo extra</p>
    <span>+R$ 3</span>
  </label>

  <label class="radio-option">
    <input
      type="checkbox"
      class="extra"
      value="cebola-caramelizada"
    >
    <p>Cebola caramelizada</p>
    <span>+R$ 3</span>
  </label>

  <label class="radio-option">
    <input
      type="checkbox"
      class="extra"
      value="ovo"
    >
    <p>Ovo</p>
    <span>+R$ 2</span>
  </label>

  <label class="radio-option">
    <input
      type="checkbox"
      class="extra"
      value="picles"
    >
    <p>Picles</p>
    <span>+R$ 2</span>
  </label>

</div>

<div class="secao">

  <h3>Ponto da carne</h3>

  <label class="radio-option">
    <input
      type="radio"
      name="ponto"
      value="mal-passado"
    >
    <p>Mal passado</p>
  </label>

  <label class="radio-option">
    <input
      type="radio"
      name="ponto"
      value="ao-ponto"
      checked
    >
    <p>Ao ponto</p>
  </label>

  <label class="radio-option">
    <input
      type="radio"
      name="ponto"
      value="bem-passado"
    >
    <p>Bem passado</p>
  </label>

</div>

<div class="secao">

  <h3>Bebida</h3>

  <label class="radio-option">
    <input
      type="radio"
      name="bebida"
      value=""
      checked
    >
    <p>Sem bebida</p>
  </label>

  <label class="radio-option">
    <input
      type="radio"
      name="bebida"
      value="coca-lata"
    >
    <p>Coca-Cola Lata</p>
    <span>+R$ 6</span>
  </label>

  <label class="radio-option">
    <input
      type="radio"
      name="bebida"
      value="guarana"
    >
    <p>Guaraná Antarctica</p>
    <span>+R$ 6</span>
  </label>

  <label class="radio-option">
    <input
      type="radio"
      name="bebida"
      value="suco de laranja"
    >
    <p>Suco Natural de Laranja</p>
    <span>+R$ 10</span>
  </label>

  <label class="radio-option">
    <input
      type="radio"
      name="bebida"
      value="agua"
    >
    <p>Água Mineral</p>
    <span>+R$ 4</span>
  </label>

</div>

<div class="secao">

  <h3>Observações</h3>

  <textarea
    id="observacoes"
    placeholder="Ex: sem cebola, molho separado..."
  ></textarea>

</div>

    `;
  }

  if (tipo === "pastel") {

    el.innerHTML = `

      <div class="secao">

  <h3>Adicionais</h3>

  <label class="radio-option">
    <input
      type="checkbox"
      class="extra"
      value="queijo"
    >
    <p>Queijo extra</p>
    <span>+R$ 3</span>
  </label>

  <label class="radio-option">
    <input
      type="checkbox"
      class="extra"
      value="milho"
    >
    <p>Milho</p>
    <span>+R$ 2</span>
  </label>

  <label class="radio-option">
    <input
      type="checkbox"
      class="extra"
      value="bacon"
    >
    <p>Bacon crocante</p>
    <span>+R$ 4</span>
  </label>

  <label class="radio-option">
    <input
      type="checkbox"
      class="extra"
      value="catupiry"
    >
    <p>Catupiry</p>
    <span>+R$ 3</span>
  </label>

  <label class="radio-option">
    <input
      type="checkbox"
      class="extra"
      value="calabresa"
    >
    <p>Calabresa</p>
    <span>+R$ 4</span>
  </label>

</div>

<div class="secao">

  <h3>Tipo de massa</h3>

  <label class="radio-option">
    <input
      type="radio"
      name="massa"
      value="tradicional"
      checked
    >
    <p>Tradicional</p>
  </label>

  <label class="radio-option">
    <input
      type="radio"
      name="massa"
      value="pizza"
    >
    <p>Massa sabor pizza</p>
    <span>+R$ 2</span>
  </label>

  <label class="radio-option">
    <input
      type="radio"
      name="massa"
      value="integral"
    >
    <p>Massa integral</p>
    <span>+R$ 3</span>
  </label>

</div>

<div class="secao">

  <h3>Bebida</h3>

  <label class="radio-option">
    <input
      type="radio"
      name="bebida"
      value=""
      checked
    >
    <p>Sem bebida</p>
  </label>

  <label class="radio-option">
    <input
      type="radio"
      name="bebida"
      value="coca-lata"
    >
    <p>Coca-Cola Lata</p>
    <span>+R$ 6</span>
  </label>

  <label class="radio-option">
    <input
      type="radio"
      name="bebida"
      value="guarana"
    >
    <p>Guaraná Antarctica</p>
    <span>+R$ 6</span>
  </label>

  <label class="radio-option">
    <input
      type="radio"
      name="bebida"
      value="suco de laranja"
    >
    <p>Suco Natural de Laranja</p>
    <span>+R$ 10</span>
  </label>

  <label class="radio-option">
    <input
      type="radio"
      name="bebida"
      value="agua"
    >
    <p>Água Mineral</p>
    <span>+R$ 4</span>
  </label>

</div>

<div class="secao">

  <h3>Observações</h3>

  <textarea
    id="observacoes"
    placeholder="Ex: pouco óleo, bem crocante, molho separado..."
  ></textarea>

</div>

    `;
  }
}

function restaurarConfig() {

  const config = modalState.config;

  document.getElementById("quantidadeValor").innerText =
  config.quantidade || 1;

  if (document.getElementById("sabor1")) {
    document.getElementById("sabor1").value =
      config.sabor1 || "";

  const obs =
  document.getElementById("observacoes");

if (obs) {
  obs.value = config.observacoes || "";
}
  }

if (config.sabor2) {

  const radio = document.querySelector(
    `input[name="sabor2"][value="${config.sabor2}"]`
  );

  if (radio) {
    radio.checked = true;
  }

}

  if (document.getElementById("meioMeio")) {
    document.getElementById("meioMeio").checked =
      config.meioMeio || false;
  }

  if (config.borda) {

  const radio = document.querySelector(
    `input[name="borda"][value="${config.borda}"]`
  );

  if (radio) {
    radio.checked = true;
  }

}

  const bebida = document.querySelector(
  `input[name="bebida"][value="${config.bebida}"]`
);

if (bebida) {
  bebida.checked = true;
}

  if (config.ponto) {

  const radio = document.querySelector(
    `input[name="ponto"][value="${config.ponto}"]`
  );

  if (radio) {
    radio.checked = true;
  }

}

  if (config.massa) {

  const radio = document.querySelector(
    `input[name="massa"][value="${config.massa}"]`
  );

  if (radio) {
    radio.checked = true;
  }

}

  document.querySelectorAll(".extra").forEach(extra => {

    extra.checked =
      config.extras?.includes(extra.value);

   });

  }

function irEntrega() {

  if (modalState.modo === "carrinho") {
    adicionarAoCarrinho();
    return;
  }

  const { box } = getModalElements();

  const resultado = calcularTotal(
    modalState.config,
    modalState.precoBase
  );

  box.innerHTML = view.renderEntrega(resultado.total);

  document
    .getElementById("btnPagamento")
    .addEventListener("click", irPagamento);

  bindCloseModal();

  document
    .getElementById("btnVoltarConfig")
    ?.addEventListener("click", voltarConfig);
}

function adicionarAoCarrinho() {

  atualizarPreco();

  const resultado = calcularTotal(
    modalState.config,
    modalState.precoBase
  );

  const item = normalizarItem({
    nome: modalState.item.nome,
    ...modalState.config,
    precoUnitario: resultado.precoUnitario,
    total: resultado.total
  });

  carrinho.adicionar(item);

  atualizarBadge();

  animarCarrinho();

  mostrarToast("Item adicionado!");

  fecharModal();
}

function bindEvents() {
  document.getElementById("btnContinuar")
    .addEventListener("click", irEntrega);

    document
  .getElementById("btnAdicionarCarrinho")
  ?.addEventListener("click", adicionarAoCarrinho);

const menos = document.getElementById("menosQtd");
const mais = document.getElementById("maisQtd");
const valor = document.getElementById("quantidadeValor");

if (menos && mais && valor) {

  menos.addEventListener("click", () => {

    let qtd = Number(valor.innerText);

    if (qtd > 1) {
      qtd--;
    }

    valor.innerText = qtd;

    atualizarPreco();

  });

  mais.addEventListener("click", () => {

    let qtd = Number(valor.innerText);

    qtd++;

    valor.innerText = qtd;

    atualizarPreco();

  });

}

  document.getElementById("extras")
    .addEventListener("change", atualizarPreco);
}

function atualizarPreco() {

  modalState.config = {

    quantidade: Number(
      document.getElementById("quantidadeValor")?.innerText || 1
    ),

    sabor1: modalState.item.sabor || null,

sabor2:
  document.querySelector('input[name="sabor2"]:checked')?.value || null,

    meioMeio: document.getElementById("meioMeio")?.checked,

    borda:
  document.querySelector('input[name="borda"]:checked')?.value || null,

    bebida:
  document.querySelector('input[name="bebida"]:checked')?.value || null,

    ponto:
document.querySelector('input[name="ponto"]:checked')?.value || null,

    massa:
document.querySelector('input[name="massa"]:checked')?.value || null,

    observacoes:
  document.getElementById("observacoes")?.value || "",

    extras: [
      ...document.querySelectorAll(".extra:checked")
    ].map(e => e.value)

  };

  const resultado = calcularTotal(
    modalState.config,
    modalState.precoBase
  );

  document.getElementById("precoTotal").innerText =
    `R$ ${resultado.total.toFixed(2).replace(".", ",")}`;

  const footer = document.getElementById("precoTotalFooter");

  if (footer) {

    footer.innerText =
      `R$ ${resultado.total.toFixed(2).replace(".", ",")}`;

  }

}

function irPagamento() {

  const { box } = getModalElements();

  modalState.endereco = {
    rua: document.getElementById("rua").value,
    bairro: document.getElementById("bairro").value,
    numero: document.getElementById("numero").value,
    complemento: document.getElementById("complemento").value
  };

  if (!modalState.endereco.rua || !modalState.endereco.numero) {
    return mostrarErro("Preencha endereço corretamente");
  }

  const resultado = calcularTotal(
    modalState.config,
    modalState.precoBase
  );

  const total = resultado.total;

  modalState.checkoutItens = [
  normalizarItem({
    nome: modalState.item.nome,
    ...modalState.config,
    precoUnitario: resultado.precoUnitario,
    total: resultado.total
  })
];

  box.innerHTML = view.renderPagamento(
    total,
    modalState.endereco
  );

  document.querySelectorAll(".pag-card").forEach(btn => {

    btn.addEventListener("click", () => {

      enviarWhatsApp(btn.dataset.pag);

    });

  });

  document
    .getElementById("btnEditarEndereco")
    .addEventListener("click", voltarEntrega);

  bindCloseModal();
}

function irPagamentoCarrinho() {

  const { box } = getModalElements();

  modalState.endereco = {
    rua: document.getElementById("rua").value,
    bairro: document.getElementById("bairro").value,
    numero: document.getElementById("numero").value,
    complemento: document.getElementById("complemento").value
  };

  const total = carrinho.getTotal();

  box.innerHTML = view.renderPagamento(
    total,
    modalState.endereco
  );

  document.querySelectorAll(".pag-card").forEach(btn => {

    btn.addEventListener("click", () => {

      enviarWhatsApp(btn.dataset.pag);

    });

  });

  bindCloseModal();
}

function voltarEntrega() {
  const { box } = getModalElements();

  const total = modalState.checkoutItens.reduce(
  (acc, item) => acc + item.total,
  0
);

  box.innerHTML = view.renderEntrega(total);

  document.getElementById("rua").value =
    modalState.endereco.rua || "";

  document.getElementById("bairro").value =
    modalState.endereco.bairro || "";

  document.getElementById("numero").value =
    modalState.endereco.numero || "";

    document.getElementById("complemento").value =
  modalState.endereco.complemento || "";

  document
  .getElementById("btnPagamento")
  .addEventListener(
    "click",
    modalState.comprandoDoCarrinho
      ? irPagamentoCarrinho
      : irPagamento
  );

  bindCloseModal();
}

function voltarConfig() {
  abrirConfig(
  modalState.item.nome,
  modalState.precoBase,
  modalState.item.sabor
);
}

function enviarWhatsApp(tipo) {
   const { modal } = getModalElements();

   const itens = modalState.checkoutItens;

  let msg = "🛒 *Pedido*\n\n";

  itens.forEach(i => {

  msg += `🍔 ${i.nome}\n`;
  msg += `Qtd: ${i.quantidade}\n`;

  if (i.extras?.length) {
    msg += `Extras: ${i.extras.join(", ")}\n`;
  }

  if (i.borda) {
    msg += `Borda: ${i.borda}\n`;
  }

  if (i.bebida) {
    msg += `Bebida: ${i.bebida}\n`;
  }

  if (i.ponto) {
    msg += `Ponto: ${i.ponto}\n`;
  }

  if (i.massa) {
    msg += `Massa: ${i.massa}\n`;
  }

  if (i.sabor1) {
    msg += `Sabor: ${i.sabor1}\n`;
  }

  if (i.observacoes) {
  msg += `Obs: ${i.observacoes}\n`;
}

if (i.sabor2) {
  msg += `2º sabor: ${i.sabor2}\n`;
}

if (i.meioMeio) {
  msg += `Pizza meio a meio\n`;
}

  msg += `💰 R$ ${i.total.toFixed(2)}\n\n`;
});

  msg += `\n📍 ${modalState.endereco.rua}, ${modalState.endereco.numero}`;
  msg += `\n${modalState.endereco.bairro}`;
  if (modalState.endereco.complemento) {
  msg += `\n📌 ${modalState.endereco.complemento}`;
}
  msg += `\n💳 ${tipo}`;

  window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`);

  modalState.comprandoDoCarrinho = false;

  resetState();

  modal.classList.remove("active");
}

export function abrirCarrinho() {
  const { modal, box } = getModalElements();

  if (!modal || !box) return;

  modal.classList.add("active");

  box.innerHTML = `
    <button class="fechar-x" id="fecharModal">
      <i class="fa-solid fa-xmark"></i>
    </button>

    <div class="modal-scroll">

      <h2 class="carrinho-titulo">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e08c00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart-icon lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        Seu Carrinho
      </h2>

      <div class="carrinho-lista" id="carrinhoLista"></div>

      <button class="btn-comprar-tudo" id="btnComprarTudo">
        Comprar Tudo
      </button>

      <button class="btn-limpar-carrinho" id="btnLimparCarrinho">
        Limpar Carrinho
      </button>

      <h3 class="carrinho-total">
        Total:
        <span id="totalCarrinho"></span>
      </h3>

    </div>
  `;

  atualizarCarrinhoUI();

  document
    .getElementById("btnComprarTudo")
    .addEventListener("click", comprarTudo);

  document
    .getElementById("btnLimparCarrinho")
    .addEventListener("click", limparCarrinho);

  bindCloseModal();

  function comprarTudo() {

  const itens = carrinho.getItens();

  if (!itens.length) {
    return mostrarErro("Carrinho vazio");
  }

  modalState.comprandoDoCarrinho = true;

  modalState.modo = "checkout-carrinho";

  modalState.checkoutItens = [...itens];

  const total = modalState.checkoutItens.reduce(
  (acc, item) => acc + item.total,
  0
);

  box.innerHTML = view.renderEntrega(total);

  document
    .getElementById("btnPagamento")
    .addEventListener("click", irPagamentoCarrinho);

  bindCloseModal();
}

  function limparCarrinho() {

    carrinho.limpar();

    atualizarCarrinhoUI();

    atualizarBadge();

    mostrarToast("Carrinho limpo!");

  }
}

function bindCloseModal() {
  const btn = document.getElementById("fecharModal");

  if (!btn) return;

  btn.addEventListener("click", fecharModal);
}

export function fecharModal() {
  const { modal, box } = getModalElements();

  modal.classList.remove("active");
  box.innerHTML = "";

    resetState();
}





