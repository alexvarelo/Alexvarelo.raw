"use client";

import { CircularGallery, GalleryItem } from '@/components/ui/circular-gallery';
import { useUserPhoto } from '@/contexts/UserPhotoContext';
import { useGetUserPhotos } from '@/apis/generated/unsplashApi';
import { APP_CONFIG } from '@/constants/app';
import { Pager } from '@/models/Pagination';
import { useState } from 'react';

const CircularGalleryPage = () => {
  const [pager] = useState<Pager>({
    page: 1,
    resultsPerPage: 10, // Get more photos for the circular gallery
  });

  const { data: photos = [], isLoading } = useGetUserPhotos(
    APP_CONFIG.unsplash.username,
    {
      page: pager.page,
      per_page: pager.resultsPerPage,
      order_by: 'latest',
    }
  );

  // Transform the photos to the format expected by CircularGallery
  const galleryItems: GalleryItem[] = photos.map((photo) => ({
    id: photo.id,
    common: photo.alt_description || 'Untitled',
    binomial: `by ${photo.user?.name || 'Unknown'}`,
    photo: {
      url: photo.urls?.regular || '',
      text: photo.alt_description || '',
      by: photo.user?.name || 'Unknown',
    },
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background text-foreground min-h-screen">
      <div className="w-full h-screen sticky top-0 flex flex-col items-center justify-center overflow-hidden">
        <div className="text-center mb-8 absolute top-16 z-10">
          <p className="text-muted-foreground">Scroll to rotate the gallery</p>
        </div>
        <div className="w-full h-full">
          <CircularGallery items={galleryItems} />
        </div>
      </div>
    </div>
  );
};

export default CircularGalleryPage;
