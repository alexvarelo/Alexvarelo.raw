"use client";

/*
 * Hero explorations for /lab. Each one takes the popular photos so it can use real imagery.
 */

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Photo } from "@/apis/generated/model";
import { useLanguage } from "@/contexts/LanguageContext";
import { APP_CONFIG } from "@/constants/app";
import { TextRing, Wordmark } from "@/components/ds/brand";
import { PhotoFrame } from "@/components/ds/content";

const EASE = [0.2, 0.8, 0.2, 1] as const;
const WORDMARK = "ALEXVARELO.RAW";

type HeroProps = { photos: Photo[] };

const src = (p?: Photo, size: "small" | "regular" = "small") => p?.urls?.[size];

/* 0 — Current: wordmark + rotating text ring (baseline for comparison). */
export function HeroCurrent() {
  const { t } = useLanguage();
  return (
    <section className="lab-oldhero avr-section">
      <div className="lab-oldhero__copy">
        <Wordmark className="lab-oldhero__wordmark" photosLabel={t.photos} />
        <p className="lab-oldhero__tag">{t.tag}</p>
      </div>
      <TextRing className="lab-oldhero__ring">
        <PhotoFrame
          src={APP_CONFIG.avatar}
          tint="neutral"
          style={{ height: "100%", borderRadius: 0 }}
        />
      </TextRing>
    </section>
  );
}

/* 1 — Letter reveal: letters rise out of a mask one by one, gradient shimmers, memoji pops in. */
export function HeroReveal() {
  const { t } = useLanguage();
  return (
    <section className="lab-reveal avr-section">
      <h1 className="lab-reveal__title" aria-label={`${WORDMARK} ${t.photos}`}>
        <span className="lab-reveal__line lab-shimmer" aria-hidden="true">
          {WORDMARK.split("").map((ch, i) => (
            <span key={i} className="lab-reveal__mask">
              <motion.span
                style={{ display: "inline-block" }}
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 0.7,
                  ease: EASE,
                  delay: 0.1 + i * 0.04,
                }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
        </span>
        <span className="lab-reveal__line lab-reveal__solid" aria-hidden="true">
          <span className="lab-reveal__mask">
            <motion.span
              style={{ display: "inline-block" }}
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.75 }}
            >
              {t.photos}
            </motion.span>
          </span>
          <motion.img
            src={APP_CONFIG.memoji}
            alt=""
            className="lab-reveal__memoji"
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: 1, rotate: [0, 14, -8, 0] }}
            transition={{
              scale: {
                type: "spring",
                stiffness: 300,
                damping: 12,
                delay: 1.1,
              },
              rotate: { duration: 1.2, delay: 1.3 },
            }}
          />
        </span>
      </h1>
      <motion.p
        className="lab-oldhero__tag"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        {t.tag}
      </motion.p>
    </section>
  );
}

/* 2 — Marquee: big wordmark over two rows of real photos sliding in opposite directions. */
export function HeroMarquee({ photos }: HeroProps) {
  const { t } = useLanguage();
  const rowA = photos.slice(0, 6);
  const rowB = photos.slice(6, 12);
  const Row = ({ items, reverse }: { items: Photo[]; reverse?: boolean }) => (
    <div className="lab-marquee__row">
      <div
        className={
          reverse ? "lab-marquee__track is-reverse" : "lab-marquee__track"
        }
      >
        {[...items, ...items].map((p, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src(p)}
            alt=""
            style={{
              background: p.color,
              aspectRatio: `${p.width} / ${p.height}`,
            }}
          />
        ))}
      </div>
    </div>
  );
  return (
    <section className="lab-marquee">
      <div className="avr-section lab-marquee__head">
        <Wordmark className="lab-marquee__wordmark" photosLabel={t.photos} />
        <div className="lab-marquee__side">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={APP_CONFIG.memoji}
            alt=""
            className="lab-wave"
            width={72}
            height={72}
          />
          <p className="lab-oldhero__tag" style={{ margin: 0 }}>
            {t.tag}
          </p>
        </div>
      </div>
      {rowA.length > 0 && <Row items={rowA} />}
      {rowB.length > 0 && <Row items={rowB} reverse />}
    </section>
  );
}

