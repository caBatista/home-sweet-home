import { useRouter } from "next/router";
import Layout from "@components/Layout";
import ProductGrid from "@components/ProductGrid";
import { useState } from "react";
import Header from "@components/Header";

const ProductPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const category = Array.isArray(router.query.category)
    ? router.query.category[0]
    : router.query.category;

  return (
    <Layout>
      <Header onSearchTermChange={setSearchTerm} />
      <ProductGrid category={category} searchTerm={searchTerm} />
    </Layout>
  );
};

export default ProductPage;
