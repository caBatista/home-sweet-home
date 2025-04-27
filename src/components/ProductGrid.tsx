import React, { useEffect, useState } from "react";
import { Product } from "types";
import ProductCard from "./ProductCard";
import { Skeleton } from "./ui/skeleton";
import { Card, CardHeader, CardContent } from "@components/ui/card";
import { useRouter } from "next/router";
import DonateSection from "./DonateSection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ProductGridProps {
  category?: string;
  searchTerm: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ searchTerm, category }) => {
  const router = useRouter();
  const { category: queryCategory } = router.query;
  const [sortBy, setSortBy] = useState<string>("default");

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

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="mx-4 md:mx-10 mt-6 md:mt-10 mb-6 md:mb-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <Skeleton className="h-7 md:h-8 w-48 md:w-64" />
          <Skeleton className="h-10 w-full md:w-[200px]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <Card key={idx} className="product-card min-w-3xs">
              <CardHeader className="h-[40px]">
                <div className="flex items-center justify-center">
                  <Skeleton className="h-6 w-32" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center">
                  <Skeleton className="w-48 h-48 rounded-xl mb-4" />
                </div>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-10 w-full mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
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
    <div className="mx-4 md:mx-10 mt-6 md:mt-10 mb-6 md:mb-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h2 className="text-lg md:text-xl font-medium text-foreground">
          {searchTerm
            ? `Resultados para "${searchTerm}" (${filteredProducts.length})`
            : category
            ? `${category.charAt(0).toUpperCase() + category.slice(1)} (${filteredProducts.length})`
            : `Todos os produtos (${filteredProducts.length})`}
        </h2>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[200px] text-foreground">
            <SelectValue placeholder="Classificar por: Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-foreground" value="default">Padrão</SelectItem>
            <SelectItem className="text-foreground" value="price-asc">Menor preço</SelectItem>
            <SelectItem className="text-foreground" value="price-desc">Maior preço</SelectItem>
            <SelectItem className="text-foreground" value="name-asc">Nome (A-Z)</SelectItem>
            <SelectItem className="text-foreground" value="name-desc">Nome (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
