import { useState, useEffect, FC, useRef } from "react";
import { AvailableApis } from "../apis/apis";
import { Pager } from "@/models/Pagination";
import StatsContainer from "@/components/StatsContainer";
import LoadingIndicator from "@/components/loading/LoadingIndicator";
import { motion } from "framer-motion";
import ImageGallery from "@/components/images/ImageGallery";
import { useUserPhoto } from "@/contexts/UserPhotoContext";

const Landing: FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { setUser } = useUserPhoto();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [pagination, setPagination] = useState<Pager>({
    page: 1,
    resultsPerPage: 12,
  });

  useEffect(() => {
    if (pagination.page > 1) {
      setIsLoadingMore(true);
    }
    setIsLoading(true);
    AvailableApis.fetchUserPhotos(
      pagination.page,
      pagination.resultsPerPage
    ).then((result) => {
      setPhotos([...photos, result].flat());
      setUser(result[0].user);
      setIsLoading(false);
      setIsLoadingMore(false);
    });
  }, [pagination]);

  const handleScroll = () => {
    if (pagination.page > totalCustomerPhotos / pagination.resultsPerPage) {
      return;
    }
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    // Check if the user is at the bottom
    if (scrollTop + windowHeight >= fullHeight - 10) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const totalCustomerPhotos = photos?.[0]?.user?.total_photos;
  const profileImage = photos?.[0]?.user?.profile_image?.large;

  return (
    <div onWheel={handleScroll} ref={containerRef}>
      <div className="avatar">
        <div className="ring-primary ring-offset-base-100 w-24 rounded-full">
          <img src={profileImage} />
        </div>
      </div>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-3xl font-bold my-6"
      >
        <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Alexvarelo.raw
        </span>
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
          <span className="bg-gradient-to-r from-green-600 to-blue-300 bg-clip-text text-transparent font-extrabold text-xl">
            Galicia
          </span>
          <br />
          📷 One of the best things to travel for me is to carry my camera
          everywhere, so I can create custom memories, that afterwards I like to
          share.
        </p>
      </motion.h1>

      <br />
      <h2 className="text-2xl font-semibold my-4">Photos summary</h2>
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
      <h1 className="text-2xl font-bold mb-2">My recent gallery</h1>
      <div className="text-xs text-gray-500">
        <p>
          Showing {pagination.resultsPerPage * pagination.page} photos from{" "}
          {totalCustomerPhotos}
        </p>
      </div>
      {isLoading && !isLoadingMore ? (
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
          <ImageGallery photos={photos} />
          {isLoadingMore && (
            <div className="flex justify-center items-center h-full">
              <LoadingIndicator isLoading={true} loadingSize="lg" />
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Landing;
