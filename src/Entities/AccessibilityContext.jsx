import { createContext, useContext, useState } from "react";

const AccessibilityContext = createContext();

const getInitialLanguage = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("language_preference");
    if (stored) return stored;
  }
  return "en";
};

export function AccessibilityProvider({ children }) {
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [bold, setBold] = useState(false);
  const [language, setLanguage] = useState(getInitialLanguage());
  const isRTL = language === "ar";

  const updateLanguage = (lang) => {
    setLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language_preference", lang);
    }
  };

  return (
    <AccessibilityContext.Provider value={{
      fontSize,
      lineHeight,
      letterSpacing,
      bold,
      setFontSize,
      setLineHeight,
      setLetterSpacing,
      setBold,
      language,
      setLanguage: updateLanguage,
      isRTL
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
