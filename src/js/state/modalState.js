export const modalState = {
  item: {
    nome: ""
  },

  precoBase: 0,

  config: {
    quantidade: 1,
    sabor1: null,
    sabor2: null,
    meioMeio: false,
    borda: null,
    bebida: null,
    ponto: null,
    extras: [],
    massa: null
  },

  endereco: {
    rua: "",
    bairro: "",
    numero: ""
  }
};

export function resetState() {
  modalState.item = { nome: "" };
  modalState.precoBase = 0;

  modalState.config = {
    quantidade: 1,
    sabor1: null,
    sabor2: null,
    meioMeio: false,
    borda: null,
    bebida: null,
    ponto: null,
    extras: [],
    massa: null
  };

  modalState.endereco = {
    rua: "",
    bairro: "",
    numero: ""
  };
}