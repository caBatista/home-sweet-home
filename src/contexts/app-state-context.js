import React, { createContext, useState } from "react";

export const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    theme: "light",
  });

  const updateUser = (user) => {
    setState((prevState) => ({ ...prevState, user }));
  };

  const updateTheme = (theme) => {
    setState((prevState) => ({ ...prevState, theme }));
  };

  return (
    <AppStateContext.Provider value={{ state, updateUser, updateTheme }}>
      {children}
    </AppStateContext.Provider>
  );
};
