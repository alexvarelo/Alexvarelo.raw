"use client";

import { useLanguage } from "@/contexts/LanguageContext";

const LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/alexvarelo.raw" },
  { label: "Unsplash", href: "https://unsplash.com/@alexvarelo" },
];

export function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="avr-footer">
      <span>
        © {new Date().getFullYear()} Alexvarelo · {t.footer}
      </span>
      <div style={{ display: "flex", gap: 22 }}>
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {l.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
