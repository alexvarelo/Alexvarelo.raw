import { useState, useEffect, FC, useRef, useMemo } from "react";
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
    }
  );

  const { data: userProfile } = useGetUserProfile(APP_CONFIG.unsplash.username);

  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    if (pager.page === 1) {
      setPhotos(newPhotos);
    } else if (newPhotos.length > 0) {
      setPhotos((prev) => [...prev, ...newPhotos]);
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
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isLoading, pager]);

  useEffect(() => {
    if (userProfile) {
      setUser(userProfile as User);
    }
  }, [userProfile, setUser]);

  return (
    <div>
      <div className="avatar">
        <div className="ring-primary ring-offset-base-100 w-16 md:w-24 rounded-full">
          <img src={userProfile?.profile_image?.large} />
        </div>
      </div>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full md:text-9xl text-4xl leading-none font-black uppercase tracking-tighter mt-8"
      >
        <a
          href="https://www.instagram.com/alexvarelo.raw"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GradientText>{APP_CONFIG.title}</GradientText>
        </a>
        <br className="mb-10" /> PHOTOS
      </motion.h1>

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
    </div>
  );
};

export default Landing;
