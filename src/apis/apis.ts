import { Statistics } from "@/models/Statistics";
import axios from "axios";
import { convertToStatistics } from "./helpers/DataMapping";
import { Pager } from "@/models/Pagination";
import { APP_CONFIG } from "@/constants/app";

const UNSPLASH_USERNAME = APP_CONFIG.unsplash.username;

const HEADERS = {
  Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_AUTH_KEY}`,
};

export type orderByQuery =
  | "latest"
  | "oldest"
  | "popular"
  | "views"
  | "downloads";

const fetchStats = async (): Promise<Statistics> => {
  let result: any = null;
  result = await axios.get(
    `https://api.unsplash.com/users/${UNSPLASH_USERNAME}/statistics`,
    {
      headers: HEADERS,
    }
  );
  return convertToStatistics(result.data);
};

const fetchUserPhotos = async (
  currentPage: number,
  resultsPerPage: number,
  orderBy?: orderByQuery,
  orientation?: "landscape" | "portrait" | "squarish"
): Promise<any> => {
  const result = await axios.get(
    `https://api.unsplash.com/users/${UNSPLASH_USERNAME}/photos?page=${currentPage}&per_page=${resultsPerPage}&orderby=${
      orderBy ?? "latest"
    }${orientation ? `&orientation=${orientation}` : ""}`,
    {
      headers: HEADERS,
    }
  );
  return result.data;
};

const fetchUserProfile = async () => {
  const result = await axios.get(`https://api.unsplash.com/users/${UNSPLASH_USERNAME}`, {
    headers: HEADERS,
  });
  return result.data;
};

const fetchUserCollections = async () => {
  const result = await axios.get(
    `https://api.unsplash.com/users/${UNSPLASH_USERNAME}/collections`,
    {
      headers: HEADERS,
    }
  );
  return result.data;
};

const fetchCollectionPhotos = async (collectionId: string, page: Pager) => {
  const result = await axios.get(
    `https://api.unsplash.com/collections/${collectionId}/photos?page=${page.page}&per_page=${page.resultsPerPage}`,
    {
      headers: HEADERS,
    }
  );
  return result.data;
};

const fetchCollection = async (collectionId: string) => {
  const result = await axios.get(
    `https://api.unsplash.com/collections/${collectionId}`,
    {
      headers: HEADERS,
    }
  );
  return result.data;
};

const getPhotoDetails = async (photoId: string) => {
  const result = await axios.get(`https://api.unsplash.com/photos/${photoId}`, {
    headers: HEADERS,
  });
  return result.data;
};

const downloadPhoto = async (photoId: string) => {
  const result = await axios.get(
    `https://api.unsplash.com/photos/${photoId}/download`,
    {
      headers: HEADERS,
    }
  );
  return result.data;
};

const photoStatistics = async (photoId: string) => {
  const result = await axios.get(
    `https://api.unsplash.com/photos/${photoId}/statistics`,
    {
      headers: HEADERS,
    }
  );
  return result.data;
};

const searchPhoto = async (query: string) => {
  const result = await axios.get(
    `https://api.unsplash.com/search/photos?query=${query}`,
    {
      headers: HEADERS,
    }
  );
  return result.data;
};

const userStatistics = async () => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/users/${UNSPLASH_USERNAME}/statistics`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    return null;
  }
};

const userPhotos = async () => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/users/${UNSPLASH_USERNAME}/photos`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching user photos:", error);
    return null;
  }
};

export const AvailableApis = {
  fetchStats,
  fetchUserPhotos,
  fetchUserProfile,
  fetchUserCollections,
  fetchCollectionPhotos,
  fetchCollection,
  downloadPhoto,
  getPhotoDetails,
  photoStatistics,
  searchPhoto,
  userStatistics,
  userPhotos,
};
