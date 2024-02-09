import React, { useState, createContext } from "react";

export const FooterContext = createContext();

export const FooterContextProvider = ({ children }) => {
  const [isFooter, setIsFooter] = useState(true);

  return (
    <FooterContext.Provider value={{ isFooter, setIsFooter }}>
      {children}
    </FooterContext.Provider>
  );
};
