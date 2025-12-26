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
import { Blurhash } from "react-blurhash";
import LoadingIndicator from "@/components/loading/LoadingIndicator";
import CollectionPageSkeleton from "@/components/skeletons/CollectionPageSkeleton";
import { BsGrid3X3Gap, BsLayoutThreeColumns } from "react-icons/bs";
import { HiOutlineViewGrid } from "react-icons/hi";

const Page: React.FC<any> = ({ params }) => {
  const [pager, setPager] = useState<Pager>({ page: 1, resultsPerPage: 10 });
  const observerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);
  const [isCompact, setIsCompact] = useState(false);

  const { data: collectionInfo } = useGetCollection(params?.collectionId);
  const {
    data: newCollectionPhotos,
    isLoading,
    isFetching,
  } = useGetCollectionPhotos(params?.collectionId, {
    page: pager.page,
    per_page: pager.resultsPerPage,
  });

  useEffect(() => {
    if (!newCollectionPhotos) return;

    if (pager.page === 1) {
      setPhotos(newCollectionPhotos);
    } else if (newCollectionPhotos.length > 0) {
      setPhotos((prev) => {
        // Prevent duplicate appends (common in Strict Mode or sensitive observers)
        const lastExistingPhoto = prev[prev.length - 1];
        const lastNewPhoto =
          newCollectionPhotos[newCollectionPhotos.length - 1];

        if (lastExistingPhoto?.id === lastNewPhoto?.id) {
          return prev;
        }

        return [...prev, ...newCollectionPhotos];
      });
    }
  }, [newCollectionPhotos, pager.page]);

  const hasNextPage =
    pager.page * pager.resultsPerPage <
    (collectionInfo?.total_photos as number);

  useEffect(() => {
    const node = observerRef.current;
    if (!node || !hasNextPage || isLoading || isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPager((prev) => ({ ...prev, page: prev.page + 1 }));
        }
      },
      { threshold: 0.1, rootMargin: "200px" } // Load more before reaching the absolute bottom
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isLoading, isFetching, pager]); // Added pager and isFetching to deps

  // Safely handle possibly undefined collectionPhotos
  const heroPhoto = photos && photos.length > 0 ? photos[0] : undefined;
  const galleryPhotos = photos && photos.length > 1 ? photos.slice(1) : [];

  const standardBreakPoints = { default: 3, 1100: 2, 700: 1 };
  const compactBreakPoints = { default: 4, 1100: 3, 700: 2 };

  if (!collectionInfo || !heroPhoto) {
    return (
      <div className="bg-white min-h-screen">
        <CollectionPageSkeleton />
      </div>
    );
  }

  const tags = Array.isArray(collectionInfo?.tags) ? collectionInfo.tags : [];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative w-full h-[75vh] overflow-hidden">
        {/* Loading spinner or skeleton while image loads */}
        {!isLoaded && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30">
            <LoadingIndicator isLoading={true} loadingSize="lg" />
          </div>
        )}
        {/* Blurhash placeholder while image loads */}
        {heroPhoto.blur_hash && !isLoaded && (
          <div className="absolute inset-0 z-0">
            <Blurhash hash={heroPhoto.blur_hash} width="100%" height="100%" />
          </div>
        )}
        <Image
          src={heroPhoto?.urls?.raw ?? ""}
          alt={collectionInfo.title ?? ""}
          blurDataURL={heroPhoto.blur_hash ? heroPhoto.blur_hash : undefined}
          placeholder={heroPhoto.blur_hash ? "blur" : "empty"}
          fill
          className="object-cover w-full h-full z-10"
          priority
          onLoad={() => setIsLoaded(true)}
        />

        {/* --- Gradual Blur and Darkening Overlays (Corrected) --- */}

        {/* 1. Blur Layer (bottom 1/3 only) */}
        <div
          className="absolute bottom-0 left-0 w-full h-3/5 z-20 pointer-events-none"
          style={{
            // The blur is applied here to only the bottom 1/3 of the image.
            backdropFilter: 'blur(100px)', // Adjust blur intensity as needed
            WebkitBackdropFilter: 'blur(100px)', // For Safari compatibility
            // Clip the blur to make it appear to fade in.
            // This gradient serves as a mask for the backdrop-filter.
            // The blur will only be visible where the mask is opaque.
            maskImage: `linear-gradient(to top, black 0%, transparent 100%)`,
            WebkitMaskImage: `linear-gradient(to top, black 0%, transparent 100%)`,
          }}
        />

        {/* 2. Darkening Gradient Layer (bottom 1/3 only, slightly extends for blend) */}
        <div
          className="absolute bottom-0 left-0 w-full h-2/5 z-20 pointer-events-none" /* Slightly larger to blend */
          style={{
            // This gradient creates the darkening effect and helps to hide the blur edge.
            background: `linear-gradient(
              to top,
              rgba(0,0,0,0.8) 0%,           /* Full dark at bottom */
              rgba(0,0,0,0.5) 60%,          /* Gradually less dark */
              transparent 100%             /* Fully transparent at the top of this layer */
            )`,
          }}
        />

        {/* --- End Gradual Blur and Darkening Overlays --- */}


        {/* Content (text remains sharp) */}
        <div className="absolute bottom-0 left-0 w-full flex items-end min-h-[30vh] pointer-events-none z-30">
          <div className="relative w-full min-h-[30vh]">
            <div className="relative z-10 p-4 md:p-6 w-full">
              <div className="pl-2 md:pl-6">
                <Link
                  href="/collections"
                  className="pointer-events-auto px-2 md:px-4 py-0.5 md:py-1 rounded-full bg-white/20 text-white text-xs md:text-base font-medium shadow hover:bg-white/30 transition flex items-center gap-1 md:gap-2 mb-4 w-fit backdrop-blur-md"
                >
                  <span className="text-sm md:text-xl">←</span> Back
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
                  <span className="inline-block bg-white/20 text-white text-xs md:text-base font-semibold px-3 md:px-4 md:py-2 py-1 rounded-full backdrop-blur-md shadow">
                    {collectionInfo.total_photos} Photos
                  </span>
                </div>
                <TextAnimate
                  as="h2"
                  animation="blurInUp"
                  by="character"
                  startOnView={false}
                  duration={0.8}
                  className="text-4xl md:text-7xl mb-4 font-medium leading-tight text-white drop-shadow tracking-tighter"
                >
                  {collectionInfo.title}
                </TextAnimate>
                {/* <p className="mb-2 text-sm md:text-2xl text-gray-300 font-light drop-shadow w-11/12 md:w-3/4">
                  {collectionInfo.description} A desert-edge editorial shoot
                  blending natural beauty with bold, freckled character. Shot at
                  golden hour to highlight texture, emotion, and movement in an
                  untamed landscape.
                </p> */}
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
        <div className="flex justify-between items-center mb-6">
          <div className="text-xs md:text-sm text-gray-500">
            <p>
              Showing {photos.length} photos from {collectionInfo?.total_photos}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setIsCompact(false)}
              className={`p-1.5 rounded-md transition-all ${!isCompact
                ? "bg-white shadow-sm text-black"
                : "text-gray-400 hover:text-gray-600"
                }`}
              title="Standard View"
            >
              <BsLayoutThreeColumns size={18} />
            </button>
            <button
              onClick={() => setIsCompact(true)}
              className={`p-1.5 rounded-md transition-all ${isCompact
                ? "bg-white shadow-sm text-black"
                : "text-gray-400 hover:text-gray-600"
                }`}
              title="Compact View"
            >
              <HiOutlineViewGrid size={18} />
            </button>
          </div>
        </div>

        <ImageGallery
          photos={galleryPhotos}
          breakPoints={isCompact ? compactBreakPoints : standardBreakPoints}
        />
      </div>
      {hasNextPage && <div ref={observerRef} className="h-10 w-full" />}
    </div>
  );
};
export default Page;