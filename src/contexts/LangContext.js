import React, { useState, createContext } from "react";

export const LangContext = createContext();

export const LangContextProvider = ({ children }) => {
  const [lang, setLang] = useState("En");

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
};
