export interface User {
  id: string;
  username: string;
  name: string;
  bio?: string;
  location?: string;
  total_photos?: number;
  total_likes?: number;
  portfolio_url?: string;
  profile_image?: {
    small: string;
    medium: string;
    large: string;
  };
  // Add any other user properties you need
} 