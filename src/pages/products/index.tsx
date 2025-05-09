import React from "react";
import { useRouter } from "next/router";
import ProductGrid from "@components/ProductGrid";
import { useState } from "react";
import Header from "@components/Header";

const ProductPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { search } = router.query;
  const category = Array.isArray(router.query.category)
    ? router.query.category[0]
    : router.query.category;

  return (
    <>
      <Header onSearchTermChange={setSearchTerm} />
      <ProductGrid
        category={category}
        searchTerm={searchTerm ? searchTerm : search ? search.toString() : ""}
      />
    </>
  );
};

export default ProductPage;
