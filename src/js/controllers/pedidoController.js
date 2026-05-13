import { carrinho } from "../main.js";

const TELEFONE = "5511999999999";

function montarMensagem(itens, endereco = null, pagamento = null) {
  let msg = "🛒 Pedido:\n\n";

  itens.forEach(i => {
    msg += `${i.nome} x${i.quantidade}\n`;

    if (i.sabor1) msg += `Sabor: ${i.sabor1}\n`;
    if (i.sabor2) msg += `Meio a meio: ${i.sabor1}/${i.sabor2}\n`;
    if (i.borda) msg += `Borda: ${i.borda}\n`;
    if (i.massa) msg += `Massa: ${i.massa}\n`;
    if (i.ponto) msg += `Ponto: ${i.ponto}\n`;
    if (i.bebida) msg += `Bebida: ${i.bebida}\n`;
    if (i.extras?.length) msg += `Extras: ${i.extras.join(", ")}\n`;

    msg += `R$ ${i.total.toFixed(2)}\n\n`;
  });

  if (endereco) {
    msg += `📍 ${endereco.rua}, ${endereco.numero} - ${endereco.bairro}\n`;
  }

  if (pagamento) {
    msg += `💳 ${pagamento}\n`;
  }

  return msg;
}

export function comprarTudo(endereco, pagamento) {
  const itens = carrinho.getItens();
  if (!itens.length) return alert("Carrinho vazio");

  const msg = montarMensagem(itens, endereco, pagamento);
  window.open(`https://wa.me/${TELEFONE}?text=${encodeURIComponent(msg)}`);
}

export function comprarItem(item) {
  const msg = montarMensagem([item]);
  window.open(`https://wa.me/${TELEFONE}?text=${encodeURIComponent(msg)}`);
}