"use client";
import { AvailableApis } from "@/apis/apis";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Collection } from "@/models/Collections";
import ImageGallery from "@/components/images/ImageGallery";
import { Badge } from "@/components/shared/Badge";
import { Pager } from "@/models/Pagination";

const CollectionPage: React.FC<any> = ({ params }) => {
  const [collectionPhotos, setcollectionPhotos] = useState<Photo[]>([]);
  const [pager, setPager] = useState<Pager>({ page: 1, resultsPerPage: 10 });
  const [collectionInfo, setcollectionInfo] = useState<Collection>();
  const observerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setisLoading] = useState(true);

  const hasNextPage =
    pager.page * pager.resultsPerPage <
    (collectionInfo?.total_photos as number);

  console.log(hasNextPage);

  console.log(collectionInfo?.total_photos as number);

  useEffect(() => {
    const node = observerRef.current;
    if (!node || !hasNextPage || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPager({ ...pager, page: pager.page + 1 });
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isLoading, pager, collectionInfo]);

  useEffect(() => {
    setisLoading(true);
    AvailableApis.fetchCollectionPhotos(params?.collectionId, pager).then(
      (x) => {
        setcollectionPhotos([...collectionPhotos, x].flat());
        setisLoading(false);
      }
    );
  }, [pager]);

  useEffect(() => {
    AvailableApis.fetchCollection(params?.collectionId).then((x) =>
      setcollectionInfo(x)
    );
  }, [params?.collectionId]);

  if (!collectionInfo) {
    return <div>Is loading...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">{collectionInfo?.title}</h2>
      <div className="text-xs text-gray-500">
        <p>{collectionInfo?.description}</p>
        <p>{collectionInfo?.total_photos} images</p>
        <p>{new Date(collectionInfo.published_at).toLocaleDateString()}</p>
      </div>

      <div className="mt-5 text-center">
        {collectionInfo.tags.map((tag, indx) => (
          <Badge text={tag.title} key={indx} />
        ))}x
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="pt-7"
      >
        <ImageGallery photos={collectionPhotos} />
      </motion.div>
      {hasNextPage && <div ref={observerRef} className="h-10 w-full" />}
    </div>
  );
};

export default CollectionPage;
