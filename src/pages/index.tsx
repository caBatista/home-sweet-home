import React, { useState } from "react";
import ProductGrid from "@components/ProductGrid";
import Layout from "pages/layout";
import Header from "@components/Header";
const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <Layout>
      <Header onSearchTermChange={setSearchTerm} />
      <ProductGrid searchTerm={searchTerm} />
    </Layout>
  );
};

export default Home;
