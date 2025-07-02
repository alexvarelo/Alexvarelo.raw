import React from "react";

const SkeletonBox = ({ className = "" }: { className?: string }) => (
  <div className={`bg-gray-200/60 animate-pulse rounded ${className}`} />
);

const CollectionPageSkeleton: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section Skeleton */}
      <div className="relative w-full h-[75vh] overflow-hidden">
        {/* Simulate the dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        {/* Simulate the hero image area */}
        <SkeletonBox className="absolute inset-0 w-full h-full" />
        {/* Content Skeleton */}
        <div className="absolute bottom-0 left-0 w-full flex items-end min-h-[30vh] pointer-events-none">
          <div className="relative w-full">
            <div className="relative z-10 p-4 md:p-6 w-full">
              <div className="pl-2 md:pl-6">
                {/* Back button skeleton */}
                <SkeletonBox className="w-20 h-7 md:w-28 md:h-8 mb-4" />
                {/* Date and photos badge skeleton */}
                <div className="flex items-center gap-4 mb-4 mt-2">
                  <SkeletonBox className="w-24 h-6 md:w-32 md:h-7" />
                  <SkeletonBox className="w-20 h-6 md:w-28 md:h-7 rounded-full" />
                </div>
                {/* Title skeleton */}
                <SkeletonBox className="w-2/3 h-10 md:h-16 mb-4" />
                {/* Description skeleton */}
                <SkeletonBox className="w-3/4 h-6 md:h-8 mb-2" />
                {/* Tag skeletons */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <SkeletonBox key={i} className="w-16 h-6 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Grid Gallery Skeleton */}
      <div className="max-w-full mx-auto md:pt-10 pt-5 md:px-6 px-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <SkeletonBox key={i} className="w-full h-60 md:h-72 rounded-lg" />
        ))}
      </div>
    </div>
  );
};

export default CollectionPageSkeleton; 