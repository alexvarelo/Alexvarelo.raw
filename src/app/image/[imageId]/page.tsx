"use client"
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { AvailableApis } from "@/apis/apis";
import { ImageStats } from "@/models/Statistics";
import Image from "next/image";
import BlurIn from "@/components/ui/BlurIn";
import { FaApple, FaCamera, FaClock, FaRuler, FaSun } from "react-icons/fa";
import { BsTag } from "react-icons/bs";
import { PhotoDetails } from "@/models/PhotoDetails";

const ImageDetail: React.FC<any> = ({ params }) => {
  const [photo, setPhoto] = useState<PhotoDetails | null>(null);
  const [photoStats, setphotoStats] = useState<ImageStats | null>(null);

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
        setphotoStats(result);
      }
    };

    fetchImageData();
    fetchImageStats();
  }, [params]);

  if (!photo) return <div>Loading...</div>;

  return (





    
    <div className="p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2 }}
      >
        <div className="flex justify-center items-center p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full h-[800px] md:h-[600px] bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="relative col-span-4 md:col-span-2">
              <Image
                src={photo?.urls.regular}
                alt={photo?.alt_description as string}
                fill
                className="object-cover"
                objectFit="cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent">
                <BlurIn>
                  <div className="absolute inset-0 flex items-start justify-start pl-6 pt-4">
                    <h2 className="text-lg md:text-2xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500 opacity-100">
                      {photo?.description}
                    </h2>
                  </div>
                </BlurIn>
              </div>
            </div>

            <div className="p-4 md:p-6 col-span-1">
              <h2 className="text-md md:text-lg font-bold mb-2 md:mb-4">
                {photo.alt_description}
              </h2>

              <ul className="space-y-1 md:space-y-2 text-sm text-gray-700">
                <li className="flex items-center space-x-2">
                  {photo?.exif?.make?.toLowerCase().includes("apple") ? (
                    <FaApple className="text-gray-500" />
                  ) : (
                    <FaCamera />
                  )}
                  <span>{photo.exif.make}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <BsTag className="text-gray-500" />
                  <span>{photo.exif.model}</span>
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
                  {new Date(photo.created_at).toDateString()}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ImageDetail;