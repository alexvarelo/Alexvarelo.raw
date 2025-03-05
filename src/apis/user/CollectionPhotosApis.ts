import { useQuery } from "react-query";
import axios from "axios";
import { Pager } from "@/models/Pagination";
import { HEADERS } from "@/apis/apis";

const fetchCollectionPhotos = async (collectionId: string, page: Pager): Promise<Photo[]> => {
  const result = await axios.get(
    `https://api.unsplash.com/collections/${collectionId}/photos?page=${page.page}&per_page=${page.resultsPerPage}`,
    {
      headers: HEADERS,
    }
  );
  return result.data;
};

export const useCollectionPhotos = (collectionId: string, page: Pager) => {
  return useQuery(
    ["collectionPhotos", collectionId, page],
    () => fetchCollectionPhotos(collectionId, page),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};
