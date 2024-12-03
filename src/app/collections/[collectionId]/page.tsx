"use client";
import { AvailableApis } from "@/apis/apis";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Collection } from "@/models/Collections";
import ImageGallery from "@/components/images/ImageGallery";

interface BadgeProps {
  text: string;
}

const Badge: React.FC<BadgeProps> = ({ text }) => {

  const capitalizedText = text.charAt(0).toUpperCase() + text.slice(1);
  return (
    <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
      {capitalizedText}
    </span>
  );
};

const CollectionPage: React.FC<any> = ({ params }) => {
  const [collectionPhotos, setcollectionPhotos] = useState<Photo[]>([]);

  const [collectionInfo, setcollectionInfo] = useState<Collection>();

  useEffect(() => {
    AvailableApis.fetchCollectionPhotos(params?.collectionId).then((x) =>
      setcollectionPhotos(x)
    );

    AvailableApis.fetchCollection(params?.collectionId).then((x) =>
      setcollectionInfo(x)
    );
  }, [params?.collectionId]);

  if (!collectionInfo) {
    return <div>Is loading...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mt-5 mb-2">{collectionInfo?.title}</h2>
      <div className="text-xs text-gray-500">
        <p>{collectionInfo?.description}</p>
        <p>{collectionInfo?.total_photos} images</p>
        <p>{new Date(collectionInfo.published_at).toLocaleDateString()}</p>
      </div>

      <div className="mt-5 text-center">
        {collectionInfo.tags.map((tag, indx) => (
          <Badge text={tag.title} key={indx}/>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="pt-7"
      >
        <ImageGallery photos={collectionPhotos} />
      </motion.div>
    </div>
  );
};

export default CollectionPage;
