import React from "react";
import { Product } from "types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@components/components/ui/card";
import { Button } from "@components/components/ui/button";
import Link from "next/link";
import { useCart } from "@contexts/cart-context";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    addToCart(product);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="product-card hover:outline-2 hover:shadow-lg min-w-3xs">
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
          <p className="text-lg font-bold">R${product.price.toFixed(2)}</p>
          <Button className="mt-2" onClick={handleAddToCart}>
            Adicionar ao carrinho
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
