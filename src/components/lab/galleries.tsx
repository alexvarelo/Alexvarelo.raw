"use client";

/*
 * Gallery page explorations for /lab/gallery. Each variant receives the latest photos.
 */

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Photo } from "@/apis/generated/model";
import { useLanguage } from "@/contexts/LanguageContext";
import { ColorCategory, getColorCategory } from "@/app/utils/colorUtils";
import { cn } from "@/lib/utils";

const EASE = [0.2, 0.8, 0.2, 1] as const;
type Props = { photos: Photo[] };

const title = (p: Photo, fallback: string) => {
  const s = p.description || p.alt_description || fallback;
  return s.charAt(0).toUpperCase() + s.slice(1);
};
const ratio = (p: Photo) => (p.width && p.height ? p.width / p.height : 1);

/** Hue (0–360), saturation and value of a "#rrggbb" colour. */
function hsv(hex = "#808080") {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d + 6) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
  }
  return { h: h * 60, s: max ? d / max : 0, v: max };
}

function useDateFormat() {
  const { t } = useLanguage();
  return (
    iso?: string,
    opts: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ) => (iso ? new Date(iso).toLocaleDateString(t.locale, opts) : "");
}

function PhotoLink({
  photo,
  className,
  children,
  style,
}: {
  photo: Photo;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <Link href={`/image/${photo.id}`} className={className} style={style}>
      {children}
    </Link>
  );
}

function Img({
  photo,
  size = "small",
}: {
  photo: Photo;
  size?: "small" | "regular" | "thumb";
}) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={photo.urls?.[size]}
      alt={photo.alt_description ?? ""}
      loading="lazy"
      width={photo.width}
      height={photo.height}
    />
  );
}

/* ------------------------------------------------------------------ */
/* 1 — Spectrum: real colour swatches as filters, animated masonry.    */
/* ------------------------------------------------------------------ */
const CATEGORIES: ColorCategory[] = [
  "All",
  "Black",
  "White",
  "Grey",
  "Red",
  "Orange",
  "Yellow",
  "Green",
  "Blue",
  "Purple",
];

export function GallerySpectrum({ photos }: Props) {
  const { lang, t } = useLanguage();
  const fmt = useDateFormat();
  const [active, setActive] = useState<ColorCategory>("All");

  // One swatch per colour that actually appears, painted with a real photo colour from that group
  const swatches = useMemo(() => {
    const groups = new Map<ColorCategory, Photo[]>();
    photos.forEach((p) => {
      const c = getColorCategory(p.color || "");
      groups.set(c, [...(groups.get(c) ?? []), p]);
    });
    return CATEGORIES.filter((c) => c === "All" || groups.has(c)).map((c) => ({
      id: c,
      count: c === "All" ? photos.length : groups.get(c)!.length,
      color:
        c === "All"
          ? undefined
          : groups.get(c)![Math.floor(groups.get(c)!.length / 2)].color,
    }));
  }, [photos]);

  const visible =
    active === "All"
      ? photos
      : photos.filter((p) => getColorCategory(p.color || "") === active);

  return (
    <div className="avr-section">
      <header className="lg-head">
        <span className="avr-overline">
          {lang === "es"
            ? `Galería · ${photos.length} últimas`
            : `Gallery · latest ${photos.length}`}
        </span>
        <h1 className="lg-h1">
          {lang === "es" ? "Cada foto, por color" : "Every photo, by colour"}
        </h1>
      </header>
      <div className="lg-swatches" role="toolbar">
        {swatches.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(s.id)}
            className={cn("lg-swatch", active === s.id && "is-active")}
          >
            <span
              className={cn(
                "lg-swatch__dot",
                !s.color && "lg-swatch__dot--all",
              )}
              style={s.color ? { background: s.color } : undefined}
            />
            <span>{s.id}</span>
            <span className="lg-swatch__count">{s.count}</span>
          </button>
        ))}
      </div>
      <motion.div key={active} className="avr-masonry lg-spectrum">
        {visible.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.5,
              ease: EASE,
              delay: Math.min(i, 16) * 0.035,
            }}
          >
            <PhotoLink
              photo={p}
              className="avr-masonry__item lg-card"
              style={{
                background: p.color,
                aspectRatio: `${p.width} / ${p.height}`,
              }}
            >
              <Img photo={p} />
              <span className="lg-card__caption">
                <span>{title(p, t.untitled)}</span>
                <span className="avr-mono">{fmt(p.created_at)}</span>
              </span>
            </PhotoLink>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2 — Colour wall: every photo sorted by hue into one gradient grid.  */
