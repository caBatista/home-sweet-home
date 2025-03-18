import { Button } from "@components/components/ui/button";
import { Card, CardContent, CardTitle } from "@components/components/ui/card";
import Header from "@components/Header";
import Layout from "@components/Layout";
import { GetServerSideProps } from "next";
import React, { useState } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const url = `http://localhost:3000/api/products/${id}`;
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
            imageUrl: product.imageUrl,
          }
        : null,
    },
  };
};

const ProductDetailPage: React.FC<{ product: any }> = ({ product }) => {
  const [searchTerm, setSearchTerm] = useState("");
  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <Layout>
      <Header onSearchTermChange={setSearchTerm} />
      <div className="container mx-auto mt-10">
        <Card className="product-card">
          <CardContent>
            <div className="flex flex-col md:flex-row">
              <div className="flex justify-center items-center md:w-1/2">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-64 h-64 object-cover mb-4 rounded-xl"
                />
              </div>
              <div className="md:w-1/2 md:pl-8">
                <CardTitle className="text-4xl mb-4">{product.name}</CardTitle>
                <p className="text-lg font-bold mb-4">
                  R${product.price.toFixed(2)}
                </p>
                <p className="mb-4">{product.description}</p>
                <p className="text-sm text-gray-500 mb-4"></p>
                <Button className="mt-4">Add to Cart</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
