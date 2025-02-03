import { useEffect } from "react";
import Masonry from "react-masonry-css";
import ImageGridItem from "./ImageGridItem";
import { useImageNavigation } from "@/contexts/ImageNavigationContext";

const ImageGallery: React.FC<{ photos: Photo[] }> = ({ photos }) => {
  const { setImageNavigation } = useImageNavigation();
  const breakPoints = {
    default: 3,
    1100: 2,
    700: 2,
  };

  useEffect(() => {
    if (photos.length) {
      setImageNavigation(photos);
    }
  }, [photos]);

  return (
    <div>
      <Masonry
        breakpointCols={breakPoints}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {photos.map((image) => (
          <ImageGridItem image={image} key={image.id} />
        ))}
      </Masonry>
    </div>
  );
};

export default ImageGallery;
