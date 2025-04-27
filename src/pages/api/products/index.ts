import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { search } = req.query;

  try {
    const products = await prisma.product.findMany({
      where: {
        AND: [
          search ? { name: { contains: search as string } } : {},
          { active: true }
        ],
      },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch products: ${error}` });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { name, description, price, category, imagesUrl, url, quantity } = req.body;
  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        imagesUrl,
        url,
        active: true,
        quantity: parseInt(quantity),
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await handleGet(req, res);
  } else if (req.method === "POST") {
    await handlePost(req, res);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
