import React from "react";
import { Product } from "types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@components/ui/card";
import { Button } from "@components/ui/button";
import Link from "next/link";
import { useCart } from "@contexts/cart-context";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="product-card hover:outline-2 hover:shadow-lg min-w-3xs [transition:opacity_.2s] active:opacity-60">
        <CardHeader className="h-[40px]">
          <div className="flex items-center justify-center">
            <CardTitle className="line-clamp-3 text-center">{product.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center bg-white p-2 rounded-xl">
            <div className="w-48 h-48 relative rounded-xl overflow-hidden">
              <img
                src={product.imagesUrl[0]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <p className="text-lg font-bold mt-4 mb-2">R${product.price.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mb-2">
            {product.quantity > 0 
              ? `${product.quantity} disponíve${product.quantity > 1 ? 'is' : 'l'}`
              : 'Produto indisponível'
            }
          </p>
          <Button 
            className="mt-2" 
            onClick={handleAddToCart}
            disabled={product.quantity === 0}
          >
            {product.quantity === 0 ? 'Indisponível' : 'Adicionar ao carrinho'}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
