import { useState, useEffect, FC, useRef, useMemo } from "react";
import { AvailableApis } from "../../apis/apis";
import { Pager } from "@/models/Pagination";
import StatsContainer from "@/components/StatsContainer";
import LoadingIndicator from "@/components/loading/LoadingIndicator";
import { motion } from "framer-motion";
import ImageGallery from "@/components/images/ImageGallery";
import { useUserPhoto } from "@/contexts/UserPhotoContext";
import { useUserPhotos } from "@/apis/user/UserPhotosApi";

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
        <div className="ring-primary ring-offset-base-100 w-24 rounded-full">
          <img src={profileImage} />
        </div>
      </div>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="md:text-3xl text-2xl font-bold my-4"
      >
        <a
          href="https://www.instagram.com/alexvarelo.raw"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Alexvarelo.raw
          </span>
        </a>
        , <br className="mb-10" /> But you can call me Alex
      </motion.h1>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.3 }}
      >
        <p className="my-4 max-w-4xl">
          👋 I&apos;m a software engineer and one of my biggest passions is to
          travel. 🛫
          <br className="mb-1" />
          📍 I&apos;m based on Spain, and my hometown is one of the best places
          in earth 🌍 :{" "}
          <span className="bg-gradient-to-r from-green-600 to-blue-300 bg-clip-text text-transparent font-extrabold">
            Galicia
          </span>
          <br />
          📷 One of the best things to travel for me is to carry my camera
          everywhere, so I can create custom memories, that afterwards I like to
          share.
        </p>
      </motion.h1>

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
