import { useState, useEffect, FC } from "react";
import Link from "next/link";
import { useUserPhoto } from "@/contexts/UserPhotoContext";
import { useImageNavigation } from "@/contexts/ImageNavigationContext";
import { formatCompact, useLanguage } from "@/contexts/LanguageContext";
import { useCollectionPhotos } from "@/apis/user/CollectionPhotosApis";
import { APP_CONFIG } from "@/constants/app";
import { Photo } from "@/apis/generated/model";
import {
  useGetUserPhotos,
  useGetUserProfile,
  useGetUserStatistics,
} from "@/apis/generated/unsplashApi";
import { HeroReveal } from "./HeroReveal";
import { Button } from "@/components/ds/core";
import {
  AboutCard,
  DisciplineTile,
  Highlight,
  PhotoFrame,
  Tint,
} from "@/components/ds/content";

export const POPULAR_PAGE_SIZE = 12;

const DISCIPLINE_TINTS: Tint[] = ["street", "video", "edit", "travel"];
const FEATURED = [
  "wix",
  "wordpress",
  "notion",
  "trello",
  "figma",
  "dropbox",
  "ghost",
  "medium",
  "googleslides",
  "mailchimp",
  "squarespace",
];

type Profile = { total_photos?: number; downloads?: number };

const Landing: FC = () => {
  const { t } = useLanguage();
  const [page, setPage] = useState(1);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const { setUser } = useUserPhoto();
  const { setImageNavigation } = useImageNavigation();

  const { data: newPhotos = [], isLoading } = useGetUserPhotos(
    APP_CONFIG.unsplash.username,
    {
      page,
      per_page: POPULAR_PAGE_SIZE,
      order_by: "popular",
      stats: true,
    },
  );
  const { data: userProfile } = useGetUserProfile(APP_CONFIG.unsplash.username);
  const { data: userStats } = useGetUserStatistics(
    APP_CONFIG.unsplash.username,
  );
  const { data: tileImages } = useCollectionPhotos(
    process.env.NEXT_PUBLIC_UNSPLASH_LANDING_IMAGES_COLLECTION as string,
    { page: 1, resultsPerPage: 5 },
  );

  const profile = userProfile as Profile | undefined;
  const totalPhotos = profile?.total_photos ?? 0;
  const hasNextPage = page * POPULAR_PAGE_SIZE < totalPhotos;

  useEffect(() => {
    if (newPhotos.length === 0) return;
    setPhotos((prev) => {
      if (page === 1) return newPhotos;
      const fresh = newPhotos.filter((p) => !prev.some((x) => x.id === p.id));
      return [...prev, ...fresh];
    });
  }, [newPhotos, page]);

  useEffect(() => {
    if (photos.length) setImageNavigation(photos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos]);

  useEffect(() => {
    if (userProfile) setUser(userProfile as unknown as User);
  }, [userProfile, setUser]);

  const stats = [
    {
      value: formatCompact(userStats?.views?.total, t.locale),
      label: t.stats.views,
    },
    {
      value: formatCompact(
        userStats?.downloads?.total ?? profile?.downloads,
        t.locale,
      ),
      label: t.stats.downloads,
    },
    { value: totalPhotos ? String(totalPhotos) : "—", label: t.stats.photos },
  ];

  return (
    <>
      <HeroReveal />

      <section className="avr-bento avr-section">
        <AboutCard title={t.about} className="avr-bento__about" stats={stats}>
          {t.bio1}
          <Highlight>Galicia</Highlight>
          {t.bio2}
        </AboutCard>
        {t.disciplines.map((title, i) => (
          <DisciplineTile
            key={i}
            index={"0" + (i + 1)}
            title={title}
            tint={DISCIPLINE_TINTS[i]}
            src={tileImages?.[i]?.urls?.regular}
            href="/collections"
          />
        ))}
      </section>

      <section className="avr-featured avr-section">
        <span className="avr-overline">{t.featured}</span>
        <div className="avr-featured__marquee">
          {/* Two copies of the list so the loop is seamless; the second is hidden from screen readers */}
          <div className="avr-featured__track">
            {[...FEATURED, ...FEATURED].map((logo, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={`/${logo}.svg`}
                alt={i < FEATURED.length ? logo : ""}
                aria-hidden={i >= FEATURED.length || undefined}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="avr-gallery-head avr-section">
        <div>
          <h2 className="avr-h2">{t.popular}</h2>
          {totalPhotos > 0 && (
            <div className="avr-subtle">
              {t.showing(photos.length, totalPhotos)}
            </div>
          )}
        </div>
      </section>

      <section className="avr-masonry avr-section">
        {photos.length === 0 && isLoading
          ? Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="avr-masonry__item">
                <PhotoFrame
                  tint="neutral"
                  style={{
                    height: [380, 260, 320, 440][i % 4],
                    borderRadius: 0,
                  }}
                />
              </div>
            ))
          : photos.map((photo) => (
              <Link
                key={photo.id}
                href={`/image/${photo.id}`}
                className="avr-masonry__item"
                style={{
                  background: photo.color,
                  aspectRatio: `${photo.width} / ${photo.height}`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.urls?.regular}
                  alt={photo.alt_description ?? ""}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                />
              </Link>
            ))}
      </section>

      {hasNextPage && (
        <div className="avr-loadmore">
          <Button onClick={() => setPage((p) => p + 1)} disabled={isLoading}>
            {isLoading ? t.loading : t.loadMore}
          </Button>
        </div>
      )}
      {!hasNextPage && <div style={{ height: 64 }} />}
    </>
  );
};

export default Landing;
