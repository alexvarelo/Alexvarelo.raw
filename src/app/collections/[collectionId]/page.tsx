"use client";
import { AvailableApis } from "@/apis/apis";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FunctionComponent, useEffect, useState } from "react";
import Image from "next/image";
import { Collection } from "@/models/Collections";

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
  }, []);
  return (
    <div>
      <h2 className="text-4xl font-bold mb-20 mt-10">{collectionInfo?.title}</h2>
      <p>{collectionInfo?.description}</p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-2"
      >
        {collectionPhotos.map((photo) => (
          <div key={photo.id} className="relative overflow-hidden group">
            <Image
              src={photo.urls.regular}
              alt={photo.alt_description}
              blurDataURL={photo.blur_hash}
              layout="responsive"
              objectFit="cover"
              loading="lazy"
              placeholder={photo.blur_hash ? "blur" : "empty"}
              width={800}
              height={800}
              className="transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default CollectionPage;
