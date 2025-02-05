"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AvailableApis } from "@/apis/apis";
import { ImageStats } from "@/models/Statistics";
import Image from "next/image";
import { FaApple, FaCamera, FaClock, FaRuler, FaSun } from "react-icons/fa";
import { RiNumbersLine } from "react-icons/ri";
import { BsDownload, BsEye, BsTag } from "react-icons/bs";
import { PhotoDetails } from "@/models/PhotoDetails";
import { NumberTicker } from "@/components/shared/NumberTicker";
import { Badge } from "@/components/shared/Badge";
import { Blurhash } from "react-blurhash";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useImageNavigation } from "@/contexts/ImageNavigationContext";
import ImageDetailSkeleton from "@/components/skeletons/ImageDetailSkeleton";
import { ImageNavigationButtons } from "@/components/shared/ImageNavigationButtons";
import { DownloadButton } from "@/components/shared/DownloadButton";

interface PageProps {
  params: { imageId: string };
}

const ImageDetail: React.FC<PageProps> = ({ params }) => {
  const router = useRouter();
  const [photo, setPhoto] = useState<PhotoDetails | null>(null);
  const [photoStats, setPhotoStats] = useState<ImageStats | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { navigation } = useImageNavigation();

  const nextImageId = navigation.nextImage[params.imageId];
  const prevImageId = navigation.prevImage[params.imageId];

  useEffect(() => {
    const fetchImageData = async () => {
      const result = await AvailableApis.getPhotoDetails(params.imageId);
      if (result) {
        setPhoto(result);
      }
    };

    const fetchImageStats = async () => {
      const result = await AvailableApis.photoStatistics(params.imageId);
      if (result) {
        setPhotoStats(result);
      }
    };

    fetchImageData();
    fetchImageStats();
  }, [params]);

  const handleNavigation = (direction: "next" | "prev") => {
    const imageId = direction === "next" ? nextImageId : prevImageId;
    if (imageId) {
      router.push(`/image/${imageId}`);
    }
  };

  if (!photo) return <ImageDetailSkeleton isVertical={false} />;

  const highlightClass = "text-gold font-bold";

  const imageIsVertical = photo.height > photo.width;

  return (
    <div className="p-4 md:p-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2 }}
      >
        <div
          className={cn(
            "flex flex-col h-[calc(100vh-64px)]",
            imageIsVertical && "lg:flex-row"
          )}
        >
          <div className="flex-1 flex items-center justify-center relative">
            {photo.blur_hash && !isLoaded && (
              <div className="absolute inset-0">
                <Blurhash hash={photo.blur_hash} width="100%" height="100%" />
              </div>
            )}
            <div className="relative w-full h-full">
              <Image
                src={photo.urls.raw}
                alt={photo.alt_description as string}
                className="object-cover"
                priority
                fill
                onLoad={() => setIsLoaded(true)}
              />
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="flex-1 space-y-6 text-sm lg:pl-10 pt-10">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold mb-2">{photo.description}</h2>
                <DownloadButton 
                  url={photo.urls.raw} 
                  filename={`${photo.id}.jpg`}
                />
              </div>
              
              <ImageNavigationButtons
                onPrevClick={() => handleNavigation("prev")}
                onNextClick={() => handleNavigation("next")}
                prevDisabled={!prevImageId}
                nextDisabled={!nextImageId}
              />
            </div>

            <div className="flex items-center gap-2">
              {photo?.exif?.make?.toLowerCase().includes("apple") ? (
                <FaApple className="text-gray-500" />
              ) : (
                <FaCamera />
              )}
              <span>
                {photo.exif.make} {photo.exif.model}
              </span>
            </div>
            <div className="flex flex-row justify-between">
              <div className="flex-1">
                <ul className="space-y-1 md:space-y-2 text-sm text-gray-700">
                  <li className="flex items-center space-x-2 font-bold mb-3">
                    <FaCamera className="text-gray-500" />
                    <span>Camera settings</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <BsTag className="text-gray-500" />
                    <span>{photo.location?.name}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FaCamera className="text-gray-500" />
                    <span>{photo.exif.aperture}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FaRuler className="text-gray-500" />
                    <span>{photo.exif.focal_length}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FaClock className="text-gray-500" />
                    <span>{photo.exif.exposure_time}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FaSun className="text-gray-500" />
                    <span>{photo.exif.iso}</span>
                  </li>
                  <li className="text-xs md:text-sm text-gray-500 mt-2 md:mt-4">
                    {new Date(photo.created_at).toLocaleDateString()}
                  </li>
                </ul>
              </div>
              <div className="flex-1">
                {photoStats && (
                  <div className="text-sm">
                    <li className="flex items-center space-x-2 mb-3">
                      <RiNumbersLine className="text-gray-500" />
                      <span className="font-bold">Statistics</span>
                    </li>
                    <li className="flex items-center space-x-2 mb-1">
                      <BsEye className="text-gray-500" />
                      <span>
                        <NumberTicker
                          value={photoStats.views.total}
                          cssWrapper={
                            photoStats.views.total > 100000
                              ? highlightClass
                              : ""
                          }
                        />
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <BsDownload className="text-gray-500" />
                      <span>
                        <NumberTicker
                          value={photoStats?.downloads?.total ?? 0}
                          cssWrapper={
                            photoStats.downloads.total > 10000
                              ? highlightClass
                              : ""
                          }
                        />
                      </span>
                    </li>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="mb-4 flex items-center gap-2">
                <BsTag className="h-4 w-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {photo.tags.map((tag, indx) => (
                  <Badge key={indx} text={tag.title} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ImageDetail;
