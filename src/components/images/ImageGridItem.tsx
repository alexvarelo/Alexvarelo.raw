import { useRouter } from "next/navigation";
import { FunctionComponent, useState } from "react";
import { Blurhash } from "react-blurhash";
import PhotoStatsOverlay from "./PhotoStatsOverlay";

interface ImageGridItemProps {
  image: Photo;
  showPhotoStats?: boolean;
}

const ImageGridItem: FunctionComponent<ImageGridItemProps> = ({
  image,
  showPhotoStats = false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();
  const handleImageClick = (photoId: string) => {
    router.push(`/image/${photoId}`);
  };

  return (
    <div
      className="relative group overflow-hidden"
      onClick={() => handleImageClick(image.id)}
    >
      {image.blur_hash && !imageLoaded && (
        <div className="absolute inset-0">
          <Blurhash hash={image.blur_hash} width="100%" height="100%" />
        </div>
      )}
      <img
        style={{ cursor: "pointer" }}
        className={`images rounded transition-transform duration-500 ${
          showPhotoStats
            ? "group-hover:scale-105 group-hover:brightness-75"
            : "group-hover:scale-105"
        }`}
        src={image.urls.regular}
        alt={image.description}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
      />

      <PhotoStatsOverlay
        image={image}
        show={showPhotoStats}
      />
    </div>
  );
};

export default ImageGridItem;