/* 3 — Card stack: popular photos stacked like prints; the top one flies to the back every few seconds. */
export function HeroStack({ photos }: HeroProps) {
  const { t } = useLanguage();
  const pool = photos.slice(0, 6);
  const [order, setOrder] = useState<number[]>([]);
  useEffect(() => setOrder(pool.map((_, i) => i)), [pool.length]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (order.length < 2) return;
    const id = setInterval(() => setOrder((o) => [...o.slice(1), o[0]]), 2800);
    return () => clearInterval(id);
  }, [order.length]);
  const rotations = [-2, 5, -7, 9, -4, 3];
  return (
    <section className="lab-oldhero avr-section lab-stack">
      <div className="lab-oldhero__copy">
        <Wordmark className="lab-oldhero__wordmark" photosLabel={t.photos} />
        <p className="lab-oldhero__tag">{t.tag}</p>
      </div>
      <div className="lab-stack__deck">
        {pool.map((p, idx) => {
          const pos = order.indexOf(idx); // 0 = top of the deck
          if (pos < 0) return null;
          const wasTop = pos === order.length - 1; // just moved from the top to the back
          return (
            <motion.div
              key={p.id}
              className="lab-stack__card"
              style={{ background: p.color, zIndex: 10 - pos }}
              initial={false}
              animate={{
                rotate: rotations[idx % rotations.length],
                y: Math.min(pos, 3) * 10,
                scale: 1 - Math.min(pos, 3) * 0.04,
                opacity: pos < 4 || wasTop ? 1 : 0,
                x: wasTop ? [0, 260, 0] : 0,
              }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src(p, "regular")} alt={p.alt_description ?? ""} />
            </motion.div>
          );
        })}
        <motion.img
          src={APP_CONFIG.memoji}
          alt=""
          className="lab-stack__sticker"
          animate={{ rotate: [-6, 6, -6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}

/* 4 — Floating mosaic: photos drift around a centred title and follow the mouse with parallax. */
export function HeroFloat({ photos }: HeroProps) {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const slots = [
    { left: "4%", top: "8%", w: 150, depth: 30 },
    { left: "18%", top: "62%", w: 120, depth: -20 },
    { left: "76%", top: "6%", w: 140, depth: -35 },
    { left: "84%", top: "55%", w: 120, depth: 25 },
    { left: "40%", top: "-6%", w: 90, depth: 15 },
    { left: "58%", top: "74%", w: 100, depth: -15 },
  ];
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  return (
    <section
      ref={ref}
      className="lab-float"
      onMouseMove={onMove}
      onMouseLeave={() => (mx.set(0), my.set(0))}
    >
      {slots.map((s, i) => (
        <FloatPhoto
          key={i}
          photo={photos[i]}
          slot={s}
          sx={sx}
          sy={sy}
          index={i}
        />
      ))}
      <div className="lab-float__center">
        <motion.img
          src={APP_CONFIG.memoji}
          alt=""
          width={84}
          height={84}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
        />
        <Wordmark className="lab-float__wordmark" photosLabel={t.photos} />
        <p className="lab-oldhero__tag" style={{ marginInline: "auto" }}>
          {t.tag}
        </p>
      </div>
    </section>
  );
}

function FloatPhoto({
  photo,
  slot,
  sx,
  sy,
  index,
}: {
  photo?: Photo;
  slot: { left: string; top: string; w: number; depth: number };
  sx: ReturnType<typeof useSpring>;
  sy: ReturnType<typeof useSpring>;
  index: number;
}) {
  const x = useTransform(sx, (v) => v * slot.depth * 2);
  const y = useTransform(sy, (v) => v * slot.depth * 2);
  if (!photo) return null;
  return (
    <motion.div
      className="lab-float__item"
      style={{ left: slot.left, top: slot.top, width: slot.w, x, y }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
        transition={{
          opacity: { delay: 0.1 * index, duration: 0.6 },
          scale: { delay: 0.1 * index, duration: 0.6, ease: EASE },
          y: { duration: 5 + index, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src(photo)}
          alt=""
          style={{
            background: photo.color,
            aspectRatio: `${photo.width} / ${photo.height}`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/* 5 — Rotating word: a sentence instead of a logo; the subject word cycles with a slide. */
export function HeroRotating({ photos }: HeroProps) {
  const { lang } = useLanguage();
  const words =
    lang === "es"
      ? ["calles", "viajes", "mar", "Galicia", "vídeo"]
      : ["streets", "travel", "the sea", "Galicia", "video"];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % words.length), 2200);
    return () => clearInterval(id);
  }, [words.length]);
  const bg = photos[i % Math.max(photos.length, 1)];
  return (
    <section className="lab-rotate avr-section">
      <div className="lab-rotate__copy">
        <div className="lab-rotate__hello">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={APP_CONFIG.memoji}
            alt=""
            className="lab-wave"
            width={56}
            height={56}
          />
          <span>{lang === "es" ? "Hola, soy Alex" : "Hi, I'm Alex"}</span>
        </div>
        <h1 className="lab-rotate__title">
          {lang === "es" ? "Fotografío" : "I photograph"}
          <span className="lab-rotate__slot">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={words[i]}
                className="lab-rotate__word"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                {words[i]}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>
      </div>
      <div className="lab-rotate__photo">
        <AnimatePresence mode="popLayout" initial={false}>
          {bg && (
            <motion.img
              key={bg.id}
              src={src(bg, "regular")}
              alt=""
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export const HEROES = [
  { id: "current", name: "Current (text ring)", Component: HeroCurrent },
  { id: "reveal", name: "Letter reveal", Component: HeroReveal },
  { id: "marquee", name: "Photo marquee", Component: HeroMarquee },
  { id: "stack", name: "Card stack", Component: HeroStack },
  { id: "float", name: "Floating mosaic", Component: HeroFloat },
  { id: "rotating", name: "Rotating word", Component: HeroRotating },
] as const;
