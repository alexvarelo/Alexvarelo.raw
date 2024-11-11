"use client";
import { createContext, useEffect, useState } from "react";

interface ThemeContextType {
  theme?: string;
  changeTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  changeTheme: function (): void {
    throw new Error("Function not implemented.");
  },
});

export const ThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = useState<"light" | "business">("light");

  useEffect(() => {
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const changeTheme = () => {
    setTheme((prev) => (prev === "light" ? "business" : "light"));
  };
  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
