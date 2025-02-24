import { useInfiniteQuery, UseInfiniteQueryOptions } from "react-query";
import axios from "axios";
import { HEADERS, UNSPLASH_USERNAME } from "../apis";

interface FetchUserPhotosParams {
  currentPage: number;
  resultsPerPage: number;
  orderBy?: "latest" | "oldest" | "popular";
  orientation?: "landscape" | "portrait" | "squarish";
  fetchStats?: boolean;
}

const fetchUserPhotos = async (
  params: FetchUserPhotosParams
): Promise<Photo[]> => {
  const {
    currentPage,
    resultsPerPage,
    orderBy = "latest",
    orientation,
    fetchStats,
  } = params;
  const result = await axios.get(
    `https://api.unsplash.com/users/${UNSPLASH_USERNAME}/photos`,
    {
      params: {
        page: currentPage,
        per_page: resultsPerPage,
        order_by: orderBy,
        orientation,
        stats: fetchStats,
      },
      headers: HEADERS,
    }
  );
  return result.data;
};
export const useUserPhotos = (
  params: FetchUserPhotosParams,
  options?: UseInfiniteQueryOptions<Photo[], Error>
) => {
  return useInfiniteQuery<Photo[], Error>(
    ["userPhotos", params],
    ({ pageParam = 1 }) =>
      fetchUserPhotos({ ...params, currentPage: pageParam }),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      ...options,
    }
  );
};
