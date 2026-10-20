"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useImageNavigation } from "@/contexts/ImageNavigationContext";
import { formatCompact, useLanguage } from "@/contexts/LanguageContext";
import { APP_CONFIG } from "@/constants/app";
import { POPULAR_PAGE_SIZE } from "@/app/landing/Landing";
import {
  useGetPhotoDetails,
  useGetUserPhotos,
  usePhotoStatistics,
} from "@/apis/generated/unsplashApi";
import { Button, IconButton, BadgeGroup } from "@/components/ds/core";
import { PhotoFrame, SpecList, StatLine } from "@/components/ds/content";

interface PageProps {
  params: { imageId: string };
}

const MAX_KEYWORDS = 8;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

async function downloadImage(url: string, filename: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    window.open(url, "_blank", "noopener");
  }
}

const ImageDetail: React.FC<PageProps> = ({ params }) => {
  const router = useRouter();
  const { t } = useLanguage();
  const { navigation } = useImageNavigation();
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: photo, isLoading } = useGetPhotoDetails(params.imageId);
  const { data: photoStats } = usePhotoStatistics(params.imageId);
  // Same query as the home gallery's first page, so it is usually served from cache.
  const { data: popular = [] } = useGetUserPhotos(
    APP_CONFIG.unsplash.username,
    {
      page: 1,
      per_page: POPULAR_PAGE_SIZE,
      order_by: "popular",
      stats: true,
    },
  );

  // Opened directly (no gallery visited yet): browse through the popular photos instead.
  const order = navigation.order.length
    ? navigation.order
    : popular.map((p) => String(p.id));
  const position = order.indexOf(params.imageId);
  const nextId =
    navigation.nextImage[params.imageId] ??
    (position >= 0 ? order[position + 1] : undefined);
  const prevId =
    navigation.prevImage[params.imageId] ??
    (position > 0 ? order[position - 1] : undefined);

  useEffect(() => setLoaded(false), [params.imageId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && nextId) router.push(`/image/${nextId}`);
      if (e.key === "ArrowLeft" && prevId) router.push(`/image/${prevId}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextId, prevId, router]);

  const goBack = () => {
    if (navigation.order.length) router.back();
    else router.push("/");
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          url,
          title: photo?.alt_description ?? APP_CONFIG.title,
        });
      } catch {}
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading || !photo) {
    return (
      <div className="avr-detail-page">
        <div className="avr-crumbs avr-section">
          <span>← {t.back}</span>
        </div>
        <section className="avr-detail avr-section">
          <PhotoFrame tint="neutral" style={{ height: "70vh" }} />
          <div className="avr-detail__info">
            <PhotoFrame
              tint="neutral"
              style={{ height: 120, borderRadius: 12 }}
            />
          </div>
        </section>
      </div>
    );
  }

  const exif = photo.exif;
  const title = capitalize(
    photo.description || photo.alt_description || t.untitled,
  );
  // Unsplash often repeats the brand inside the model ("Canon" + "Canon EOS R6")
  const camera = exif?.model?.includes(exif.make ?? "")
    ? exif.model
    : [exif?.make, exif?.model].filter(Boolean).join(" ");
  const specs = [
    { k: t.spec.camera, v: camera || "—" },
    { k: t.spec.aperture, v: exif?.aperture ? `ƒ/${exif.aperture}` : "—" },
    {
      k: t.spec.shutter,
      v: exif?.exposure_time ? `${exif.exposure_time}s` : "—",
    },
    { k: t.spec.focal, v: exif?.focal_length ? `${exif.focal_length}mm` : "—" },
    { k: t.spec.iso, v: exif?.iso ?? "—" },
    {
      k: t.spec.published,
      v: photo.created_at
        ? new Date(photo.created_at).toLocaleDateString(t.locale, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "—",
    },
  ];
  const keywords = Array.from(
    new Set(
      (photo.tags ?? [])
        .map((tag) => tag.title)
        .filter((k): k is string => !!k)
        .map(capitalize),
    ),
  ).slice(0, MAX_KEYWORDS);
  const more = popular.filter((p) => p.id !== photo.id).slice(0, 5);
  const onDownload = () =>
    downloadImage(
      photo.urls?.full ?? photo.urls?.raw ?? "",
      `alexvarelo-${photo.id}.jpg`,
    );

  return (
    <div className="avr-detail-page">
      <div className="avr-crumbs avr-section">
        <button type="button" onClick={goBack}>
          ← {t.back}
        </button>
        {position >= 0 && (
          <span className="avr-mono">
            {position + 1} {t.of} {order.length}
          </span>
        )}
      </div>

      <section className="avr-detail avr-section">
        <div className="avr-detail__stage">
          <div
            className="avr-detail__frame"
            style={{ background: photo.color }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={photo.id}
              src={photo.urls?.regular}
              alt={photo.alt_description ?? ""}
              width={photo.width}
              height={photo.height}
              onLoad={() => setLoaded(true)}
              style={{ opacity: loaded ? 1 : 0 }}
            />
            {prevId && (
              <IconButton
                glyph="←"
                label={t.previous}
                size={48}
                variant="glass"
                className="avr-detail__nav"
                style={{ left: 18 }}
                onClick={() => router.push(`/image/${prevId}`)}
              />
            )}
            {nextId && (
              <IconButton
                glyph="→"
                label={t.next}
                size={48}
                variant="glass"
                className="avr-detail__nav"
                style={{ right: 18 }}
                onClick={() => router.push(`/image/${nextId}`)}
              />
            )}
          </div>
        </div>

        <motion.div
          className="avr-detail__info"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {photo.location?.name && (
            <span className="avr-detail__kicker">{photo.location.name}</span>
          )}
          <h1 className="avr-h1">{title}</h1>
          <StatLine
            items={[
              {
                value: formatCompact(photoStats?.views?.total, t.locale),
                label: t.views,
              },
              {
                value: formatCompact(photoStats?.downloads?.total, t.locale),
                label: t.downloads,
              },
            ]}
          />
          <div className="avr-detail__actions">
            <Button icon="↓" fullWidth onClick={onDownload}>
              {t.download}
            </Button>
            <Button variant="secondary" onClick={share}>
              {copied ? t.copied : t.share}
            </Button>
          </div>
          <SpecList rows={specs} />
          {keywords.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <BadgeGroup items={keywords} />
            </div>
          )}
        </motion.div>
      </section>

      {more.length > 0 && (
        <>
          <section className="avr-more-head avr-section">
            <h3 className="avr-h3">{t.more}</h3>
            <Link href="/" className="avr-link-underline">
              {t.viewAll}
            </Link>
          </section>
          <section className="avr-more avr-section">
            {more.map((p) => (
              <Link key={p.id} href={`/image/${p.id}`} className="avr-tile">
                <PhotoFrame
                  src={p.urls?.small}
                  alt={p.alt_description ?? ""}
                  color={p.color}
                />
              </Link>
            ))}
          </section>
        </>
      )}

      <div className="avr-mobile-bar">
        <Button icon="↓" fullWidth onClick={onDownload}>
          {t.download}
        </Button>
      </div>
    </div>
  );
};

export default ImageDetail;
