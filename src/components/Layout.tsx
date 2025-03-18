import { ReactNode } from "react";
import { ThemeProvider } from "../contexts/theme-context";
import { GeistSans } from "geist/font/sans";
import { AppStateProvider } from "../contexts/app-state-context";
import Header from "./Header";

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
          {children}
        </ThemeProvider>
      </AppStateProvider>
    </div>
  );
}

export default Layout;
