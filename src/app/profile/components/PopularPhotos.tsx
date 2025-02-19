import { AvailableApis } from "@/apis/apis";
import { useUserPhoto } from "@/contexts/UserPhotoContext";
import { FunctionComponent, useEffect, useState } from "react";

interface PopularPhotosProps {}

const PopularPhotos: FunctionComponent<PopularPhotosProps> = () => {
  const { setUser } = useUserPhoto();
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    AvailableApis.fetchUserPhotos(1, 10, "popular", "portrait").then((result) => {
      setPhotos(result);
      setUser(result[0].user);
    });
  }, []);
  return (
    <div className="carousel rounded-box mt-5">
      {photos?.map((photo) => (
        <div className="carousel-item" key={photo?.id}>
          <img
            src={photo?.urls.regular}
            alt={photo?.description}
            className=" w-[300px] h-[500px] sm:w-[500px] sm:h-[600px] object-cover rounded"
          />
        </div>
      ))}
    </div>
  );
};

export default PopularPhotos;
