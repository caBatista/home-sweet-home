import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import icon from "assets/icon.jpeg";
import { ModeToggle } from "./ModeToggle";
import { ProductCategories } from "types";
import { Menu, ShoppingCart } from "lucide-react";
import { Button } from "./components/ui/button";
import NavBar from "./NavBar";
import Cart from "./Cart";
import { useCart } from "../contexts/cart-context";
import { Sheet, SheetContent, SheetClose, SheetHeader, SheetTitle } from "./components/ui/sheet";

interface HeaderProps {
  onSearchTermChange: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchTermChange }) => {
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [animateBadge, setAnimateBadge] = useState(false);
  const prevCountRef = useRef(cart.length);

  useEffect(() => {
    if (cart.length > prevCountRef.current) {
      setAnimateBadge(true);
      setTimeout(() => setAnimateBadge(false), 300);
    }
    prevCountRef.current = cart.length;
  }, [cart.length]);
  

  const formatKey = (key: string) => {
    return key.charAt(0) + key.slice(1).toLowerCase();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
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

        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Button variant="outline" size="icon" onClick={toggleCart} className="relative">
            <span className="sr-only">View Cart</span>
            <ShoppingCart />
            {cart.length > 0 && (
              <span className={`absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full ${animateBadge ? 'animate-ping' : ''}`}>
                {cart.length}
              </span>
            )}
          </Button>
        </div>
      </nav>

      <Sheet open={isMobileMenuOpen} onOpenChange={toggleMobileMenu}>
        <SheetContent
          side="left"
          className="md:hidden"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <SheetHeader className="mb-6">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col text-foreground space-y-4 p-4">
            {Object.keys(ProductCategories).map((key) => (
              <SheetClose asChild key={key}>
                <Link
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
              </SheetClose>
            ))}
            <SheetClose asChild>
              <Link href="/donate" passHref onClick={closeMobileMenu}>
                Doar
              </Link>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>

      <Cart open={isCartOpen} onClose={toggleCart} />
    </header>
  );
};

export default Header;
