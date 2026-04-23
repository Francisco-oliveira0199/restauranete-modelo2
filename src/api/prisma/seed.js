// seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

await prisma.empresa.create({
  data: {
    nome: "Sabor & Cia"
  }
});

console.log("Empresa criada!");