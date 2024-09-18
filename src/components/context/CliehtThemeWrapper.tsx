"use client";
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

export default function ClientThemeWrapper({ children }: any) {
  const { theme } = useContext(ThemeContext);
  console.log("this is the theme", theme);
  return <div data-theme={theme}>{children}</div>;
}