import { useRouter } from "next/navigation";
import { FC } from "react";
import Image from "next/image";
import { AvailableApis } from "@/apis/apis";

interface ImageLayoutProps {
  photo: Photo;
}

const ImageLayout: FC<ImageLayoutProps> = ({ photo }) => {
  const router = useRouter();

  const handleImageClick = (photoId: string) => {
    router.push(`/image/${photoId}`); // Adjust route if needed
  };

  const downloadPhoto = async (photoId: string) => {
    const result = await AvailableApis.downloadPhoto(photoId);
    if (result?.url) {
      const link = document.createElement("a");
      link.href = result.url;
      link.download = `photo-${photoId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("Error downloading photo: No URL returned");
    }
  };

  return (
    <div
      key={photo.id}
      className="relative w-full h-96 overflow-hidden group"
      onClick={() => handleImageClick(photo.id)}
    >
      <Image
        src={photo.urls.regular}
        alt={photo.alt_description}
        blurDataURL={photo.blur_hash}
        layout="fill"
        objectFit="cover"
        loading="lazy"
        placeholder={photo.blur_hash ? "blur" : "empty"}
        className="transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => downloadPhoto(photo.id)}
          className="bg-gray-800 bg-opacity-50 text-white p-2 rounded hover:bg-gray-700 hover:bg-opacity-70 focus:outline-none" // Rounded (not rounded-full) and semi-transparent background
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ImageLayout;
