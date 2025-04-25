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
          data.map((p: { imageUrl: string; }) =>
            new Promise<void>((resolve) => {
              const img = new Image()
              img.src = p.imageUrl
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

  return (
    <div className="ml-10 mr-10 mt-10 mb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
