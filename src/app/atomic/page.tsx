"use client";

import { AvailableApis } from "@/apis/apis";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

// You can replace this with your actual Atomic collection ID
const ATOMIC_COLLECTION_ID = "NRq5QlrXz0g";

export default function AtomicPage() {
  const [collection, setCollection] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const collectionData = await AvailableApis.fetchCollection(
        ATOMIC_COLLECTION_ID
      );
      const photosData = await AvailableApis.fetchCollectionPhotos(
        ATOMIC_COLLECTION_ID,
        { page: 1, resultsPerPage: 30 }
      );

      setCollection(collectionData);
      setPhotos(photosData);
    };

    fetchData();
  }, []);

  if (!collection || !photos.length) {
    return <div>Loading...</div>;
  }

  // Group photos into spreads of 2-3 images
  const createSpreads = (photos: any[]) => {
    const spreads = [];
    for (let i = 0; i < photos.length; i += 3) {
      spreads.push(photos.slice(i, i + 3));
    }
    return spreads;
  };

  const photoSpreads = createSpreads(photos);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12">
      {/* Cover Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-32 relative h-screen min-h-[600px]"
      >
        <Image
          src={photos[0].urls.regular}
          alt={photos[0].description || "Cover image"}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-7xl md:text-5xl font-bold mb-6">
              {collection.title || "Nature's Gallery"}
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto">
              {collection.description ||
                "A visual journey through remarkable landscapes"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Journal Spreads */}
      {photoSpreads.map((spread, spreadIndex) => (
        <motion.div
          key={spreadIndex}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-32"
        >
          <div className="grid grid-cols-12 gap-4 md:gap-8">
            {spreadIndex % 2 === 0 ? (
              // Layout Type 1
              <>
                <div className="col-span-12 md:col-span-8 relative aspect-[16/9] group overflow-hidden">
                  <Image
                    src={spread[0]?.urls.regular}
                    alt={spread[0]?.description || "Journal image"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {spread[0]?.description && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-white text-lg">
                        {spread[0].description}
                      </p>
                    </div>
                  )}
                </div>
                <div className="col-span-12 md:col-span-4 space-y-6">
                  <h2 className="text-3xl md:text-4xl font-semibold">
                    {spread[0]?.alt_description ||
                      spread[0]?.description ||
                      "Visual Story"}
                  </h2>

                  {spread[1] && (
                    <div className="relative aspect-square mt-8 group overflow-hidden">
                      <Image
                        src={spread[1].urls.regular}
                        alt={spread[1].description || "Journal image"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {spread[1]?.description && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                          <p className="text-white text-sm">
                            {spread[1].description}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Layout Type 2
              <>
                <div className="col-span-12 md:col-span-6 space-y-6">
                  <div className="relative aspect-[4/3] group overflow-hidden">
                    <Image
                      src={spread[0].urls.regular}
                      alt={spread[0].description || "Journal image"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {spread[0]?.description && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                        <p className="text-white text-sm">
                          {spread[0].description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-6 space-y-6">
                  {spread[1] && (
                    <div className="relative aspect-[4/3] group overflow-hidden">
                      <Image
                        src={spread[1].urls.regular}
                        alt={spread[1].description || "Journal image"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {spread[1]?.description && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                          <p className="text-white text-sm">
                            {spread[1].description}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
