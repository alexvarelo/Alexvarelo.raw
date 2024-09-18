import { Statistics } from "@/models/Statistics";
import axios from "axios";
import { convertToStatistics } from "./helpers/DataMapping";
import { USER_PHOTOS_SAMPLE } from "./fakedata/UserPhotos";
import { USER_STATS } from "./fakedata/Stats";

const HEADERS = {
    Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_AUTH_KEY}`
}

export type orderByQuery = "latest" | "oldest" | "popular" | "views" | "downloads";

const fake_data = async (data: any) => {
    return await new Promise<any>((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, 1000);
    })
}

const fetchStats = async (): Promise<Statistics> => {
    let result: any = null;
    if (process.env.LOCAL_DATA as unknown as number === 1) {
        result = await new Promise<any>((resolve) => {
            setTimeout(() => {
                resolve(USER_STATS);
            }, 1000);
        })
    }
    result = await axios.get("https://api.unsplash.com/users/alexvarelo/statistics", {
        headers: HEADERS
    });
    return convertToStatistics(result.data);
}

const fetchUserPhotos = async (currentPage: number, resultsPerPage: number, orderBy?: orderByQuery): Promise<any> => {
    if (process.env.LOCAL_DATA as unknown as number === 1) {
        return await fake_data(USER_PHOTOS_SAMPLE);
    }
    const result = await axios.get(`https://api.unsplash.com/users/alexvarelo/photos?page=${currentPage}&per_page=${resultsPerPage}&orderBy=${orderBy ?? "latest"}`, {
        headers: HEADERS
    });
    return result.data;
}

export const AvailableApis = {
    fetchStats,
    fetchUserPhotos
};    