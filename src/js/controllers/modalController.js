import { modalState } from "../state/modalState.js";
import { calcularTotal } from "../services/pedidoService.js";
import * as view from "../views/modalView.js";
import { carrinho } from "../main.js";
import { atualizarBadge } from "../ui/badge.js";
import { mostrarToast, mostrarErro, animarCarrinho } from "../ui/feedback.js";
import { resetState } from "../state/modalState.js";
import { normalizarItem } from "../utils/helpers.js";

function getModalElements() {
  return {
    modal: document.getElementById("modalPedido"),
    box: document.querySelector(".modal-box")
  };
}

export function abrirConfig(nome, preco) {

  const { modal, box } = getModalElements();

  const mesmoItem =
  modalState.item.nome === nome;

if (!mesmoItem) {

  resetState();

  modalState.item.nome = nome;

  modalState.precoBase = preco;
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

  /* ================= PIZZA ================= */

  if (tipo === "pizza") {

    el.innerHTML = `

      <div class="secao">

        <h3>Adicionais</h3>

        <div class="linha-tripla">

          <select id="sabor1">
           <option value="">Sem extras</option>
            <option value="calabresa">Calabresa</option>
            <option value="frango">Frango</option>
            <option value="mussarela">Mussarela</option>
          </select>

          <select id="borda">
           <option value="">Sem borda</option>
            <option value="">Borda</option>
            <option value="catupiry">Catupiry</option>
            <option value="cheddar">Cheddar</option>
          </select>

          <select id="bebida">
           <option value="">Sem bebida</option>
            <option value="">Bebida</option>
            <option value="coca">Coca</option>
            <option value="guarana">Guaraná</option>
          </select>

        </div>

        <label>
          <input type="checkbox" id="meioMeio">
          Meio a meio
        </label>

        <select id="sabor2" style="display:none;">
         <option value="">Sem sabor adicional</option>
          <option value="calabresa">Calabresa</option>
          <option value="frango">Frango</option>
          <option value="mussarela">Mussarela</option>
        </select>

      </div>

    `;

    document
      .getElementById("meioMeio")
      .addEventListener("change", e => {

        document.getElementById("sabor2").style.display =
          e.target.checked ? "block" : "none";

      });
  }

  /* ================= HAMBURGUER ================= */

  if (tipo === "hamburguer") {

    el.innerHTML = `

      <div class="secao">

        <h3>Adicionais</h3>

        <label>
          <input type="checkbox" class="extra" value="bacon">
          Bacon
        </label>

        <label>
          <input type="checkbox" class="extra" value="queijo">
          Queijo
        </label>

        <label>
          <input type="checkbox" class="extra" value="alface">
          Alface
        </label>

      </div>

      <div class="secao">

        <h3>Ponto da carne</h3>

        <select id="ponto">
          <option value="mal passado">Mal passado</option>
          <option value="ao ponto">Ao ponto</option>
          <option value="bem passado">Bem passado</option>
        </select>

      </div>

      <div class="secao">

        <h3>Bebida</h3>

        <select id="bebida">
          <option value="">Sem bebida</option>
          <option value="coca">Coca</option>
          <option value="guarana">Guaraná</option>
        </select>

      </div>

    `;
  }

  /* ================= PASTEL ================= */

  if (tipo === "pastel") {

    el.innerHTML = `

      <div class="secao">

        <h3>Adicionais</h3>

        <label>
          <input type="checkbox" class="extra" value="queijo">
          Queijo
        </label>

        <label>
          <input type="checkbox" class="extra" value="milho">
          Milho
        </label>

      </div>

      <div class="secao">

        <h3>Massa</h3>

        <select id="massa">
          <option value="tradicional">Tradicional</option>
          <option value="pizza">Pizza</option>
        </select>

      </div>

      <div class="secao">

        <h3>Bebida</h3>

        <select id="bebida">
          <option value="">Sem bebida</option>
          <option value="coca">Coca</option>
          <option value="guarana">Guaraná</option>
        </select>

      </div>

    `;
  }
}

function restaurarConfig() {

  const config = modalState.config;

  document.getElementById("quantidade").value =
    config.quantidade || 1;

  if (document.getElementById("sabor1")) {
    document.getElementById("sabor1").value =
      config.sabor1 || "";
  }

  if (document.getElementById("sabor2")) {

    document.getElementById("sabor2").style.display =
      config.meioMeio ? "block" : "none";

    document.getElementById("sabor2").value =
      config.sabor2 || "";
  }

  if (document.getElementById("meioMeio")) {
    document.getElementById("meioMeio").checked =
      config.meioMeio || false;
  }

  if (document.getElementById("borda")) {
    document.getElementById("borda").value =
      config.borda || "";
  }

  if (document.getElementById("bebida")) {
    document.getElementById("bebida").value =
      config.bebida || "";
  }

  if (document.getElementById("ponto")) {
    document.getElementById("ponto").value =
      config.ponto || "";
  }

  if (document.getElementById("massa")) {
    document.getElementById("massa").value =
      config.massa || "";
  }

  document.querySelectorAll(".extra").forEach(extra => {

    extra.checked =
      config.extras?.includes(extra.value);

  });

}

function bindEvents() {
  document.getElementById("btnContinuar")
    .addEventListener("click", irEntrega);

  document.getElementById("quantidade")
    .addEventListener("input", atualizarPreco);

  document.getElementById("extras")
    .addEventListener("change", atualizarPreco);
}

function atualizarPreco() {
  modalState.config = {
    quantidade: Number(document.getElementById("quantidade").value || 1),
    sabor1: document.getElementById("sabor1")?.value,
    sabor2: document.getElementById("sabor2")?.value,
    meioMeio: document.getElementById("meioMeio")?.checked,
    borda: document.getElementById("borda")?.value,
    bebida: document.getElementById("bebida")?.value,
    ponto: document.getElementById("ponto")?.value,
    massa: document.getElementById("massa")?.value,
    extras: [...document.querySelectorAll(".extra:checked")].map(e => e.value)
  };

   const resultado = calcularTotal(
    modalState.config,
    modalState.precoBase
  );

  document.getElementById("precoTotal").innerText =
  `R$ ${resultado.total.toFixed(2).replace(".", ",")}`;
}

function irEntrega() {
  const { box } = getModalElements();

  const resultado = calcularTotal(
    modalState.config,
    modalState.precoBase
  );

  box.innerHTML = view.renderEntrega(resultado.total);

  document.getElementById("btnPagamento")
    .addEventListener("click", irPagamento);

  bindCloseModal();

  document
  .getElementById("btnVoltarConfig")
  ?.addEventListener("click", voltarConfig);
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
    modalState.precoBase
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

import { atualizarCarrinhoUI } from "../ui/atualizarCarrinhoUI.js";



