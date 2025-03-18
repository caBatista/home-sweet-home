import React from "react";
import { Product } from "@prisma/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@components/components/ui/card";
import { Button } from "@components/components/ui/button";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="product-card hover:outline-2 hover:shadow-lg">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-48 h-48 object-cover mb-4 rounded-xl"
          />
        </div>
        <p className="text-lg font-bold">R${product.price}</p>
        <Button className="mt-2">Detalhes</Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
