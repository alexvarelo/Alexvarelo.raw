"use client";

import { useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

/*
 * Inline SVG on purpose: the ☀/☾ characters are rendered as colour emoji on iOS,
 * so they would look different from platform to platform.
 */
const svg = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function Sun({ size }: { size: number }) {
  return (
    <svg {...svg} width={size} height={size}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function Moon({ size }: { size: number }) {
  return (
    <svg {...svg} width={size} height={size}>
      <path d="M20.5 14.1A8.5 8.5 0 1 1 9.9 3.5a6.6 6.6 0 0 0 10.6 10.6z" />
    </svg>
  );
}

/** Light/dark switch: both icons stay visible, a thumb slides to the active one. */
export function ThemeToggle() {
  const { theme, changeTheme } = useContext(ThemeContext);
  const { t } = useLanguage();
  const dark = theme === "business";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={t.toggleTheme}
      onClick={changeTheme}
      className="avr-theme-switch"
    >
      <span className="avr-theme-switch__icon avr-theme-switch__icon--l">
        <Sun size={13} />
      </span>
      <span className="avr-theme-switch__icon avr-theme-switch__icon--r">
        <Moon size={13} />
      </span>
      <motion.span
        className="avr-theme-switch__thumb"
        initial={false}
        animate={{ x: dark ? "var(--thumb-travel)" : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      >
        <motion.span
          className="avr-theme-switch__glyph"
          initial={false}
          animate={{ opacity: dark ? 0 : 1, scale: dark ? 0.4 : 1 }}
          transition={{ duration: 0.25 }}
        >
          <Sun size={14} />
        </motion.span>
        <motion.span
          className="avr-theme-switch__glyph"
          initial={false}
          animate={{ opacity: dark ? 1 : 0, scale: dark ? 1 : 0.4 }}
          transition={{ duration: 0.25 }}
        >
          <Moon size={14} />
        </motion.span>
      </motion.span>
    </button>
  );
}
