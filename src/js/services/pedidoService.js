const precosExtras = {
  borda: {
    catupiry: 5,
    cheddar: 6
  },

  bebida: {
    coca: 6,
    guarana: 6,
    fanta: 6,
    agua: 4
  }
};

const sabores = {
  calabresa: 30,
  frango: 32,
  mussarela: 28,
  portuguesa: 50,
  pepperoni: 52
};

const adicionais = {
  bacon: 3,
  ovo: 2,
  queijo: 2,
  alface: 1,
  milho: 2
};

export function calcularTotal(
  config,
  precoBaseOriginal
) {

  const qtd = Number(config.quantidade || 1);

  let precoUnitario = precoBaseOriginal;

  /* ================= SABORES ================= */

  if (config.sabor1) {

    const precoSabor1 =
      sabores[config.sabor1] || precoBaseOriginal;

    if (config.meioMeio && config.sabor2) {

      const precoSabor2 =
        sabores[config.sabor2] || precoBaseOriginal;

      precoUnitario =
        (precoSabor1 + precoSabor2) / 2;

    } else {

      precoUnitario = precoSabor1;

    }
  }

  /* ================= EXTRAS ================= */

  let extrasTotal = 0;

  if (config.borda) {
    extrasTotal +=
      precosExtras.borda[config.borda] || 0;
  }

  if (config.bebida) {
    extrasTotal +=
      precosExtras.bebida[config.bebida] || 0;
  }

  if (config.extras?.length) {

    config.extras.forEach(extra => {

      extrasTotal +=
        adicionais[extra] || 0;

    });
  }

  /* ================= TOTAL ================= */

  const precoFinalUnitario =
    precoUnitario + extrasTotal;

  const total =
    precoFinalUnitario * qtd;

  return {
    precoUnitario: Number(precoFinalUnitario),
    total: Number(total)
  };
}