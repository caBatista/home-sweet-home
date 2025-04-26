import Footer from "@components/Footer";
import React from "react";
import { ReactNode } from "react";
import { ThemeProvider } from "../contexts/theme-context";
import { GeistSans } from "geist/font/sans";
import { AppStateProvider } from "../contexts/app-state-context";
import { CartProvider } from "@contexts/cart-context";
import { Toaster } from "sonner";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <AppStateProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <Toaster position="top-center" />
            <main className="flex-grow">{children}</main>
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </AppStateProvider>
    </div>
  );
};

export default Layout;
