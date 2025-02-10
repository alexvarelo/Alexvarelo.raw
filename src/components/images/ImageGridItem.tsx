import { useRouter } from "next/navigation";
import { FunctionComponent, useState } from "react";
import { Blurhash } from "react-blurhash";

interface ImageGridItemProps {
  image: Photo;
  showPhotoStats?: boolean;
}

const ImageGridItem: FunctionComponent<ImageGridItemProps> = ({ image, showPhotoStats = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();
  const handleImageClick = (photoId: string) => {
    router.push(`/image/${photoId}`);
  };

  return (
    <div className="relative group overflow-hidden" onClick={() => handleImageClick(image.id)}>
      {image.blur_hash && !imageLoaded && (
        <div className="absolute inset-0">
          <Blurhash hash={image.blur_hash} width="100%" height="100%" />
        </div>
      )}
      <img
        style={{ cursor: "pointer" }}
        className={`images rounded transition-transform duration-500 ${
          showPhotoStats ? 'group-hover:scale-105 group-hover:brightness-75' : 'group-hover:scale-105'
        }`}
        src={image.urls.regular}
        alt={image.description}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
      />
      
      {showPhotoStats && (
        <div className="absolute bottom-0 left-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span>{image.likes || 0}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>{image.liked_by_user || 0}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGridItem;
