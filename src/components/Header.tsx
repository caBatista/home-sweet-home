import React, { useState } from "react";
import Link from "next/link";
import icon from "assets/icon.jpeg";
import { ModeToggle } from "./ModeToggle";
import { ProductCategories } from "types";
import { Menu } from "lucide-react";
import { Button } from "./components/ui/button";
import NavBar from "./NavBar";

interface HeaderProps {
  onSearchTermChange: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchTermChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const formatKey = (key: string) => {
    return key.charAt(0) + key.slice(1).toLowerCase();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-background text-[14px] leading-[20px] text-foreground">
      <nav className="p-2 flex justify-between items-center">
        <div className="md:hidden">
          <Button variant="outline" size="icon" onClick={toggleMobileMenu}>
            <Menu className="h-[1.2rem] w-[1.2rem] transition-all"></Menu>
            <span className="sr-only">Open Menu</span>
          </Button>
          <button className="md:hidden" onClick={toggleMobileMenu}></button>
        </div>
        <div className="mx-auto md:mx-0 flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Link href="/" passHref>
              <h1 className="items-center flex font-bold justify-center w-auto">
                <img
                  src={icon.src}
                  alt="Custom Icon"
                  className="inline-block flex-none items-center justify-center border border-neutral-200 h-[40px] w-[40px] rounded-xl mr-2"
                />
                <span className="inline md:hidden lg:inline">
                  PROJETO CASA NOVA
                </span>
              </h1>
            </Link>
          </div>
          <NavBar onSearchTermChange={onSearchTermChange}></NavBar>
        </div>

        <div className="justify-end">
          <ModeToggle />
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="flex flex-col space-y-4 p-4">
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
                onClick={closeMobileMenu}
              >
                {formatKey(key)}
              </Link>
            ))}
            <Link href="/donate" passHref onClick={closeMobileMenu}>
              Doar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
