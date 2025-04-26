import React, { useEffect, useState } from "react";
import { Product } from "types";
import ProductCard from "./ProductCard";
import { Skeleton } from "./ui/skeleton";
import { Card, CardHeader, CardContent } from "@components/ui/card";
import { useRouter } from "next/router";
import DonateSection from "./DonateSection";

interface ProductGridProps {
  category?: string;
  searchTerm: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ searchTerm, category }) => {
  const router = useRouter();
  const { category: queryCategory } = router.query;

  if (queryCategory === "donate") {
    return <DonateSection />;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = category ? `/api/products/${category}` : "/api/products";
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);

        await Promise.all(
          data.map((p: Product) =>
            new Promise<void>((resolve) => {
              const img = new Image()
              img.src = p.imagesUrl[0]
              img.onload = () => resolve()
              img.onerror = () => resolve()
            })
          )
        );
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, searchTerm]);

  const filteredProducts = Array.isArray(products)
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (loading) {
    return (
      <div className="ml-10 mr-10 mt-10 mb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <Card key={idx} className="product-card">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="w-full h-48 mb-4 rounded-xl" />
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
        <div className="mb-6 text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-4"
          >
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb- text-foreground text-center">
            {searchTerm
            ? `Nenhum produto encontrado para "${searchTerm}"`
            : category
            ? `Nenhum produto disponível na categoria ${category.charAt(0).toUpperCase() + category.slice(1)}`
            : "Nenhum produto disponível no momento"}
        </h1>
        {!searchTerm && !category && (
          <p className="text-lg mt-4 mb-8 text-muted-foreground text-center">
              Que tal fazer uma doação? Selecione "Doar" nas categorias para doar qualquer quantia.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="ml-10 mr-10 mt-10 mb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
