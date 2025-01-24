import { useRouter } from "next/navigation";
import { FunctionComponent, useState } from "react";
import { Blurhash } from "react-blurhash";

interface ImageGridItemProps {
  image: Photo;
}

const ImageGridItem: FunctionComponent<ImageGridItemProps> = ({ image }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();
  const handleImageClick = (photoId: string) => {
    router.push(`/image/${photoId}`);
  };

  return (
    <div className="relative" onClick={() => handleImageClick(image.id)}>
      {image.blur_hash && !imageLoaded && (
        <div className="absolute inset-0">
          <Blurhash hash={image.blur_hash} width="100%" height="100%" />
        </div>
      )}
      <img
        style={{ cursor: "pointer" }}
        className="images rounded"
        src={image.urls.regular}
        alt={image.description}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
};

export default ImageGridItem;
