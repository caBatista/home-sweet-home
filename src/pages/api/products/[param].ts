import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

async function handleGetByCategory(category: string, res: NextApiResponse) {
  try {
    const products = await prisma.product.findMany({
      where: { category },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch products by category` });
  }
}

async function handleGetById(id: number, res: NextApiResponse) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: `Product not found` });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch product by ID` });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { param } = req.query;

  if (req.method === "GET") {
    if (isNaN(Number(param))) {
      await handleGetByCategory(param as string, res);
    } else {
      await handleGetById(Number(param), res);
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