/* ------------------------------------------------------------------ */
export function GalleryWall({ photos }: Props) {
  const { lang } = useLanguage();
  const sorted = useMemo(() => {
    const withHsv = photos.map((p) => ({ p, ...hsv(p.color) }));
    const greys = withHsv.filter((x) => x.s < 0.15).sort((a, b) => b.v - a.v);
    const colours = withHsv
      .filter((x) => x.s >= 0.15)
      .sort((a, b) => a.h - b.h || b.v - a.v);
    return [...colours, ...greys].map((x) => x.p);
  }, [photos]);

  return (
    <div className="avr-section">
      <header className="lg-head">
        <span className="avr-overline">
          {lang === "es" ? "Muro de color" : "Colour wall"}
        </span>
        <h1 className="lg-h1">
          {lang === "es" ? "Ordenadas por tono" : "Sorted by hue"}
        </h1>
      </header>
      <motion.div
        className="lg-palette"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: EASE }}
        aria-hidden="true"
      >
        {sorted.map((p) => (
          <span key={p.id} style={{ background: p.color }} />
        ))}
      </motion.div>
      <div className="lg-wall">
        {sorted.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: EASE, delay: 0.3 + i * 0.02 }}
          >
            <PhotoLink
              photo={p}
              className="lg-wall__tile"
              style={{ background: p.color }}
            >
              <Img photo={p} />
            </PhotoLink>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3 — Timeline: justified rows grouped by month, sticky month labels. */
