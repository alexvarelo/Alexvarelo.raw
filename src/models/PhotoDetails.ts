export interface PhotoDetails {
    id: string;
    slug: string;
    alternative_slugs: Record<string, string>;
    created_at: string;
    updated_at: string;
    promoted_at: string | null;
    width: number;
    height: number;
    color: string;
    blur_hash: string;
    description: string | null;
    alt_description: string | null;
    breadcrumbs: string[];
    urls: Urls;
    links: Links;
    likes: number;
    liked_by_user: boolean;
    current_user_collections: any[]; // Adjust type if structure is known
    sponsorship: null; // Adjust if sponsorship data structure is available
    topic_submissions: Record<string, unknown>;
    asset_type: string;
    exif: Exif;
    location: Location | null;
    meta: Meta;
    public_domain: boolean;
    tags: Tag[];
  }
  
  export interface Urls {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
    small_s3: string;
  }
  
  export interface Links {
    self: string;
    html: string;
    download: string;
    download_location: string;
  }
  
  export interface Exif {
    make: string | null;
    model: string | null;
    name: string | null;
    exposure_time: string | null;
    aperture: string | null;
    focal_length: string | null;
    iso: number | null;
  }
  
  export interface Location {
    name: string | null;
    city: string | null;
    country: string | null;
    position: Position | null;
  }
  
  export interface Position {
    latitude: number | null;
    longitude: number | null;
  }
  
  export interface Meta {
    index: boolean;
  }
  
  export interface Tag {
    type: string;
    title: string;
    source?: Source;
  }
  
  export interface Source {
    ancestry: Ancestry;
    title: string;
    subtitle: string;
    description: string;
    redirect: string | null;
    meta_title: string;
    meta_description: string;
    cover_photo: CoverPhoto;
    affiliate_search_query?: string | null;
  }
  
  export interface Ancestry {
    type: Category;
    category: Category;
    subcategory: Category;
  }
  
  export interface Category {
    slug: string;
    pretty_slug: string;
    redirect: string | null;
  }
  
  export interface CoverPhoto {
    id: string;
    slug: string;
    alternative_slugs: Record<string, string>;
    created_at: string;
    updated_at: string;
    promoted_at: string | null;
    width: number;
    height: number;
    color: string;
    blur_hash: string;
    description: string | null;
    alt_description: string | null;
    breadcrumbs: string[];
    urls: Urls;
    links: Links;
    likes: number;
    liked_by_user: boolean;
    current_user_collections: any[]; // Adjust type if structure is known
    sponsorship: null; // Adjust if sponsorship data structure is available
    topic_submissions: Record<string, unknown>;
    asset_type: string;
    premium: boolean;
    plus: boolean;
    user: User;
  }
  
  export interface User {
    id: string;
    updated_at: string;
    username: string;
    name: string;
    first_name: string;
    last_name: string;
    twitter_username: string | null;
    portfolio_url: string | null;
    bio: string | null;
    location: string | null;
    links: UserLinks;
    profile_image: ProfileImage;
    instagram_username: string | null;
    total_collections: number;
    total_likes: number;
    total_photos: number;
    total_promoted_photos: number;
    total_illustrations: number;
    total_promoted_illustrations: number;
    accepted_tos: boolean;
    for_hire: boolean;
    social: Social;
  }
  
  export interface UserLinks {
    self: string;
    html: string;
    photos: string;
    likes: string;
    portfolio: string;
    following: string;
    followers: string;
  }
  
  export interface ProfileImage {
    small: string;
    medium: string;
    large: string;
  }
  
  export interface Social {
    instagram_username: string | null;
    portfolio_url: string | null;
    twitter_username: string | null;
    paypal_email: string | null;
  }
  