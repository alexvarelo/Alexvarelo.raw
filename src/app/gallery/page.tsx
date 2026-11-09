"use client";

import { useEffect, useMemo, useState } from "react";
import ImageGallery from "@/components/images/ImageGallery";
import { useGetUserPhotos } from "@/apis/generated/unsplashApi";
import { APP_CONFIG } from "@/constants/app";

const PER_PAGE = 30;

type View = "colors" | "recent";

const COLOR_GROUPS = [
  { key: "red", label: "Red", swatch: "#ef4444" },
  { key: "orange", label: "Orange", swatch: "#f97316" },
  { key: "yellow", label: "Yellow", swatch: "#eab308" },
  { key: "green", label: "Green", swatch: "#22c55e" },
  { key: "blue", label: "Blue", swatch: "#3b82f6" },
  { key: "purple", label: "Purple", swatch: "#a855f7" },
  { key: "neutral", label: "Neutral", swatch: "#9ca3af" },
] as const;

type ColorKey = (typeof COLOR_GROUPS)[number]["key"];

const hexToHsl = (hex: string) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
  if (!m) return { h: 0, s: 0, l: 0 };
  const n = parseInt(m[1], 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  return { h, s, l };
};

const getColorKey = (hex: string): ColorKey => {
  const { h, s, l } = hexToHsl(hex);
  if (s < 0.18 || l < 0.12 || l > 0.9) return "neutral";
  if (h < 15 || h >= 345) return "red";
  if (h < 45) return "orange";
  if (h < 70) return "yellow";
  if (h < 165) return "green";
  if (h < 255) return "blue";
  return "purple";
};

const GRID_COLS = { default: 3, 1100: 2, 700: 2 };

const GalleryPage = () => {
  const [view, setView] = useState<View>("colors");
  const [colorFilter, setColorFilter] = useState<ColorKey | "all">("all");
  const [page, setPage] = useState(1);
  const [photos, setPhotos] = useState<any[]>([]);
  const [done, setDone] = useState(false);

  const { data, isLoading } = useGetUserPhotos(APP_CONFIG.unsplash.username, {
    page,
    per_page: PER_PAGE,
    order_by: "latest",
  });

  // Keep fetching pages until the whole library is loaded.
  useEffect(() => {
    if (!data) return;
    setPhotos((prev) => {
      const known = new Set(prev.map((p) => p.id));
      return [...prev, ...data.filter((p: any) => !known.has(p.id))];
    });
    if (data.length < PER_PAGE) setDone(true);
    else setPage((p) => p + 1);
  }, [data]);

  const recent = useMemo(
    () =>
      [...photos].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [photos]
  );

  const byColor = useMemo(() => {
    const list = photos.filter(
      (p) => colorFilter === "all" || getColorKey(p.color) === colorFilter
    );
    return list.sort((a, b) => hexToHsl(a.color).h - hexToHsl(b.color).h);
  }, [photos, colorFilter]);

  const shown = view === "colors" ? byColor : recent;

  const tabClass = (active: boolean) =>
    `tab ${active ? "tab-active font-semibold" : ""}`;

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col items-center gap-3 py-2">
        <div role="tablist" className="tabs tabs-boxed">
          <button
            role="tab"
            className={tabClass(view === "colors")}
            onClick={() => setView("colors")}
          >
            Colors
          </button>
          <button
            role="tab"
            className={tabClass(view === "recent")}
            onClick={() => setView("recent")}
          >
            Recent
          </button>
        </div>

        {view === "colors" && (
          <div className="flex flex-wrap justify-center gap-2 px-4">
            <button
              className={`btn btn-sm ${colorFilter === "all" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setColorFilter("all")}
            >
              All
            </button>
            {COLOR_GROUPS.map((c) => (
              <button
                key={c.key}
                aria-label={c.label}
                title={c.label}
                onClick={() => setColorFilter(c.key)}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${
                  colorFilter === c.key
                    ? "border-base-content scale-110"
                    : "border-transparent opacity-80 hover:scale-110"
                }`}
                style={{ backgroundColor: c.swatch }}
              />
            ))}
          </div>
        )}
      </div>

      {isLoading && photos.length === 0 ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      ) : (
        <div className="w-full pb-4">
          {shown.length > 0 ? (
            <ImageGallery
              key={`${view}-${colorFilter}`}
              photos={shown}
              breakPoints={GRID_COLS}
            />
          ) : (
            <p className="text-center text-gray-500 pt-20">
              No photos for this color.
            </p>
          )}
          {!done && (
            <p className="text-center text-sm text-gray-500 py-4">
              Loading more photos…
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
