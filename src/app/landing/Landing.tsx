import { useState, useEffect, FC, useRef, useMemo } from "react";
import Image from "next/image";
import LoadingIndicator from "@/components/loading/LoadingIndicator";
import { motion } from "framer-motion";
import ImageGallery from "@/components/images/ImageGallery";
import { useUserPhoto } from "@/contexts/UserPhotoContext";
import { AboutMeGrid } from "@/components/landing/AboutMeGrid";
import GradientText from "@/components/text/GradientText";
import { CompaniesAnimatedCarousel } from "@/components/shared/CompaniesAnimatedCarousel";
import { APP_CONFIG } from "@/constants/app";
import { Pager } from "@/models/Pagination";
import {
  useGetUserPhotos,
  useGetUserProfile,
} from "@/apis/generated/unsplashApi";

const Landing: FC = () => {
  const [pager, setPager] = useState<Pager>({
    page: 1,
    resultsPerPage: 12,
  });
  const { setUser } = useUserPhoto();
  const observerRef = useRef<HTMLDivElement>(null);

  const { data: newPhotos = [], isLoading } = useGetUserPhotos(
    APP_CONFIG.unsplash.username,
    {
      page: pager.page,
      per_page: pager.resultsPerPage,
      order_by: "popular",
      stats: true,
    }
  );

  const { data: userProfile } = useGetUserProfile(APP_CONFIG.unsplash.username);

  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    if (newPhotos && newPhotos.length > 0) {
      if (pager.page === 1) {
        setPhotos(newPhotos);
      } else {
        setPhotos((prev) => {
          // Avoid appending duplicates
          const newPhotosFiltered = newPhotos.filter(
            (newPhoto) => !prev.some((p) => p.id === newPhoto.id)
          );
          return [...prev, ...newPhotosFiltered];
        });
      }
    }
  }, [newPhotos, pager.page]);

  const hasNextPage =
    pager.page * pager.resultsPerPage < (userProfile?.total_photos ?? 0);

  useEffect(() => {
    const node = observerRef.current;
    if (!node || !hasNextPage || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPager((prev) => ({ ...prev, page: prev.page + 1 }));
        }
      },
      { threshold: 0.1, rootMargin: "400px" }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isLoading]);

  useEffect(() => {
    if (userProfile) {
      setUser(userProfile as User);
    }
  }, [userProfile, setUser]);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="avatar order-1 md:order-2"
        >
          <div className="ring-primary ring-offset-base-100 w-32 md:w-48 rounded-full shadow-2xl overflow-hidden relative aspect-square">
            <Image 
              src={APP_CONFIG.avatar} 
              alt={userProfile?.name || "Avatar"} 
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="md:text-9xl text-4xl leading-none font-black uppercase tracking-tighter order-2 md:order-1 text-center md:text-left"
        >
          <a
            href="https://www.instagram.com/alexvarelo.raw"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GradientText>{APP_CONFIG.title}</GradientText>
          </a>
          <br className="md:hidden" /> PHOTOS
        </motion.h1>
      </div>

      <AboutMeGrid
        images={
          photos
            ? photos
              .slice(0, 4)
              .map((x) => x?.urls?.regular)
              .filter((url): url is string => typeof url === "string")
            : []
        }
      />
      <br />

      <CompaniesAnimatedCarousel />
      <br />
      {/* <h2 className="md:text-2xl text-xl font-bold my-4">Photos summary</h2>
      <div className="flex justify-center items-center gap-4 md:gap-2">
        <StatsContainer
          title={"Photos"}
          stat={userProfile?.total_photos ?? 0}
          additionalItem={`Promoted photos: ${userProfile?.total_promoted_photos ?? 0}`}  
        />
        <StatsContainer
          title={"Collections"}
          stat={userProfile?.total_collections ?? 0}
          additionalItem={`Promoted collections: ${userProfile?.total_promoted_illustrations}`}
        />
      </div>
      <br /> */}
      <h1 className="md:text-2xl text-xl font-bold mb-2">My popular gallery</h1>
      <div className="text-xs text-gray-500">
        <p>
          Showing {photos.length} photos from {userProfile?.total_photos}
        </p>
      </div>
      {isLoading && pager.page === 1 ? (
        <div className="flex justify-center items-center h-full">
          <LoadingIndicator isLoading={true} loadingSize="lg" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3 }}
          className="pt-10"
        >
          <ImageGallery photos={photos} showPhotoStats={true} />
          {hasNextPage && <div ref={observerRef} className="h-10 w-full" />}
        </motion.div>
      )}
    </>
  );
};

export default Landing;
