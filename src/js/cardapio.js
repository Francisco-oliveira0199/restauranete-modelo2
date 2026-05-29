import {
  abrirConfig,
  abrirConfigCarrinho,
  abrirCarrinho
} from "./controllers/modalController.js";
import { atualizarBadge } from "./ui/badge.js";
import { carrinho } from "./main.js";
import { mostrarToast, animarCarrinho } from "./ui/feedback.js";
import { normalizarItem } from "./utils/helpers.js";
import { modalState } from "./state/modalState.js";

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

  const botaoAdicionar = item.querySelector(".btn-add-carrinho");

  const botaoComprar = item.querySelector(".btn-comprar");

  const info = item.querySelector(".item-info");

  const categoria = item.closest(".categoria")?.id;

  const nome = item.dataset.nome;

  const preco = Number(item.dataset.preco);

  const sabor = item.dataset.sabor;

  /* ================= ADICIONAR AO CARRINHO ================= */

  if (botaoAdicionar) {

    botaoAdicionar.addEventListener("click", (e) => {

      e.stopPropagation();

      /* SUCOS E BEBIDAS = ADICIONA DIRETO */

      if (categoria === "sucos" || categoria === "bebidas") {

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

        return;
      }

      abrirConfigCarrinho(nome, preco, sabor);

    });

  }

  /* ================= COMPRAR DIRETO ================= */

  if (botaoComprar) {

    botaoComprar.addEventListener("click", (e) => {

      e.stopPropagation();

      modalState.modo = "compra-direta";
      abrirConfig(nome, preco, sabor);

    });

  }

  /* ================= CLICK NO CARD ================= */

  if (info) {

    info.addEventListener("click", () => {

      if (
        categoria === "pizzas" ||
        categoria === "pasteis" ||
        categoria === "hamburgueres"
      ) {

        abrirConfig(nome, preco, sabor);

      }

    });

  }

});

/* ================= BADGE ================= */

atualizarBadge();

/* ================= ABRIR CARRINHO ================= */

const btnCarrinho = document.getElementById("btnCarrinho");

if (btnCarrinho) {

  btnCarrinho.addEventListener("click", () => {

    abrirCarrinho();

  });

}
