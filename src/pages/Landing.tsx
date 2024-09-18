import { useState, useEffect } from "react";
import { AvailableApis } from "../apis/apis";
import Image from "next/image";
import { Pager } from "@/models/Pagination";
import StatsContainer from "@/components/StatsContainer";
import LoadingIndicator from "@/components/loading/LoadingIndicator";
import PaginationComponent from "@/components/PaginationComponent";

export const Landing = () => {
  const [photos, setPhotos] = useState<Photos[]>([]);

  const [pagination, setPagination] = useState<Pager>({
    page: 1,
    resultsPerPage: 8,
  });
  useEffect(() => {
    AvailableApis.fetchUserPhotos(
      pagination.page,
      pagination.resultsPerPage
    ).then((result) => setPhotos(result));
  }, [pagination]);

  return (
    <>
      <h1 className="text-3xl font-bold my-4">Nice to meet you! 👋</h1>
      <p className="text-lg my-2">
        My name is Alex, I'm a software engineer and one of my biggest passions
        is to travel. <br />
        One of the best things to travel for me is to carry my camera
        everywhere, so I can create custom memories, that afterwards I like to
        share.
        <br />
        I've been doing journals, photo albums, and keeping posting images on my{" "}
        <a
          href="https://www.instagram.com/alexvarelo/"
          className="instagramGradient"
        >
          Instagram
        </a>{" "}
        account
      </p>
      <br />
      <h2 className="text-2xl font-semibold my-4">Photos summary</h2>
      <div className="text-center">
        <StatsContainer
          title={"Photos"}
          stat={photos?.[0]?.user?.total_photos}
          additionalItem={`Total promoted photos: ${photos?.[0]?.user?.total_promoted_photos}`}
        />
      </div>
      <br />
      <h1 className="text-2xl font-bold my-4">My recent gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <>
            <div className="relative w-full h-96 aspect-w-1 aspect-h-1">
              <Image
                src={photo.urls.regular}
                alt={photo.alt_description}
                blurDataURL={photo.blur_hash}
                layout="fill"
                objectFit="cover"
                loading="lazy"
                placeholder={photo.blur_hash ? "blur" : "empty"}
              />
            </div>
          </>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <PaginationComponent
          currentPage={pagination.page}
          nextPageDisabled={
            photos?.[0]?.user?.total_photos / pagination.resultsPerPage >
            pagination.page
          }
          updatePage={(page) => setPagination({ ...pagination, page })}
        />
      </div>
    </>
  );
};
