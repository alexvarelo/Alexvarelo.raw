"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useGetUserPhotos } from "@/apis/generated/unsplashApi";
import { Photo } from "@/apis/generated/model";
import { APP_CONFIG } from "@/constants/app";
import { useLanguage } from "@/contexts/LanguageContext";
import { useImageNavigation } from "@/contexts/ImageNavigationContext";
import { ColorCategory, getColorCategory } from "../utils/colorUtils";
import { Button } from "@/components/ds/core";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 30; // Unsplash returns at most 30 per request
const EASE = [0.2, 0.8, 0.2, 1] as const;
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

const sentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const GalleryPage = () => {
  const { t } = useLanguage();
  const { setImageNavigation } = useImageNavigation();
  const [page, setPage] = useState(1);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [active, setActive] = useState<ColorCategory>("All");

  const { data: newPhotos = [], isLoading } = useGetUserPhotos(
    APP_CONFIG.unsplash.username,
    {
      page,
      per_page: PAGE_SIZE,
      order_by: "latest",
      stats: true,
    },
  );

  useEffect(() => {
    if (newPhotos.length === 0) return;
    setPhotos((prev) => {
      if (page === 1) return newPhotos;
      return [
        ...prev,
        ...newPhotos.filter((p) => !prev.some((x) => x.id === p.id)),
      ];
    });
  }, [newPhotos, page]);

  // A full page means there may be more
  const hasMore =
    (isLoading && photos.length > 0) || newPhotos.length === PAGE_SIZE;

  // One swatch per colour that actually appears, painted with a real photo colour from that group
  const swatches = useMemo(() => {
    const groups = new Map<ColorCategory, Photo[]>();
    photos.forEach((p) => {
      const c = getColorCategory(p.color || "");
      groups.set(c, [...(groups.get(c) ?? []), p]);
    });
    return CATEGORIES.filter((c) => c === "All" || groups.has(c)).map((c) => {
      const items = groups.get(c) ?? [];
      return {
        id: c,
        count: c === "All" ? photos.length : items.length,
        color:
          c === "All" ? undefined : items[Math.floor(items.length / 2)].color,
      };
    });
  }, [photos]);

  const visible =
    active === "All"
      ? photos
      : photos.filter((p) => getColorCategory(p.color || "") === active);

  // Photo detail's next/previous follow what is on screen
  useEffect(() => {
    if (visible.length) setImageNavigation(visible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, photos]);

  return (
    <div className="avr-section">
      <header className="lg-head">
        <span className="avr-overline">{t.gallery.eyebrow(photos.length)}</span>
        <h1 className="lg-h1">{t.gallery.title}</h1>
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
            <span>{s.id === "All" ? t.gallery.all : s.id}</span>
            <span className="lg-swatch__count">{s.count}</span>
          </button>
        ))}
      </div>

      {visible.length === 0 && !isLoading ? (
        <p className="avr-subtle">{t.gallery.empty}</p>
      ) : (
        <motion.div key={active} className="avr-masonry">
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
              <Link
                href={`/image/${p.id}`}
                className="avr-masonry__item lg-card"
                style={{
                  background: p.color,
                  aspectRatio: `${p.width} / ${p.height}`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.urls?.small}
                  alt={p.alt_description ?? ""}
                  width={p.width}
                  height={p.height}
                  loading="lazy"
                />
                <span className="lg-card__caption">
                  <span>
                    {sentence(p.description || p.alt_description || t.untitled)}
                  </span>
                  <span className="avr-mono">
                    {p.created_at
                      ? new Date(p.created_at).toLocaleDateString(t.locale, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : ""}
                  </span>
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {hasMore && (
        <div className="avr-loadmore">
          <Button onClick={() => setPage((n) => n + 1)} disabled={isLoading}>
            {isLoading ? t.loading : t.loadMore}
          </Button>
        </div>
      )}
      {!hasMore && <div style={{ height: 64 }} />}
    </div>
  );
};

export default GalleryPage;