/* ------------------------------------------------------------------ */
export function GalleryTimeline({ photos }: Props) {
  const { lang } = useLanguage();
  const fmt = useDateFormat();
  const groups = useMemo(() => {
    const map = new Map<string, Photo[]>();
    photos.forEach((p) => {
      const key = (p.created_at ?? "").slice(0, 7);
      map.set(key, [...(map.get(key) ?? []), p]);
    });
    return Array.from(map.entries());
  }, [photos]);

  return (
    <div className="avr-section">
      <header className="lg-head">
        <span className="avr-overline">
          {lang === "es" ? "Cronología" : "Timeline"}
        </span>
        <h1 className="lg-h1">
          {lang === "es" ? "Mes a mes" : "Month by month"}
        </h1>
      </header>
      {groups.map(([month, items], gi) => (
        <section key={month} className="lg-month">
          <div className="lg-month__label">
            <span className="lg-month__name">
              {fmt(month + "-15", { month: "long" })}
            </span>
            <span className="avr-mono">
              {month.slice(0, 4)} · {items.length}{" "}
              {lang === "es" ? "fotos" : "photos"}
            </span>
          </div>
          <div className="lg-justified">
            {items.map((p, i) => (
              <motion.div
                key={p.id}
                className="lg-justified__item"
                style={{
                  flexGrow: ratio(p),
                  flexBasis: `calc(var(--row-h) * ${ratio(p)})`,
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  ease: EASE,
                  delay: (gi === 0 ? 0.2 : 0) + i * 0.05,
                }}
              >
                <PhotoLink
                  photo={p}
                  className="lg-justified__link"
                  style={{
                    background: p.color,
                    aspectRatio: `${p.width} / ${p.height}`,
                  }}
                >
                  <Img photo={p} />
                </PhotoLink>
              </motion.div>
            ))}
            <span className="lg-justified__filler" />
          </div>
        </section>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4 — Film strip: one horizontal, snapping row of large photos.       */
/* ------------------------------------------------------------------ */
export function GalleryStrip({ photos }: Props) {
  const { lang, t } = useLanguage();
  const fmt = useDateFormat();
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Vertical wheel scrolls the strip sideways until it reaches either end
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd =
        el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    const onScroll = () =>
      setProgress(el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth));
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div>
      <header className="lg-head avr-section lg-strip__head">
        <div>
          <span className="avr-overline">
            {lang === "es" ? "Tira de película" : "Film strip"}
          </span>
          <h1 className="lg-h1">
            {lang === "es" ? "Desliza" : "Scroll sideways"} →
          </h1>
        </div>
        <div className="lg-strip__progress">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
      </header>
      <div ref={ref} className="lg-strip">
        {photos.map((p, i) => (
          <motion.figure
            key={p.id}
            className="lg-strip__frame"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.7,
              ease: EASE,
              delay: Math.min(i, 6) * 0.08,
            }}
          >
            <PhotoLink
              photo={p}
              className="lg-strip__photo"
              style={{
                background: p.color,
                aspectRatio: `${p.width} / ${p.height}`,
              }}
            >
              <Img photo={p} size="regular" />
            </PhotoLink>
            <figcaption>
              <span className="avr-mono">
                {String(i + 1).padStart(2, "0")} / {photos.length}
              </span>
              <span className="lg-strip__title">{title(p, t.untitled)}</span>
              <span className="avr-mono lg-muted">{fmt(p.created_at)}</span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5 — Spotlight: one big photo on its own ambient colour, auto-plays. */
/* ------------------------------------------------------------------ */
export function GallerySpotlight({ photos }: Props) {
  const { lang, t } = useLanguage();
  const fmt = useDateFormat();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const thumbs = useRef<HTMLDivElement>(null);
  const current = photos[index];

  useEffect(() => {
    if (paused || photos.length < 2) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % photos.length), 5000);
    return () => clearTimeout(id);
  }, [index, paused, photos.length]);

  // Keep the active thumbnail centred (scrolls only the strip, never the page)
  useEffect(() => {
    const strip = thumbs.current;
    const thumb = strip?.children[index] as HTMLElement | undefined;
    if (strip && thumb) {
      strip.scrollTo({
        left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2,
        behavior: "smooth",
      });
    }
  }, [index]);

  if (!current) return null;
  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <section
        className="lg-spot"
        style={{ "--ambient": current.color } as React.CSSProperties}
      >
        <div className="lg-spot__stage avr-section">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={current.id}
              className="lg-spot__photo"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <PhotoLink photo={current} className="lg-spot__link">
                <Img photo={current} size="regular" />
              </PhotoLink>
            </motion.div>
          </AnimatePresence>
          <div className="lg-spot__info">
            <span className="avr-overline">
              {lang === "es" ? "Foco" : "Spotlight"} ·{" "}
              {String(index + 1).padStart(2, "0")}/{photos.length}
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <h1 className="lg-spot__title">{title(current, t.untitled)}</h1>
                <span className="avr-mono lg-muted">
                  {fmt(current.created_at)}
                </span>
              </motion.div>
            </AnimatePresence>
            <div className="lg-spot__timer">
              <span
                key={`${current.id}-${paused}`}
                className={cn(!paused && "is-running")}
              />
            </div>
          </div>
        </div>
      </section>
      <div ref={thumbs} className="lg-spot__thumbs avr-section">
        {photos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setIndex(i)}
            className={cn("lg-spot__thumb", i === index && "is-active")}
            style={{ background: p.color }}
          >
            <Img photo={p} size="thumb" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 6 — Contact sheet: negatives on a dark strip, colour on hover.      */
/* ------------------------------------------------------------------ */
export function GalleryContact({ photos }: Props) {
  const { lang } = useLanguage();
  const fmt = useDateFormat();
  const perStrip = 6;
  const strips = useMemo(() => {
    const out: Photo[][] = [];
    for (let i = 0; i < photos.length; i += perStrip)
      out.push(photos.slice(i, i + perStrip));
    return out;
  }, [photos]);

  return (
    <div className="avr-section">
      <header className="lg-head">
        <span className="avr-overline">
          {lang === "es" ? "Hoja de contactos" : "Contact sheet"}
        </span>
        <h1 className="lg-h1">{lang === "es" ? "Rollo .RAW" : "Roll .RAW"}</h1>
      </header>
      <div className="lg-contact">
        {strips.map((strip, si) => (
          <motion.div
            key={si}
            className="lg-contact__strip"
            initial={{ opacity: 0, x: si % 2 ? 60 : -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {strip.map((p, i) => {
              const n = si * perStrip + i + 1;
              return (
                <PhotoLink key={p.id} photo={p} className="lg-contact__frame">
                  <span
                    className="lg-contact__img"
                    style={{ background: p.color }}
                  >
                    <Img photo={p} />
                  </span>
                  <span className="lg-contact__num">
                    ▸{n}
                    <span>
                      {fmt(p.created_at, { month: "2-digit", year: "2-digit" })}
                    </span>
                  </span>
                </PhotoLink>
              );
            })}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export const GALLERIES = [
  {
    id: "spectrum",
    name: "Spectrum (colour filter)",
    Component: GallerySpectrum,
  },
  { id: "wall", name: "Colour wall", Component: GalleryWall },
  { id: "timeline", name: "Timeline", Component: GalleryTimeline },
  { id: "strip", name: "Film strip", Component: GalleryStrip },
  { id: "spotlight", name: "Spotlight", Component: GallerySpotlight },
  { id: "contact", name: "Contact sheet", Component: GalleryContact },
] as const;
