import { useEffect } from "react";
import Masonry from "react-masonry-css";
import ImageGridItem from "./ImageGridItem";
import { useImageNavigation } from "@/contexts/ImageNavigationContext";
import { Photo } from "@/apis/generated/model";
import { motion } from "framer-motion";

interface ImageGalleryProps {
  photos: any[];
  showPhotoStats?: boolean;
  breakPoints?: {
    default: number;
    [key: number]: number;
  };
}

const ImageGallery = ({ photos, showPhotoStats = false, breakPoints }: ImageGalleryProps) => {
  const { setImageNavigation } = useImageNavigation();
  const defaultBreakPoints = {
    default: 3,
    1100: 2,
    700: 2,
  };
  const galleryBreakPoints = breakPoints || defaultBreakPoints;

  useEffect(() => {
    if (photos.length) {
      setImageNavigation(photos);
    }
  }, [photos]);

  return (
    <div>
      <Masonry
        breakpointCols={galleryBreakPoints}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {photos.map((image, idx) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: idx * 0.07, ease: "easeOut" }}
          >
            <ImageGridItem image={image} showPhotoStats={showPhotoStats} />
          </motion.div>
        ))}
      </Masonry>
    </div>
  );
};

export default ImageGallery;
