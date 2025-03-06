import { useState, useEffect, FC, useRef, useMemo } from "react";
import { AvailableApis } from "../../apis/apis";
import { Pager } from "@/models/Pagination";
import StatsContainer from "@/components/StatsContainer";
import LoadingIndicator from "@/components/loading/LoadingIndicator";
import { motion } from "framer-motion";
import ImageGallery from "@/components/images/ImageGallery";
import { useUserPhoto } from "@/contexts/UserPhotoContext";
import { useUserPhotos } from "@/apis/user/UserPhotosApi";
import { AboutMeGrid } from "@/components/landing/AboutMeGrid";
import GradientText from "@/components/text/GradientText";
import { CompaniesAnimatedCarousel } from "@/components/shared/CompaniesAnimatedCarousel";

const Landing: FC = () => {
  const { setUser } = useUserPhoto();
  const observerRef = useRef<HTMLDivElement>(null);

  const {
    data: photosResponse,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useUserPhotos(
    {
      currentPage: 1,
      resultsPerPage: 12,
      orderBy: "popular",
    },
    {
      getNextPageParam: (
        lastPage: { user: { total_photos: any } }[],
        allPages: string | any[]
      ) => {
        const totalPhotos = lastPage[0]?.user?.total_photos;
        const nextPage = allPages.length + 1;
        return nextPage * 12 < totalPhotos ? nextPage : undefined;
      },
    }
  );

  const photos = useMemo(() => {
    return photosResponse?.pages?.flat() ?? [];
  }, [photosResponse]);

  useEffect(() => {
    const node = observerRef.current;
    if (!node || !hasNextPage || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
          //setPager({ ...pager, page: pager.page + 1 });
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isLoading, photos]);

  const totalCustomerPhotos = photos?.[0]?.user?.total_photos;
  const profileImage = photos?.[0]?.user?.profile_image?.large;

  return (
    <div>
      <div className="avatar">
        <div className="ring-primary ring-offset-base-100 md:w-44 w-24 rounded-full">
          <img src={profileImage} />
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
          <GradientText>Alexvarelo.raw</GradientText>
        </a>
        <br className="mb-10" /> PHOTOS
      </motion.h1>

      <AboutMeGrid images={photos?.slice(0, 4).map((x) => x.urls.regular)} />
      <br />

      <CompaniesAnimatedCarousel />
      <br />
      <h2 className="md:text-2xl text-xl font-bold my-4">Photos summary</h2>
      <div className="flex justify-center items-center gap-4 md:gap-2">
        <StatsContainer
          title={"Photos"}
          stat={totalCustomerPhotos}
          additionalItem={`Promoted photos: ${photos?.[0]?.user?.total_promoted_photos}`}
        />
        <StatsContainer
          title={"Collections"}
          stat={photos?.[0]?.user?.total_collections}
          additionalItem={`Promoted collections: ${photos?.[0]?.user?.total_promoted_illustrations}`}
        />
      </div>
      <br />
      <h1 className="md:text-2xl text-xl font-bold mb-2">My popular gallery</h1>
      <div className="text-xs text-gray-500">
        <p>
          Showing {photos.length} photos from {totalCustomerPhotos}
        </p>
      </div>
      {isLoading && !isFetchingNextPage ? (
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
          {isFetchingNextPage && (
            <div className="flex justify-center items-center h-full mb-96">
              <LoadingIndicator isLoading={true} loadingSize="lg" />
            </div>
          )}
          {hasNextPage && <div ref={observerRef} className="h-10 w-full" />}
        </motion.div>
      )}
    </div>
  );
};

export default Landing;
