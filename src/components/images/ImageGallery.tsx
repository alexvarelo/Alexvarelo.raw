import { useRouter } from "next/navigation";
import Masonry from "react-masonry-css";
import { Blurhash } from 'react-blurhash';
import ImageGridItem from "./ImageGridItem";

const ImageGallery: React.FC<{ photos: Photo[] }> = ({ photos }) => {
  const breakPoints = {
    default: 3,
    1100: 2,
    700: 2,
  };


  return (
    <div>
      <Masonry
        breakpointCols={breakPoints}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {photos.map((image) => (
          <ImageGridItem image={image} key={image.id}/>
        ))}
      </Masonry>
    </div>
  );
};

export default ImageGallery;
