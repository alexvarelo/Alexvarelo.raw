import { useRouter } from "next/navigation";
import Masonry from "react-masonry-css";

const ImageGallery: React.FC<{ photos: Photo[] }> = ({ photos }) => {
  const router = useRouter();
  const breakPoints = {
    default: 4,
    1100: 2,
    700: 2,
  };

  const handleImageClick = (photoId: string) => {
    router.push(`/image/${photoId}`); // Adjust route if needed
  };

  return (
    <div>
      <Masonry
        breakpointCols={breakPoints}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {photos.map((image) => (
          <div key={image.id} onClick={() => handleImageClick(image.id)}>
            <img
              style={{ cursor: "pointer" }}
              className="images"
              src={image.urls.regular}
              alt={image.description}
            />
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default ImageGallery;
