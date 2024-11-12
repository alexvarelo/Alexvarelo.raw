import { AvailableApis } from "@/apis/apis";
import Image from "next/image";
import { FunctionComponent, useEffect, useState } from "react";

interface PopularPhotosProps {}

const PopularPhotos: FunctionComponent<PopularPhotosProps> = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    AvailableApis.fetchUserPhotos(1, 10, "popular", "portrait").then(setPhotos);
  }, []);
  return (
    <div className="carousel rounded-box mt-5">
      {photos.map((photo) => (
        <div className="carousel-item" key={photo?.id}>
          <img
            src={photo?.urls.regular}
            alt={photo?.description}
            className="w-[300px] h-[400px] object-cover rounded"
          />
        </div>
      ))}
    </div>
  );
};

export default PopularPhotos;
