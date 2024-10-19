import { useState, useEffect, FC } from "react";
import { AvailableApis } from "../apis/apis";
import Image from "next/image";
import { Pager } from "@/models/Pagination";
import StatsContainer from "@/components/StatsContainer";
import LoadingIndicator from "@/components/loading/LoadingIndicator";
import PaginationComponent from "@/components/PaginationComponent";
import { motion } from "framer-motion";

const Landing: FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setIsLoading] = useState(false);

  const [pagination, setPagination] = useState<Pager>({
    page: 1,
    resultsPerPage: 8,
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
    <div className="p-10">
      <div className="avatar">
        <div className="ring-primary ring-offset-base-100 w-24 rounded-full">
          <img src={profileImage} />
        </div>
      </div>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-3xl font-bold my-4"
      >
        Hi! I'm <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Alexvarelo.raw</span>, <br className="mb-10" /> But you
        can call me Alex
      </motion.h1>
      <div className="">
        <p className="my-2">
          My name is Alex, I&apos;m a software engineer and one of my biggest
          passions is to travel. <br />
          One of the best things to travel for me is to carry my camera
          everywhere, so I can create custom memories, that afterwards I like to
          share.
        </p>
      </div>
      <br />
      <h2 className="text-2xl font-semibold my-4">Photos summary</h2>
      <div className="flex justify-center items-center gap-8">
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
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {photos.map((photo) => (
            <>
              <div
                key={photo.id}
                className="relative w-full h-96 overflow-hidden group"
              >
                <Image
                  src={photo.urls.regular}
                  alt={photo.alt_description}
                  blurDataURL={photo.blur_hash}
                  layout="fill"
                  objectFit="cover"
                  loading="lazy"
                  placeholder={photo.blur_hash ? "blur" : "empty"}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                {/* <div className="absolute bottom-0 right-0 bg-opacity-50 text-white p-2 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-xs">{photo.}</p>
                </div> */}
              </div>
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
          updatePage={(page) => setPagination({ ...pagination, page })}
        />
      </div>
    </div>
  );
};

export default Landing;
