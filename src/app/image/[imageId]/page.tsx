"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useImageNavigation } from "@/contexts/ImageNavigationContext";
import ImageDetailSkeleton from "@/components/skeletons/ImageDetailSkeleton";
import { ImageNavigationButtons } from "@/components/shared/ImageNavigationButtons";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { NumberTicker } from "@/components/shared/NumberTicker";
import { Badge } from "@/components/shared/Badge";
import { Blurhash } from "react-blurhash";
import { cn } from "@/lib/utils";
import {
  FaApple,
  FaCamera,
  FaClock,
  FaInfoCircle,
  FaRuler,
  FaSun,
} from "react-icons/fa";
import { HiOutlineArrowLeft, HiOutlineLocationMarker } from "react-icons/hi";
import { BsDownload, BsEye } from "react-icons/bs";
import { IoStatsChartOutline } from "react-icons/io5";
import { MdOutlineDateRange } from "react-icons/md";
import {
  useGetPhotoDetails,
  usePhotoStatistics,
} from "@/apis/generated/unsplashApi";

interface PageProps {
  params: { imageId: string };
}

const ImageDetail: React.FC<PageProps> = ({ params }) => {
  const router = useRouter();
  const { navigation } = useImageNavigation();
  const nextImageId = navigation.nextImage[params.imageId];
  const prevImageId = navigation.prevImage[params.imageId];

  const { data: photo, isLoading: isLoadingPhoto } = useGetPhotoDetails(params.imageId);
  const { data: photoStats, isLoading: isLoadingStats } = usePhotoStatistics(params.imageId);

  const [isLoaded, setIsLoaded] = React.useState(false);

  const handleNavigation = (direction: "next" | "prev") => {
    const imageId = direction === "next" ? nextImageId : prevImageId;
    if (imageId) {
      router.push(`/image/${imageId}`);
    }
  };

  if (isLoadingPhoto || !photo) return <ImageDetailSkeleton isVertical={false} />;

  const highlightClass = "text-gold font-bold";
  const imageIsVertical = (photo.height ?? 0) > (photo.width ?? 0);

  return (
    <div className="min-h-screen bg-base-100">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full relative"
      >
        {/* Unified Minimal Floating Controls */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 p-2 bg-base-100/80 backdrop-blur-xl rounded-full shadow-2xl border border-base-content/10 pointer-events-auto transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            onClick={() => router.back()}
            className="p-2.5 rounded-full hover:bg-base-content/5 text-base-content/60 hover:text-base-content transition-all"
            title="Go Back"
          >
            <HiOutlineArrowLeft size={18} />
          </button>

          <div className="w-px h-6 bg-base-content/10 mx-1" />

          <ImageNavigationButtons
            onPrevClick={() => handleNavigation("prev")}
            onNextClick={() => handleNavigation("next")}
            prevDisabled={!prevImageId}
            nextDisabled={!nextImageId}
          />

          <div className="w-px h-6 bg-base-content/10 mx-1" />

          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = photo.urls?.raw ?? "";
              link.download = `${photo.id}.jpg`;
              link.click();
            }}
            className="flex items-center gap-2 p-2.5 px-4 rounded-full bg-base-content text-base-100 hover:opacity-90 transition-all font-bold text-xs uppercase tracking-widest"
          >
            <BsDownload size={16} />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>

        {/* Layout Grid: Sticky Image | Scrollable Info */}
        <div className="lg:grid lg:grid-cols-[1fr,340px] h-[calc(100vh-76px)]">

          {/* Left Side: Immersive Image (Sticky) */}
          <div className="lg:sticky lg:top-0 h-[60vh] lg:h-[calc(100vh-76px)] flex items-center justify-center p-4 md:p-8 lg:p-12 bg-base-100 overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center">
              {photo.blur_hash && !isLoaded && (
                <div className="absolute inset-0">
                  <Blurhash hash={photo.blur_hash} width="100%" height="100%" />
                </div>
              )}
              <Image
                src={photo.urls?.regular ?? ""}
                alt={photo.alt_description ?? ""}
                className={cn(
                  "object-contain w-full h-full transition-all duration-1500 ease-out",
                  isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-98"
                )}
                priority
                fill
                onLoad={() => setIsLoaded(true)}
              />
            </div>
          </div>

          {/* Right Side: Sophisticated Sidebar */}
          <div className="bg-base-100 p-5 md:p-6 lg:p-8 flex flex-col justify-between overflow-y-auto lg:h-[calc(100vh-76px)]">
            <div className="space-y-6">

              {/* Header Info */}
              <div className="space-y-3 pt-6 md:pt-8 lg:pt-10">
                <div className="flex items-center gap-2 text-base-content/60">
                  <HiOutlineLocationMarker size={12} />
                  <span className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold">
                    {photo.location?.name ?? "Global Perspective"}
                  </span>
                </div>
                <h1 className="text-3xl md:text-3xl lg:text-4xl font-normal tracking-tight text-base-content leading-tight">
                  {photo.description || photo.alt_description || "Minimal Untitled"}
                </h1>

                <div className="flex items-center gap-3 pt-1">
                  <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-base-content/70 border border-base-content/10">
                    {photo?.exif?.make?.toLowerCase().includes("apple") ? (
                      <FaApple size={18} />
                    ) : (
                      <FaCamera size={18} />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] md:text-[10px] text-base-content/60 uppercase tracking-widest font-bold">Equipment</p>
                    <p className="text-sm font-semibold text-base-content leading-none">{photo.exif?.model ?? "Fine Grain Optical"}</p>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-3 pt-5">
                <h3 className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold text-base-content/60">Technical Data</h3>
                <div className="grid grid-cols-2 gap-y-4">
                  {[
                    { label: "Aperture", value: photo.exif?.aperture ? `ƒ/${photo.exif.aperture}` : "—" },
                    { label: "Shutter", value: photo.exif?.exposure_time ? `${photo.exif.exposure_time}s` : "—" },
                    { label: "Focal", value: photo.exif?.focal_length ? `${photo.exif.focal_length}mm` : "—" },
                    { label: "ISO", value: photo.exif?.iso ?? "—" },
                  ].map((spec, i) => (
                    <div key={i} className="space-y-0.5">
                      <p className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-base-content/60">{spec.label}</p>
                      <p className="text-base md:text-lg font-medium text-base-content tabular-nums tracking-tighter">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Stats - Single Row */}
              <div className="space-y-3 pt-5">
                <h3 className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold text-base-content/60">Engagement</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-0.5 pb-1.5">
                    <div className="flex justify-between items-center">
                      <p className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-base-content/60">Views</p>
                      <BsEye size={12} className="text-base-content/40" />
                    </div>
                    <NumberTicker
                      value={photoStats?.views?.total ?? 0}
                      cssWrapper="text-lg md:text-xl font-bold text-base-content tracking-tighter"
                    />
                  </div>
                  <div className="space-y-0.5 pb-1.5">
                    <div className="flex justify-between items-center">
                      <p className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-base-content/60">Gets</p>
                      <BsDownload size={12} className="text-base-content/40" />
                    </div>
                    <NumberTicker
                      value={photoStats?.downloads?.total ?? 0}
                      cssWrapper="text-lg md:text-xl font-bold text-base-content tracking-tighter"
                    />
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              <div className="space-y-4 pt-6 pb-6">
                <h3 className="text-[11px] md:text-xs uppercase tracking-[0.2em] font-bold text-base-content/60">Keywords</h3>
                <div className="flex flex-wrap gap-x-3 gap-y-2">
                  {(photo.tags ?? []).map((tag, indx) => (
                    <span key={indx} className="text-[10px] md:text-[11px] uppercase tracking-[0.1em] font-bold text-base-content/60 hover:text-base-content cursor-default transition-colors">
                      {tag.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer-like Info */}
            <div className="pt-8 pb-6 mt-4">
              <div className="flex justify-between items-center text-[10px] md:text-[11px] uppercase tracking-widest font-bold text-base-content/60">
                <span>Archived</span>
                <span className="text-base-content/80 italic font-semibold">
                  {photo.created_at ? new Date(photo.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>


      </motion.div>
    </div>
  );
};

export default ImageDetail;
