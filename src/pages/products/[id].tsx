import { Button } from "@components/ui/button";
import { Card, CardContent, CardTitle } from "@components/ui/card";
import Header from "@components/Header";
import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { useCart } from "@contexts/cart-context";
import { Product } from "types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@components/ui/carousel";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const baseUrl = process.env.NEXT_PUBLIC_URL;
  const url = `${baseUrl}/api/products/${id}`;
  const res = await fetch(url);
  const product = await res.json();

  return {
    props: {
      product: product
        ? {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            imagesUrl: product.imagesUrl,
            quantity: product.quantity ?? 0,
          }
        : null,
    },
  };
};

const ProductDetailPage: React.FC<{ product: Product | null }> = ({ product }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = () => {
    addToCart(product as Product);
  };

  return (
    <>
      <Header onSearchTermChange={setSearchTerm} />
      <div className="container mx-auto mt-10">
        <Card className="product-card">
          <CardContent>
            <div className="flex flex-col md:flex-row mt-10">
              <div className="flex justify-center items-center md:w-1/2">
                <Carousel className="w-64 mb-4">
                  <CarouselContent>
                    {product.imagesUrl.map((url, index) => (
                      <CarouselItem key={index}>
                        <img
                          src={url}
                          alt={`${product.name} - Image ${index + 1}`}
                          className="w-64 h-64 object-cover rounded-xl"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
              <div className="md:w-1/2 md:pl-8">
                <CardTitle className="text-4xl mb-4">{product.name}</CardTitle>
                <p className="text-lg font-bold mb-4">
                  R${product.price.toFixed(2)}
                </p>
                <div className="mb-4 text-left">
                  {product.description.split('\n').map((line, index) => (
                    line.trim().startsWith('-') ? (
                      <li key={index} className="ml-5 list-disc">
                        {line.trim().substring(1).trim()}
                      </li>
                    ) : (
                      <p key={index}>{line.trim()}</p>
                    )
                  ))}
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {product.quantity > 0 
                    ? `${product.quantity} unidade${product.quantity > 1 ? 's' : ''} disponíve${product.quantity > 1 ? 'is' : 'l'}`
                    : 'Produto indisponível'
                  }
                </p>
                <Button
                  className="mt-4 mb-10 add-to-cart-button"
                  onClick={handleAddToCart}
                  disabled={product.quantity === 0}
                >
                  {product.quantity === 0 ? 'Indisponível' : 'Adicionar ao carrinho'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ProductDetailPage;
