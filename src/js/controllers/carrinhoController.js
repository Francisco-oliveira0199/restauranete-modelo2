import { carrinho } from "../main.js";
import { atualizarBadge } from "../ui/badge.js";
import { atualizarCarrinhoUI } from "../ui/atualizarCarrinhoUI.js";

export function aumentar(index) {
  carrinho.aumentar(index);

  atualizarCarrinhoUI();
  atualizarBadge();
}

export function diminuir(index) {
  carrinho.diminuir(index);

  atualizarCarrinhoUI();
  atualizarBadge();
}

export function remover(index) {
  carrinho.remover(index);

  atualizarCarrinhoUI();
  atualizarBadge();
}