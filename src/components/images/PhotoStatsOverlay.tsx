import { FunctionComponent } from "react";
import { BsEye, BsDownload } from "react-icons/bs";
import { AiOutlineLike } from "react-icons/ai";
import { usePhotoStatistics } from "@/apis/generated/unsplashApi";

interface PhotoStatsOverlayProps {
  image: Photo;
  show?: boolean;
}

const PhotoStatsOverlay: FunctionComponent<PhotoStatsOverlayProps> = ({
  image,
  show = false,
}) => {
  // Only trigger the fetch when the overlay is shown (hovered)
  // and we don't already have statistics in the image object.
  const hasStats = !!(
    image.statistics?.views?.total ||
    (image as any).views ||
    (image as any).downloads
  );

  const { data: fetchedStats, isLoading } = usePhotoStatistics(image.id, {
    query: {
      enabled: show && !hasStats,
      staleTime: 1000 * 60 * 5, // Cache stats for 5 minutes
    },
  });

  if (!show) return null;

  const likes = image.likes;
  const views =
    fetchedStats?.views?.total ||
    image.statistics?.views?.total ||
    (image as any).views ||
    0;
  const downloads =
    fetchedStats?.downloads?.total ||
    image.statistics?.downloads?.total ||
    (image as any).downloads ||
    0;

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/60 to-transparent text-white pointer-events-none">
      <div className="flex justify-between items-center text-xs font-medium">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5" title="Views">
            <BsEye className={`w-4 h-4 ${isLoading ? "animate-pulse" : ""}`} />
            <span>
              {isLoading && views === 0 ? "..." : views.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5" title="Downloads">
            <BsDownload
              className={`w-4 h-4 ${isLoading ? "animate-pulse" : ""}`}
            />
            <span>
              {isLoading && downloads === 0 ? "..." : downloads.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5" title="Likes">
          <AiOutlineLike className="w-4 h-4" />
          <span>{likes || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default PhotoStatsOverlay;
