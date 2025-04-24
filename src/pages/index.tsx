import React, { useState } from "react";
import ProductGrid from "@components/ProductGrid";
import Header from "@components/Header";
const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <>
      <Header onSearchTermChange={setSearchTerm} />
      <ProductGrid searchTerm={searchTerm} />
    </>
  );
};

export default Home;
