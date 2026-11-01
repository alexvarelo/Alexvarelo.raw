"use client";

/*
 * Navbar explorations for /lab. Each variant is self-contained so the chosen one
 * can be promoted to components/ds/SiteHeader.tsx and the rest deleted.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { APP_CONFIG } from "@/constants/app";
import { cn } from "@/lib/utils";

function useNav() {
  const { t, toggleLang } = useLanguage();
  const { theme, changeTheme } = useContext(ThemeContext);
  const pathname = usePathname() || "/";
  const links = [
    { href: "/collections", label: t.nav.journeys },
    { href: "/profile", label: t.nav.statistics },
    { href: "/gallery", label: t.nav.gallery },
  ];
  const isActive = (href: string) => pathname.startsWith(href);
  return { t, toggleLang, theme, changeTheme, links, isActive };
}

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

/** Hides on scroll down, reappears on scroll up. */
function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 120 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return hidden;
}

function Memoji({ size = 40 }: { size?: number }) {
  return (
    <Link
      href="/"
      className="lab-memoji"
      aria-label={APP_CONFIG.title}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={APP_CONFIG.memoji} alt="" width={size} height={size} />
    </Link>
  );
}

function Controls({ compact }: { compact?: boolean }) {
  const { t, toggleLang, theme, changeTheme } = useNav();
  return (
    <div className={cn("lab-controls", compact && "lab-controls--compact")}>
      <button type="button" onClick={toggleLang} className="lab-chip">
        {t.langToggle}
      </button>
      <button
        type="button"
        onClick={changeTheme}
        className="lab-chip lab-chip--round"
        aria-label={t.toggleTheme}
      >
        {theme === "business" ? "☾" : "☀"}
      </button>
    </div>
  );
}

/* 1 — Floating pill: everything in one centred capsule that tightens on scroll. */
export function NavPill() {
  const { links, isActive } = useNav();
  const scrolled = useScrolled();
  return (
    <>
      <header className={cn("lab-pill", scrolled && "is-scrolled")}>
        <Memoji size={30} />
        <nav className="lab-pill__links">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(isActive(l.href) && "is-active")}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <span className="lab-pill__divider" />
        <Controls compact />
      </header>
      <div style={{ height: 88 }} />
    </>
  );
}

/* 2 — Segmented: memoji left, links as a segmented control with a sliding indicator. */
export function NavSegmented() {
  const { links, isActive } = useNav();
  const [hover, setHover] = useState<string | null>(null);
  const current = hover ?? links.find((l) => isActive(l.href))?.href ?? null;
  return (
    <header className="lab-seg">
      <Memoji />
      <nav className="lab-seg__track" onMouseLeave={() => setHover(null)}>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onMouseEnter={() => setHover(l.href)}
            className={cn(isActive(l.href) && "is-active")}
          >
            {current === l.href && (
              <motion.span
                layoutId="lab-seg-indicator"
                className="lab-seg__indicator"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <span style={{ position: "relative" }}>{l.label}</span>
          </Link>
        ))}
      </nav>
      <Controls compact />
    </header>
  );
}

/* 3 — Editorial: memoji + name on the left, links right; slides away while scrolling down. */
export function NavEditorial() {
  const { links, isActive } = useNav();
  const hidden = useHideOnScroll();
  const scrolled = useScrolled();
  return (
    <>
      <motion.header
        className={cn("lab-edit", scrolled && "is-scrolled")}
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="lab-edit__brand">
          <Memoji size={36} />
          <span className="lab-edit__name">
            Alexvarelo<span>.raw</span>
          </span>
        </div>
        <nav className="lab-edit__links">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(isActive(l.href) && "is-active")}
            >
              <sup>0{i + 1}</sup>
              {l.label}
            </Link>
          ))}
        </nav>
        <Controls compact />
      </motion.header>
      <div className="lab-edit__spacer" />
    </>
  );
}

/* 4 — Dock: minimal top bar; on mobile the links move to a floating dock at the bottom. */
export function NavDock() {
  const { links, isActive } = useNav();
  const pathname = usePathname() || "/";
  const scrolled = useScrolled(200);
  return (
    <>
      <header className="lab-dock-top">
        <Memoji />
        <nav className="lab-dock-top__links">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(isActive(l.href) && "is-active")}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Controls compact />
      </header>
      <motion.nav
        className="lab-dock"
        initial={false}
        animate={{ scale: scrolled ? 0.96 : 1 }}
        aria-label="Main"
      >
        <Link href="/" className={cn(pathname === "/" && "is-active")}>
          <span aria-hidden="true">◎</span>
          Home
        </Link>
        {links.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(isActive(l.href) && "is-active")}
          >
            <span aria-hidden="true">{["↗", "≡", "▦"][i]}</span>
            {l.label}
          </Link>
        ))}
      </motion.nav>
    </>
  );
}

/* 5 — Split: links left and controls right, memoji centred and slightly overlapping the hero. */
export function NavSplit() {
  const { links, isActive } = useNav();
  return (
    <header className="lab-split">
      <nav className="lab-split__links">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(isActive(l.href) && "is-active")}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <motion.div
        className="lab-split__memoji"
        initial={{ y: -20, opacity: 0, rotate: -10 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.2 }}
      >
        <Memoji size={56} />
      </motion.div>
      <Controls compact />
    </header>
  );
}

export const NAVBARS = [
  { id: "pill", name: "Floating pill", Component: NavPill },
  { id: "segmented", name: "Segmented", Component: NavSegmented },
  { id: "editorial", name: "Editorial (auto-hide)", Component: NavEditorial },
  { id: "dock", name: "Dock (mobile)", Component: NavDock },
  { id: "split", name: "Split + big memoji", Component: NavSplit },
] as const;
