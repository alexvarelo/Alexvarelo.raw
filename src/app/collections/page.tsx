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
      <h2 className="text-2xl sm:text-4xl font-bold mb-20">My photography collections</h2>
      {/* <div className="mb-10 flex flex-wrap gap-x-2 justify-center gap-3">
        <div className="badge p-4 bg-green-200">Mountains</div>
        <div className="badge bg-cyan-200 p-4">Ocean</div>
        <div className="badge bg-orange-200 p-4">Lifestyle</div>
        <div className="badge p-4 bg-red-400">Macro</div>
        <div className="badge bg-slate-200 p-4">Cities</div>
        <div className="badge bg-amber-200 p-4 ">Architecture</div>
      </div> */}
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
