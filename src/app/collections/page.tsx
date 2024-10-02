"use client";
import { AvailableApis } from "@/apis/apis";
import PhotoCard from "@/components/dataDisplay/PhotoCard";
import { Collection } from "@/models/Collections";
import { useEffect, useState } from "react";

const Collections = () => {
  const [collections, setcollections] = useState<Collection[]>([]);
  useEffect(() => {
    AvailableApis.fetchUserCollections().then((x) => setcollections(x));
  }, []);
  return (
    <div className="container mx-auto p-2">
      <h2 className="text-2xl font-bold mb-10 mt-10">My photo collections</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {collections.map((col) => (
          <PhotoCard
            key={col.id}
            imgSrc={col.cover_photo.urls.regular}
            title={col.title}
            content={col.description}
            collectionId={col.id}
          />
        ))}
      </div>
    </div>
  );
};

export default Collections;
