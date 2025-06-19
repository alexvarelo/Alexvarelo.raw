"use client";
import { useGetUserCollections } from "@/apis/generated/unsplashApi";
import { APP_CONFIG } from "@/constants/app";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Settings } from "lucide-react";
import { Collection } from "@/apis/generated/model";
import { Badge } from "@/components/shared/Badge";
import { TextAnimate } from "@/components/magicui/text-animate";

const Collections = () => {
  const { data: collections = [] } = useGetUserCollections(
    APP_CONFIG.unsplash.username
  );
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const goToCollection = (id: string) => {
    router.push(`/collections/${id}`);
  };

  // Animation variants for the heading
  const headingVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
      x: -20,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  // Animation variants for the collections
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="pt-4 md:pt-10">
        {/* Hero Section */}
        <section className="mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={headingVariants}
            className={`transition-all duration-1000 ease-out`}
          >
            <span className="inline-block bg-gray-100 text-gray-800 md:text-xl text-sm font-semibold mr-2 px-3 py-1 rounded-full">
              Portfolio
            </span>
            <TextAnimate
              as="h2"
              animation="blurInUp"
              by="character"
              duration={0.8}
              className="text-4xl md:text-5xl lg:text-7xl mb-4 md:mb-8 font-semibold mt-4 md:mt-5 tracking-tight"
            >
              Browse my work
            </TextAnimate>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-sm md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed px-4 md:px-0"
            >
              Each frame tells a story, capturing genuine moments that showcase
              my style and vision. Browse through my favorite collections.
            </motion.p>
          </motion.div>
        </section>

        {/* Collections Grid */}
        <section className="max-w-7xl mx-auto py-8 md:py-10 px-0 md:px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            className="space-y-6 md:space-y-8"
          >
            {collections.map((collection, index) => (
              <motion.div
                key={collection.id as string}
                variants={itemVariants}
                className="group block cursor-pointer"
                onMouseEnter={() => setHoveredItem(collection.id as string)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => goToCollection(collection.id)}
              >
                <div
                  className={`relative overflow-hidden rounded-lg transition-all duration-700 ease-out`}
                >
                  <div className="aspect-[2/1] relative">
                    {collection.cover_photo?.urls?.raw && (
                      <Image
                        src={collection.cover_photo.urls.raw as string}
                        alt={(collection.title as string) || ""}
                        fill
                        className={`w-full h-full object-cover transition-all duration-500 ease-out cursor-pointer ${
                          hoveredItem === collection.id
                            ? "scale-110"
                            : "scale-100"
                        }`}
                        sizes="(max-width: 768px) 100vw, 1200px"
                      />
                    )}

                    {/* Camera Focus Effect */}
                    <div
                      className={`absolute inset-0 pointer-events-none transition-all duration-500 ease-out ${
                        hoveredItem === collection.id
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      {/* Four L-shaped corners */}
                      {/* <div className="absolute top-4 left-4 w-6 h-6">
                        <div className="w-full h-0.5 bg-white/80" />
                        <div className="h-full w-0.5 bg-white/80" />
                      </div>
                      <div className="absolute top-4 right-4 w-6 h-6">
                        <div className="w-full h-0.5 bg-white/80" />
                        <div className="absolute right-0 h-full w-0.5 bg-white/80" />
                      </div>
                      <div className="absolute bottom-4 left-4 w-6 h-6">
                        <div className="w-full h-0.5 bg-white/80 absolute bottom-0" />
                        <div className="h-full w-0.5 bg-white/80" />
                      </div>
                      <div className="absolute bottom-4 right-4 w-6 h-6">
                        <div className="w-full h-0.5 bg-white/80 absolute bottom-0" />
                        <div className="absolute right-0 h-full w-0.5 bg-white/80" />
                      </div> */}

                      {/* Center focus circle with plus sign */}
                      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                        <div className="w-28 h-28 rounded-full bg-white/30 flex items-center justify-center">
                          <span className="text-5xl text-white font-extrabold select-none">
                            +
                          </span>
                        </div>
                      </div> */}

                      {/* EXIF Information in top-left */}
                      <div className="absolute top-4 left-4 flex flex-col items-start space-y-1 text-white/90 text-xs md:text-sm font-mono px-3 py-2 rounded-md backdrop-blur-sm">
                        <div>
                          <span className="font-semibold">ƒ/</span>
                          <span>
                            {collection.cover_photo?.exif?.aperture || "2.8"}
                          </span>
                        </div>
                        <div>
                          <span>
                            {collection.cover_photo?.exif?.focal_length ||
                              "50mm"}
                          </span>
                        </div>
                        <div>
                          <span>
                            {collection.cover_photo?.exif?.exposure_time ||
                              "1/125"}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold">ISO</span>{" "}
                          {collection.cover_photo?.exif?.iso || "100"}
                        </div>
                      </div>
                    </div>

                    {/* Overlay */}
                    <div
                      className={`absolute inset-0 bg-black/50 transition-all duration-500 ease-out ${
                        hoveredItem === collection.id
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />

                    {/* Category Badge */}
                    <div className="absolute top-4 md:top-6 right-4 md:right-6">
                      <span
                        className={`inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 rounded-full text-sm md:text-md font-medium bg-white/20 text-white backdrop-blur-sm transition-all duration-300 ${
                          hoveredItem === collection.id
                            ? "translate-y-0 opacity-100"
                            : "translate-y-1 opacity-0"
                        }`}
                      >
                        {collection.total_photos} Photos
                      </span>
                    </div>

                    {/* Bottom Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                      <div className="flex justify-between items-end">
                        <div className="text-white">
                          <h3 className="text-xl md:text-3xl lg:text-4xl font-semibold mb-1">
                            {collection.title as string}
                          </h3>
                          <p className="text-xs md:text-sm opacity-90">
                            Collection
                          </p>
                        </div>
                        <div className="text-white text-right">
                          <p className="text-xs md:text-md opacity-90">
                            {new Date(
                              collection.published_at
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA Section */}
        {/* <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24 text-center"
        >
          <div className="space-y-6 md:space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-light text-gray-900 leading-tight">
              Let's create something
              <br />
              beautiful together
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
              Interested in working together? Let's discuss how we can bring
              your vision to life through photography that captures the essence
              of your story.
            </p>
            <button className="bg-black text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full hover:bg-gray-800 transition-all duration-200 font-medium text-sm md:text-base">
              Get in touch
            </button>
          </div>
        </motion.section> */}
      </main>
    </div>
  );
};

export default Collections;
