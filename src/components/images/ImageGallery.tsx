import Masonry from "react-masonry-css";

const ImageGallery: React.FC<{ photos: Photo[] }> = ({ photos }) => {
  const breakPoints = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <div>
      <Masonry
        breakpointCols={breakPoints}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {photos.map((image) => (
          <div key={image.id}>
            <img
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