import { abrirConfig, abrirCarrinho } from "./controllers/modalController.js";
import { atualizarBadge } from "./ui/badge.js";
import { carrinho } from "./main.js";
import { mostrarToast, animarCarrinho } from "./ui/feedback.js";
import { normalizarItem } from "./utils/helpers.js";

/* ================= CATEGORIAS ================= */

const botoes = document.querySelectorAll(".categoria-btn");
const categorias = document.querySelectorAll(".categoria");

function ativarCategoria(id) {
  botoes.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.id === id);
  });

  categorias.forEach(cat => {
    cat.classList.toggle("active", cat.id === id);
  });
}

botoes.forEach(btn => {
  btn.addEventListener("click", () => {
    ativarCategoria(btn.dataset.id);
  });
});

/* ================= URL ================= */

const params = new URLSearchParams(window.location.search);
const categoriaUrl = params.get("cat");

if (categoriaUrl) {
  ativarCategoria(categoriaUrl);
}

/* ================= ITENS ================= */

document.querySelectorAll(".item").forEach(item => {

  const botao = item.querySelector(".btn-carrinho");
  const info = item.querySelector(".item-info");

  const nome = item.dataset.nome;
  const preco = Number(item.dataset.preco);

  /* ================= ADICIONAR DIRETO ================= */

  botao.addEventListener("click", (e) => {
    e.stopPropagation();

    carrinho.adicionar(
  normalizarItem({
    nome,
    quantidade: 1,
    precoUnitario: preco,
    total: preco
  })
);

    atualizarBadge();
    mostrarToast();
    animarCarrinho();
  });

  /* ================= ABRIR MODAL ================= */

  info.addEventListener("click", () => {
    abrirConfig(nome, preco);
  });

});

/* ================= BADGE ================= */

atualizarBadge();

/* ================= CARRINHO ================= */

const btnCarrinho = document.getElementById("btnCarrinho");

if (btnCarrinho) {
  btnCarrinho.addEventListener("click", abrirCarrinho);
}