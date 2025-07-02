import axios, { AxiosRequestConfig } from 'axios';

export const customInstance = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const instance = axios.create({
    baseURL: 'https://api.unsplash.com',
    headers: {
      Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_AUTH_KEY}`,
    },
  });

  return instance(config).then((response) => response.data);
}; 