"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button, IconButton } from "./core";
import { LogoText } from "./brand";

export function SiteHeader() {
  const { t, toggleLang } = useLanguage();
  const { theme, changeTheme } = useContext(ThemeContext);
  const pathname = usePathname() || "/";
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  const links = [
    { href: "/collections", label: t.nav.journeys },
    { href: "/profile", label: t.nav.statistics },
    { href: "/gallery", label: t.nav.gallery },
  ];
  const navLinks = links.map((l) => (
    <Link
      key={l.href}
      href={l.href}
      aria-current={pathname.startsWith(l.href) ? "page" : undefined}
    >
      {l.label}
    </Link>
  ));

  return (
    <header className="avr-header">
      <nav className="avr-header__nav">{navLinks}</nav>
      <IconButton
        className="avr-header__menu"
        glyph={menuOpen ? "✕" : "≡"}
        label={t.menu}
        onClick={() => setMenuOpen((o) => !o)}
        style={{ justifySelf: "start" }}
      />
      <Link href="/" style={{ textDecoration: "none" }}>
        <LogoText />
      </Link>
      <div className="avr-header__actions">
        <Button variant="secondary" size="sm" onClick={toggleLang}>
          {t.langToggle}
        </Button>
        <IconButton
          glyph={theme === "business" ? "☾" : "☀"}
          label={t.toggleTheme}
          onClick={changeTheme}
        />
      </div>
      {menuOpen && <nav className="avr-header__drawer">{navLinks}</nav>}
    </header>
  );
}
