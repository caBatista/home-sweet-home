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
  const { addToCart, cart } = useCart();

  if (!product) {
    return <div>Product not found</div>;
  }

  const [quantity, setQuantity] = useState(1);

  const remainingStock = (() => {
    const cartItem = cart.find(item => item.product.id === product.id);
    return cartItem ? product.quantity - cartItem.quantity : product.quantity;
  })();

  const handleAddToCart = () => {
    if (remainingStock >= quantity) {
      addToCart(product as Product, quantity);
    }
  };

  return (
    <>
      <Header onSearchTermChange={setSearchTerm} />
      <div className="container mx-auto mt-10">
        <Card className="product-card">
          <CardContent>
            <div className="flex flex-col md:flex-row mt-10">
              <div className="flex flex-col md:w-1/2 xl:w-3/5">
                <CardTitle className="text-2xl mb-4 md:hidden px-4">{product.name}</CardTitle>
                <div className="relative w-full max-w-2xl px-4">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {product.imagesUrl.map((url, index) => (
                        <CarouselItem key={index}>
                          <div className="flex justify-center items-center bg-white p-4 rounded-xl">
                            <div className="w-full aspect-square relative rounded-xl overflow-hidden">
                              <img
                                src={url}
                                alt={`${product.name} - Image ${index + 1}`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2 hover:bg-white/80" />
                    <CarouselNext className="right-2 hover:bg-white/80" />
                  </Carousel>
                </div>
              </div>
              <div className="md:w-1/2 xl:w-2/5 md:pl-8 mt-8 md:mt-0">
                <CardTitle className="text-4xl mb-4 hidden md:block">{product.name}</CardTitle>
                <h3 className="text-xl font-semibold text-left">
                  Sobre este produto
                </h3>
                <div className="mb-4 mt-3 text-left">
                  {product.description.split('\n').map((line, index) => {
                  const trimmed = line.trim();
                  if (trimmed.startsWith('-')) {
                    return (
                    <li key={index} className="ml-5 list-disc">
                      {trimmed.substring(1).trim()}
                    </li>
                    );
                  }
                  return (
                    <p key={index} className={index !== 0 ? "mt-2" : ""}>
                    {trimmed}
                    </p>
                  );
                  })}
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {remainingStock > 0 
                    ? `${remainingStock} unidade${remainingStock > 1 ? 's' : ''} disponíve${remainingStock > 1 ? 'is' : 'l'}`
                    : 'Produto indisponível'
                  }
                </p>
                <p className="text-lg font-bold mb-4">
                  R${product.price.toFixed(2)}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center mb-10">
                  {remainingStock > 1 && (
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 text-foreground"
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="mx-4 text-foreground min-w-[2rem] text-center font-medium">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 text-foreground"
                        onClick={() => setQuantity(prev => Math.min(remainingStock, prev + 1))}
                        disabled={quantity >= remainingStock}
                      >
                        +
                      </Button>
                    </div>
                  )}
                  <Button
                    className={`add-to-cart-button ${remainingStock <= 1 ? "w-full" : "flex-1"}`}
                    onClick={handleAddToCart}
                    disabled={remainingStock === 0}
                  >
                    {remainingStock === 0 ? 'Indisponível' : 'Adicionar ao carrinho'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ProductDetailPage;
