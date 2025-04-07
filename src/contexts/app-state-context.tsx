import React, { createContext, useContext, useState } from "react";

interface User {
  id: string;
  name: string;
}

interface AppState {
  user: User | null;
  theme: string;
}

interface AppStateContextType {
  state: AppState;
  updateUser: (user: User | null) => void;
  updateTheme: (theme: string) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({ user: null, theme: "light" });

  const updateUser = (user: User | null) => {
    setState((prevState) => ({ ...prevState, user }));
  };

  const updateTheme = (theme: string) => {
    setState((prevState) => ({ ...prevState, theme }));
  };

  return (
    <AppStateContext.Provider value={{ state, updateUser, updateTheme }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = (): AppStateContextType => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
