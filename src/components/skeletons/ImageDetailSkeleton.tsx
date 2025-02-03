import { cn } from "@/lib/utils";

const ImageDetailSkeleton = ({ isVertical = false }: { isVertical?: boolean }) => {
  return (
    <div className="p-4 md:p-6 relative animate-pulse">
      <div
        className={cn(
          "flex flex-col h-[calc(100vh-64px)]",
          isVertical && "lg:flex-row"
        )}
      >
        {/* Image skeleton */}
        <div className="flex-1 flex items-center justify-center relative">
          <div className="w-full h-full bg-gray-500 rounded-lg" />
        </div>

        {/* Sidebar skeleton */}
        <div className="flex-1 space-y-6 text-sm lg:pl-10 pt-10">
          <div className="flex items-start justify-between">
            {/* Title skeleton */}
            <div className="h-8 bg-gray-500 rounded w-2/3" />
            {/* Navigation buttons skeleton */}
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-500" />
              <div className="w-10 h-10 rounded-full bg-gray-500" />
            </div>
          </div>

          {/* Camera info skeleton */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-500" />
            <div className="h-4 bg-gray-500 rounded w-1/3" />
          </div>

          {/* Details section skeleton */}
          <div className="flex flex-row justify-between">
            <div className="flex-1 space-y-4">
              {/* Camera settings skeleton */}
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-500" />
                  <div className="h-4 bg-gray-500 rounded w-24" />
                </div>
              ))}
            </div>

            <div className="flex-1 space-y-4">
              {/* Stats skeleton */}
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-500" />
                  <div className="h-4 bg-gray-500 rounded w-20" />
                </div>
              ))}
            </div>
          </div>

          {/* Tags skeleton */}
          <div className="space-y-4">
            <div className="h-6 bg-gray-500 rounded w-20" />
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-500 rounded w-16" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDetailSkeleton;