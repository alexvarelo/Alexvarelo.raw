"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type Lang = "en" | "es";

const COPY = {
  en: {
    langToggle: "ES",
    locale: "en-US",
    nav: { journeys: "Journeys", statistics: "Statistics", gallery: "Gallery" },
    toggleTheme: "Toggle theme",
    photos: "PHOTOS",
    tag: "Street, travel & video by a software engineer from Galicia.",
    about: "About me",
    bio1: "I'm a software engineer and one of my biggest passions is to travel. Based in Spain — my hometown, ",
    bio2: ", is one of the best places on earth. My camera comes everywhere, so I can make memories you can see here.",
    stats: {
      views: "Views on Unsplash",
      downloads: "Downloads",
      photos: "Photos published",
    },
    disciplines: ["Street photography", "Videography", "Editing", "Travel"],
    featured: "Featured in",
    popular: "My popular gallery",
    showing: (n: number, total: number) => `Showing ${n} of ${total} photos`,
    loadMore: "Load more photos",
    gallery: {
      eyebrow: (n: number) => `Gallery · ${n} photos`,
      title: "Every photo, by colour",
      empty: "No photos in this colour yet.",
      all: "All",
    },
    loading: "Loading…",
    footer: "All photos my own, via Unsplash.",
    back: "Back to gallery",
    of: "of",
    views: "views",
    downloads: "downloads",
    download: "Download",
    share: "Share",
    copied: "Link copied",
    more: "More photos",
    viewAll: "View all →",
    untitled: "Untitled",
    spec: {
      camera: "Camera",
      aperture: "Aperture",
      shutter: "Shutter",
      focal: "Focal length",
      iso: "ISO",
      published: "Published",
    },
  },
  es: {
    langToggle: "EN",
    locale: "es-ES",
    nav: { journeys: "Viajes", statistics: "Estadísticas", gallery: "Galería" },
    menu: "Menú",
    toggleTheme: "Cambiar tema",
    photos: "FOTOS",
    tag: "Calle, viajes y vídeo por un ingeniero de software gallego.",
    about: "Sobre mí",
    bio1: "Soy ingeniero de software y una de mis mayores pasiones es viajar. Vivo en España — mi tierra, ",
    bio2: ", es uno de los mejores lugares del mundo. Llevo la cámara a todas partes para crear recuerdos que puedes ver aquí.",
    stats: {
      views: "Visitas en Unsplash",
      downloads: "Descargas",
      photos: "Fotos publicadas",
    },
    disciplines: ["Fotografía callejera", "Videografía", "Edición", "Viajes"],
    featured: "Publicado en",
    popular: "Mi galería popular",
    showing: (n: number, total: number) => `Mostrando ${n} de ${total} fotos`,
    loadMore: "Cargar más fotos",
    gallery: {
      eyebrow: (n: number) => `Galería · ${n} fotos`,
      title: "Cada foto, por color",
      empty: "Aún no hay fotos de este color.",
      all: "Todo",
    },
    loading: "Cargando…",
    footer: "Todas las fotos son mías, vía Unsplash.",
    back: "Volver a la galería",
    of: "de",
    views: "visitas",
    downloads: "descargas",
    download: "Descargar",
    share: "Compartir",
    copied: "Enlace copiado",
    more: "Más fotos",
    viewAll: "Ver todo →",
    untitled: "Sin título",
    spec: {
      camera: "Cámara",
      aperture: "Apertura",
      shutter: "Obturación",
      focal: "Distancia focal",
      iso: "ISO",
      published: "Publicada",
    },
  },
};

export type Copy = (typeof COPY)["en"];

interface LanguageContextType {
  lang: Lang;
  t: Copy;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "avr-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "es") setLang(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
  }, [lang]);

  const toggleLang = () => setLang((l) => (l === "en" ? "es" : "en"));

  return (
    <LanguageContext.Provider value={{ lang, t: COPY[lang], toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

/** 4,212,345 → "4.2M" (UI numbers are abbreviated per the design system). */
export function formatCompact(value: number | undefined, locale = "en-US") {
  if (value === undefined) return "—";
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
