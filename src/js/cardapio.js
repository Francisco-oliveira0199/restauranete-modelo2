const botoes = document.querySelectorAll(".categoria-btn");
const categorias = document.querySelectorAll(".categoria");

// ================= CATEGORIAS =================

function ativarCategoria(id) {

  botoes.forEach(btn => {
    btn.classList.remove("active");
    if (btn.dataset.id === id) {
      btn.classList.add("active");
    }
  });

  categorias.forEach(cat => cat.classList.remove("active"));

  const categoria = document.getElementById(id);
  if (categoria) {
    categoria.classList.add("active");
  }
}

botoes.forEach(botao => {
  botao.addEventListener("click", () => {
    ativarCategoria(botao.dataset.id);
  });
});

// URL
const params = new URLSearchParams(window.location.search);
const categoriaUrl = params.get("categoria");
if (categoriaUrl) ativarCategoria(categoriaUrl);

// ================= MODAL =================

const modal = document.getElementById("modalPedido");
const modalBox = document.querySelector(".modal-box");

let itemAtual = "";
let precoAtual = "";

let ruaGlobal = "";
let bairroGlobal = "";
let numeroGlobal = "";

// ABRIR ITEM
document.querySelectorAll(".item").forEach(item => {
  item.addEventListener("click", () => {
    itemAtual = item.dataset.nome;
    precoAtual = item.dataset.preco;

    abrirEntrega();
    modal.classList.add("active");
  });
});

// FECHAR
function fecharModal() {
  modal.classList.remove("active");
}

// FORMATAR NOME
function formatarNome(nome) {
  return nome.replaceAll("-", " ");
}

// ================= ENTREGA =================

function abrirEntrega() {
  modalBox.innerHTML = `
    
    <button class="fechar-x" onclick="fecharModal()">✕</button>

    <div class="resumo-pedido">
      <span>Informações de entrega</span>
      <h2>${formatarNome(itemAtual)}</h2>
      <p>R$ ${precoAtual},00</p>
    </div>

    <div class="resumo">

      <h3>Endereço de entrega</h3>

      <span>Bairro*</span>
      <input id="bairro" placeholder="Centro">

      <span>Rua*</span>
      <input id="rua" placeholder="Rua">

      <span>Número*</span>
      <input id="numero" placeholder="123">

      <span>Complemento</span>
      <input id="complemento" placeholder="Apartamento, bloco A">

      <button class="btn" onclick="irPagamento()">
  Continuar para pagamento
</button>

    </div>
  `;
}

// ================= VALIDAÇÃO =================

function irPagamento() {

  const rua = document.getElementById("rua").value;
  const bairro = document.getElementById("bairro").value;
  const numero = document.getElementById("numero").value;

  if (!rua || !bairro || !numero) {
    alert("Preencha os campos obrigatórios!");
    return;
  }

  ruaGlobal = rua;
  bairroGlobal = bairro;
  numeroGlobal = numero;

  modalBox.innerHTML = `
    
    <button class="fechar-x" onclick="fecharModal()">✕</button>

    <!-- TOPO -->
    <div class="resumo-topo">
      <span class="titulo-topo">Pagamento</span>
      <h2>${formatarNome(itemAtual)}</h2>
      <p>R$ ${precoAtual},00</p>
    </div>

    <!-- CONTEÚDO -->
    <div class="pagamento-conteudo">

      <div class="endereco-box">

        <div class="endereco-header">
          <div class="editar-endereco" id="btnEditarEndereco">
          ← Editar endereço
          </div>
        </div>

        <div class="endereco-dados">
        <p>${rua}, ${numero}</p>
        <p>${bairro}</p>
        </div>
        </div>

      </div>

      <h3 class="pagamento-titulo">Escolha a forma de pagamento:</h3>

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
            <p>Pagamento em espécie</p>
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

  document
  .getElementById("btnEditarEndereco")
  .addEventListener("click", abrirEntrega);

  ativarPagamentos();
}

function ativarPagamentos() {
  const cards = document.querySelectorAll(".pag-card");

  cards.forEach(card => {
    card.addEventListener("click", () => {

      cards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      const tipo = card.dataset.pag;

      if (tipo === "pix") {
  enviarWhatsApp("Pix", ruaGlobal, numeroGlobal, bairroGlobal);
}

if (tipo === "dinheiro") {
  enviarWhatsApp("Dinheiro", ruaGlobal, numeroGlobal, bairroGlobal);
}

if (tipo === "cartao") {
  enviarWhatsApp("Cartão", ruaGlobal, numeroGlobal, bairroGlobal);
}

    });
  });
}

function enviarWhatsApp(tipoPagamento, rua, numero, bairro) {

  const numeroLoja = "5511999999999"; // 🔥 coloque seu número aqui

  const mensagem = `
🛒 *Novo Pedido*

🍔 Item: ${formatarNome(itemAtual)}
💰 Valor: R$ ${precoAtual},00

📍 Endereço:
${rua}, ${numero}
${bairro}

💳 Pagamento: ${tipoPagamento}
`;

  const texto = encodeURIComponent(mensagem);

  const url = `https://wa.me/${numeroLoja}?text=${texto}`;

  window.open(url, "_blank");
}