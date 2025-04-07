import React from "react";
import { ReactNode } from "react";
import { ThemeProvider } from "../contexts/theme-context";
import { GeistSans } from "geist/font/sans";
import { AppStateProvider } from "../contexts/app-state-context";
import { CartProvider } from "@contexts/cart-context";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className={`${GeistSans.className} bg-background min-h-screen`}>
      <AppStateProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>{children}</CartProvider>
        </ThemeProvider>
      </AppStateProvider>
    </div>
  );
}

export default Layout;
