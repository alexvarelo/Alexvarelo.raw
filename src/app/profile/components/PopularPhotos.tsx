import { AvailableApis } from "@/apis/apis";
import { FunctionComponent, useEffect, useState } from "react";

interface PopularPhotosProps {}

const PopularPhotos: FunctionComponent<PopularPhotosProps> = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    AvailableApis.fetchUserPhotos(1, 5, "oldest").then(setPhotos);
  }, []);
  return (
    <div className="carousel rounded-box">
      {photos.map((photo) => (
        <div className="carousel-item" key={photo?.id}>
          <img
            src={photo?.urls.small}
            alt={photo?.description}
          />
        </div>
      ))}
    </div>
  );
};

export default PopularPhotos;
