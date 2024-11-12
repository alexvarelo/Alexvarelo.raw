"use client";
import { AvailableApis } from "@/apis/apis";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FunctionComponent, useEffect, useState } from "react";
import Image from "next/image";
import { Collection } from "@/models/Collections";
import ImageGallery from "@/components/images/ImageGallery";

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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-14 mt-5">{collectionInfo?.title}</h2>
      <p>{collectionInfo?.description}</p>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >

      <ImageGallery photos={collectionPhotos} />
      </motion.div>
    </div>
  );
};

export default CollectionPage;
