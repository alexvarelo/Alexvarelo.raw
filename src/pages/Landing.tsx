import { useState, useEffect, FC } from "react";
import { AvailableApis } from "../apis/apis";
import { Pager } from "@/models/Pagination";
import StatsContainer from "@/components/StatsContainer";
import LoadingIndicator from "@/components/loading/LoadingIndicator";
import PaginationComponent from "@/components/PaginationComponent";
import { motion } from "framer-motion";
import ImageLayout from "@/components/images/ImageLayout";

function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return function (...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

const Landing: FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setIsLoading] = useState(false);

  const [pagination, setPagination] = useState<Pager>({
    page: 1,
    resultsPerPage: 12,
  });

  useEffect(() => {
    setIsLoading(true);
    AvailableApis.fetchUserPhotos(
      pagination.page,
      pagination.resultsPerPage
    ).then((result) => {
      setPhotos(result);
      setIsLoading(false);
    });
  }, [pagination]);


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
          👋
          <br /> I&apos;m a software engineer and one of my biggest passions is
          to travel. 🛫
          <br className="mb-1" />
          📍
          <br />
          I&apos;m based on Spain, and my hometown is one of the best places in
          earth 🌍 :{" "}
          <span className="bg-gradient-to-r from-green-600 to-blue-300 bg-clip-text text-transparent font-bold">
            Galicia
          </span>
          <br />
          📷
          <br />
          One of the best things to travel for me is to carry my camera
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
      <h1 className="text-2xl font-bold my-4">My recent gallery</h1>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <LoadingIndicator isLoading={true} loadingSize="lg" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-3"
        >
          {photos.map((photo) => (
            <>
              <ImageLayout photo={photo} />
            </>
          ))}
        </motion.div>
      )}
      <div className="mt-8 flex justify-center">
        <PaginationComponent
          currentPage={pagination.page}
          nextPageDisabled={
            totalCustomerPhotos / pagination.resultsPerPage < pagination.page
          }
          updatePage={(page) =>
            debounce(() => setPagination({ ...pagination, page }), 100)
          }
        />
      </div>
    </div>
  );
};

export default Landing;
