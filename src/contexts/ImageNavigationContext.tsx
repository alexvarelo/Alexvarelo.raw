"use client";
import { Photo } from "@/apis/generated/model";
import { createContext, useContext, ReactNode, useState } from "react";

type ImageNavigation = {
  nextImage: Record<string, string>; // Map of current image ID to next image ID
  prevImage: Record<string, string>; // Map of current image ID to previous image ID
};

type ImageNavigationContextType = {
  navigation: ImageNavigation;
  setImageNavigation: (photos: Photo[]) => void;
};

const ImageNavigationContext = createContext<
  ImageNavigationContextType | undefined
>(undefined);

export function ImageNavigationProvider({ children }: { children: ReactNode }) {
  const [navigation, setNavigation] = useState<ImageNavigation>({
    nextImage: {},
    prevImage: {},
  });

  const setImageNavigation = (photos: Photo[]) => {
    const nextImageMap: Record<string, string> = {};
    const prevImageMap: Record<string, string> = {};

    photos.forEach((photo, index) => {
      if (index < photos.length - 1) {
        nextImageMap[photo.id] = photos[index + 1].id;
      }
      if (index > 0) {
        prevImageMap[photo.id] = photos[index - 1].id;
      }
    });

    setNavigation({ nextImage: nextImageMap, prevImage: prevImageMap });
  };

  return (
    <ImageNavigationContext.Provider value={{ navigation, setImageNavigation }}>
      {children}
    </ImageNavigationContext.Provider>
  );
}

export function useImageNavigation() {
  const context = useContext(ImageNavigationContext);
  if (context === undefined) {
    throw new Error(
      "useImageNavigation must be used within an ImageNavigationProvider"
    );
  }
  return context;
}
