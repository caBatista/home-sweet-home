import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "./components/ui/input";
import { ProductCategories } from "types";

interface NavBarProps {
  onSearchTermChange: (term: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ onSearchTermChange }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const formatKey = (key: string) => {
    return key.charAt(0) + key.slice(1).toLowerCase();
  };

  useEffect(() => {
    onSearchTermChange(searchTerm);
  }, [searchTerm]);

  return (
    <div>
      <div className="space-x-4 hidden md:flex items-center">
        {Object.keys(ProductCategories).map((key) => (
          <Link
            key={key}
            href={`/products${
              key === "TODOS"
                ? ""
                : `?category=${
                    ProductCategories[key as keyof typeof ProductCategories]
                  }`
            }`}
            passHref
          >
            <span className="hover:underline">{formatKey(key)}</span>
          </Link>
        ))}
        <Link href="/donate" passHref>
          <span className="hover:underline">Doar</span>
        </Link>
        <div className="ml-20">
          <Input
            placeholder="Procurar produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
