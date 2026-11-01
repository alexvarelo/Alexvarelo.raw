"use client";

/*
 * Gallery lab: compare ways of presenting the gallery page.
 * Not linked from the site — open /lab/gallery directly. Delete once a direction is chosen.
 */

import { useEffect, useState } from "react";
import "@/components/lab/lab.css";
import { GALLERIES } from "@/components/lab/galleries";
import { useGetUserPhotos } from "@/apis/generated/unsplashApi";
import { useImageNavigation } from "@/contexts/ImageNavigationContext";
import { APP_CONFIG } from "@/constants/app";

type GalleryId = (typeof GALLERIES)[number]["id"];

export default function GalleryLabPage() {
  const [variant, setVariant] = useState<GalleryId>("spectrum");
  const [ready, setReady] = useState(false);
  const [replay, setReplay] = useState(0);
  const { setImageNavigation } = useImageNavigation();

  // Same query as the current /gallery page
  const { data: photos = [], isLoading } = useGetUserPhotos(
    APP_CONFIG.unsplash.username,
    {
      page: 1,
      per_page: 40,
      order_by: "latest",
      stats: true,
    },
  );

  useEffect(() => {
    if (photos.length) setImageNavigation(photos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos]);

  // Keep the selection in the URL so it survives reloads and can be shared
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("v");
    if (GALLERIES.some((g) => g.id === v)) setVariant(v as GalleryId);
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      window.history.replaceState(null, "", `/lab/gallery?v=${variant}`);
  }, [ready, variant]);

  const Gallery = GALLERIES.find((g) => g.id === variant)!.Component;

  return (
    <div className="lab-page">
      {isLoading ? (
        <div style={{ height: "60vh" }} />
      ) : (
        <Gallery key={`${variant}-${replay}`} photos={photos} />
      )}

      <div className="lab-switcher" role="group" aria-label="Gallery lab">
        <label>
          <span>Gallery</span>
          <select
            value={variant}
            onChange={(e) => setVariant(e.target.value as GalleryId)}
          >
            {GALLERIES.map((g, i) => (
              <option key={g.id} value={g.id}>
                {i + 1}. {g.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => setReplay((r) => r + 1)}
          title="Replay animation"
        >
          ↻
        </button>
      </div>
    </div>
  );
}
