import { createContext, useContext, useState } from "react";

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [bold, setBold] = useState(false);

  return (
    <AccessibilityContext.Provider value={{
      fontSize,
      lineHeight,
      letterSpacing,
      bold,
      setFontSize,
      setLineHeight,
      setLetterSpacing,
      setBold
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
