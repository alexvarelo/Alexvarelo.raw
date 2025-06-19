"use client";
import { AvailableApis } from "@/apis/apis";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Collection } from "@/models/Collections";
import ImageGallery from "@/components/images/ImageGallery";
import { Badge } from "@/components/shared/Badge";
import { Pager } from "@/models/Pagination";
import Image from "next/image";
import {
  useGetCollection,
  useGetCollectionPhotos,
} from "@/apis/generated/unsplashApi";
import Link from "next/link";
import { TextAnimate } from "@/components/magicui/text-animate";

const Page: React.FC<any> = ({ params }) => {
  const [pager, setPager] = useState<Pager>({ page: 1, resultsPerPage: 10 });
  const observerRef = useRef<HTMLDivElement>(null);

  const { data: collectionInfo, isLoading: isLoadingCollection } =
    useGetCollection(params?.collectionId);
  const { data: collectionPhotos, isLoading } = useGetCollectionPhotos(
    params?.collectionId
  );

  const hasNextPage =
    pager.page * pager.resultsPerPage <
    (collectionInfo?.total_photos as number);

  useEffect(() => {
    const node = observerRef.current;
    if (!node || !hasNextPage || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPager({ ...pager, page: pager.page + 1 });
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isLoading, pager, collectionInfo]);

  // Safely handle possibly undefined collectionPhotos
  const heroPhoto =
    collectionPhotos && collectionPhotos.length > 0
      ? collectionPhotos[0]
      : undefined;
  const galleryPhotos =
    collectionPhotos && collectionPhotos.length > 1
      ? collectionPhotos.slice(1)
      : [];

  if (!collectionInfo || !heroPhoto) {
    return <div>Is loading...</div>;
  }

  const tags = Array.isArray(collectionInfo?.tags) ? collectionInfo.tags : [];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative w-full h-[75vh] overflow-hidden">
        <Image
          src={heroPhoto?.urls?.raw ?? ""}
          alt={collectionInfo.title ?? ""}
          blurDataURL={heroPhoto.blur_hash ? heroPhoto.blur_hash : undefined}
          placeholder={heroPhoto.blur_hash ? "blur" : "empty"}
          fill
          className="object-cover w-full h-full"
          priority
        />
        {/* Bottom Blur and Overlay */}
        <div className="absolute bottom-0 left-0 w-full flex items-end min-h-[30vh] pointer-events-none">
          <div className="relative w-full">
            {/* Frosted glass blur */}
            <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-black/80 via-black/10 to-transparent backdrop-blur-[1px]" />
            {/* Content */}
            <div className="relative z-10 p-4 md:p-6 w-full">
              <div className="pl-2 md:pl-6">
                <Link
                  href="/collections"
                  className="pointer-events-auto px-3 md:px-4 py-1 rounded-full bg-white/20 text-white text-sm md:text-base font-medium shadow hover:bg-white/30 transition flex items-center gap-2 mb-4 w-fit backdrop-blur-md"
                >
                  <span className="text-base md:text-xl">←</span> Back
                </Link>
                <div className="flex items-center gap-4 mb-4 mt-2">
                  <span className="text-base md:text-3xl text-white drop-shadow">
                    {new Date(collectionInfo.published_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </span>
                  <span className="inline-block bg-white/20 text-white text-xs md:text-base font-semibold px-3 md:px-4 py-2 rounded-full backdrop-blur-md shadow">
                    {collectionInfo.total_photos} Photos
                  </span>
                </div>
                <TextAnimate
                  as="h2"
                  animation="blurInUp"
                  by="character"
                  duration={0.8}
                  className="text-4xl md:text-7xl mb-4 font-medium leading-tight text-white drop-shadow tracking-tighter"
                >
                  {collectionInfo.title}
                </TextAnimate>
                <p className="mb-2 text-sm md:text-2xl text-gray-300 font-light drop-shadow w-11/12 md:w-3/4">
                  {collectionInfo.description} A desert-edge editorial shoot
                  blending natural beauty with bold, freckled character. Shot at
                  golden hour to highlight texture, emotion, and movement in an
                  untamed landscape.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {tags.map((tag, indx) => (
                    <Badge text={tag.title ?? ""} key={indx} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Gallery */}
      <div className="max-w-full mx-auto md:pt-10 pt-5 md:px-6 px-3">
        <ImageGallery
          photos={galleryPhotos}
          breakPoints={{ default: 3, 1100: 2, 700: 1 }}
        />
      </div>
      {hasNextPage && <div ref={observerRef} className="h-10 w-full" />}
    </div>
  );
};
export default Page;
