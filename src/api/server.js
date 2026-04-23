import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// criar pedido
app.post("/pedido", async (req, res) => {
  const { produto, quantidade, valor, endereco, pagamento } = req.body;

  const pedido = await prisma.pedido.create({
    data: {
      empresa_id: 1, // Sabor & Cia
      produto,
      quantidade,
      valor,
      endereco,
      pagamento
    }
  });

  res.json(pedido);
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});