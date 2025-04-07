"use client";

import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export const ThemeProvider: React.FC<React.ComponentProps<typeof NextThemesProvider>> = ({
  children,
  ...props
}) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};
