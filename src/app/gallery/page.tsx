"use client";

import { useGetUserPhotos } from "@/apis/generated/unsplashApi";
import { APP_CONFIG } from "@/constants/app";
import { Pager } from "@/models/Pagination";
import { useState, useMemo } from "react";
import ImageGallery from "@/components/images/ImageGallery";
import { ColorFilterBar } from "@/components/images/ColorFilterBar";
import { getColorCategory, ColorCategory } from "../utils/colorUtils";
import { motion, AnimatePresence } from "framer-motion";
import LoadingIndicator from "@/components/loading/LoadingIndicator";
import GradientText from "@/components/text/GradientText";

const GalleryPage = () => {
  const [selectedColor, setSelectedColor] = useState<ColorCategory>("All");
  const [pager] = useState<Pager>({
    page: 1,
    resultsPerPage: 40, // Increased to provide more photos for filtering
  });

  const { data: photos = [], isLoading } = useGetUserPhotos(
    APP_CONFIG.unsplash.username,
    {
      page: pager.page,
      per_page: pager.resultsPerPage,
      order_by: "latest",
      stats: true,
    },
  );

  const filteredPhotos = useMemo(() => {
    if (selectedColor === "All") return photos;
    return photos.filter(
      (photo) => getColorCategory(photo.color || "") === selectedColor,
    );
  }, [photos, selectedColor]);

  return (
    <div className="w-full bg-background text-foreground min-h-screen px-4 md:px-8 py-10">
      <ColorFilterBar
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <LoadingIndicator isLoading={true} loadingSize="lg" />
          <p className="mt-4 text-gray-400 font-medium animate-pulse">
            Developing photos...
          </p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedColor}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {filteredPhotos.length > 0 ? (
              <ImageGallery photos={filteredPhotos} showPhotoStats={true} />
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl">
                <p className="text-xl text-gray-400">
                  No photos found in the{" "}
                  <span className="font-bold text-black">{selectedColor}</span>{" "}
                  spectrum yet.
                </p>
                <button
                  onClick={() => setSelectedColor("All")}
                  className="mt-6 text-black border-b-2 border-black font-bold uppercase text-sm tracking-wider"
                >
                  View All Photos
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default GalleryPage;
