import { modalState } from "../state/modalState.js";
import { calcularTotal } from "../services/pedidoService.js";
import * as view from "../views/modalView.js";
import { carrinho } from "../main.js";
import { atualizarBadge } from "../ui/badge.js";
import { mostrarToast, mostrarErro, animarCarrinho } from "../ui/feedback.js";
import { resetState } from "../state/modalState.js";

function getModalElements() {
  return {
    modal: document.getElementById("modalPedido"),
    box: document.querySelector(".modal-box")
  };
}

export function abrirConfig(nome, preco) {
  const { modal, box } = getModalElements();

  modalState.item.nome = nome;
  modalState.precoBase = preco;

  modal.classList.add("active");

  box.innerHTML = view.renderConfig(nome, preco);

  montarExtras();

  bindEvents();

  bindCloseModal();

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
            <option value="calabresa">Calabresa</option>
            <option value="frango">Frango</option>
            <option value="mussarela">Mussarela</option>
          </select>

          <select id="borda">
            <option value="">Borda</option>
            <option value="catupiry">Catupiry</option>
            <option value="cheddar">Cheddar</option>
          </select>

          <select id="bebida">
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

  carrinho.adicionar({
    nome: modalState.item.nome,
    ...modalState.config,
    precoUnitario: resultado.precoUnitario,
    total: resultado.total
  });

  atualizarBadge();
  mostrarToast();
  animarCarrinho();

  box.innerHTML = view.renderEntrega(resultado.total);

  document.getElementById("btnPagamento")
    .addEventListener("click", irPagamento);

  bindCloseModal();
}

function irPagamento() {
  const { box } = getModalElements();

  modalState.endereco = {
    rua: document.getElementById("rua").value,
    bairro: document.getElementById("bairro").value,
    numero: document.getElementById("numero").value
  };

  if (!modalState.endereco.rua || !modalState.endereco.numero) {
    return mostrarErro("Preencha endereço corretamente");
  }

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

function enviarWhatsApp(tipo) {
   const { modal } = getModalElements();

   const itens = carrinho.getItens();

  let msg = "🛒 *Pedido*\n\n";

  itens.forEach(i => {
    msg += `${i.nome} x${i.quantidade} - R$ ${i.total.toFixed(2)}\n`;
  });

  msg += `\n📍 ${modalState.endereco.rua}, ${modalState.endereco.numero}`;
  msg += `\n${modalState.endereco.bairro}`;
  msg += `\n💳 ${tipo}`;

  window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`);

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
      <i class="fa-solid fa-cart-shopping"></i>
      Seu Carrinho
      </h2>

      <div class="carrinho-lista" id="carrinhoLista"></div>

      <button class="btn-comprar-tudo" id="btnComprarTudo">
        Comprar Tudo
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

  function comprarTudo() {
  const itens = carrinho.getItens();

  if (!itens.length) return;

  let msg = "🛒 *Pedido Completo*\n\n";

  let total = 0;

  itens.forEach(item => {
    const subtotal = item.precoUnitario * item.quantidade;

    total += subtotal;

    msg += `• ${item.nome}\n`;
    msg += `Qtd: ${item.quantidade}\n`;
    msg += `Subtotal: R$ ${subtotal.toFixed(2)}\n\n`;
  });

  msg += `💰 Total: R$ ${total.toFixed(2)}`;

  window.open(
    `https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`
  );
}
    
  bindCloseModal();
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
}

import { atualizarCarrinhoUI } from "../ui/atualizarCarrinhoUI.js";



