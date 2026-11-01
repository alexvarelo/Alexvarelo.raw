"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { APP_CONFIG } from "@/constants/app";
import { cn } from "@/lib/utils";
import { Button, IconButton } from "./core";

/** Floating pill header: memoji, links and controls in one capsule that tightens on scroll. */
export function SiteHeader() {
  const { t, toggleLang } = useLanguage();
  const { theme, changeTheme } = useContext(ThemeContext);
  const pathname = usePathname() || "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // /lab (navbar + hero lab) renders its own navbar variants; /lab/gallery keeps the real one
  if (pathname === "/lab") return null;

  const links = [
    { href: "/collections", label: t.nav.journeys },
    { href: "/profile", label: t.nav.statistics },
    { href: "/gallery", label: t.nav.gallery },
  ];

  return (
    <>
      <header className={cn("avr-header", scrolled && "is-scrolled")}>
        <Link
          href="/"
          className="avr-header__brand"
          aria-label={APP_CONFIG.title}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={APP_CONFIG.memoji} alt="" width={30} height={30} />
        </Link>
        <nav className="avr-header__nav">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname.startsWith(l.href) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <span className="avr-header__divider" />
        <div className="avr-header__actions">
          <Button variant="secondary" size="sm" onClick={toggleLang}>
            {t.langToggle}
          </Button>
          <IconButton
            glyph={theme === "business" ? "☾" : "☀"}
            label={t.toggleTheme}
            onClick={changeTheme}
            size={32}
          />
        </div>
      </header>
      <div className="avr-header-spacer" />
    </>
  );
}
