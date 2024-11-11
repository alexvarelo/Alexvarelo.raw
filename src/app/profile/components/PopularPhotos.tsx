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
          <Image
            src={photo?.urls.regular}
            alt={photo?.description}
            objectFit="cover"
            width={300}
            height={300}
          />
        </div>
      ))}
    </div>
  );
};

export default PopularPhotos;
