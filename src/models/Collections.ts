export interface Collection {
  id: string;
  title: string;
  description: string;
  published_at: string;
  last_collected_at: string;
  updated_at: string;
  featured: boolean;
  total_photos: number;
  private: boolean;
  share_key: string;
  tags: Tag[];
  links: Links;
  user: User;
  cover_photo: Photo;
  preview_photos: Photo[];
}

interface Tag {
  type: string;
  title: string;
  source?: Source;
  affiliate_search_query?: string | null;
}

interface Source {
  ancestry: Ancestry;
  title: string;
  subtitle: string;
  description: string;
  meta_title: string;
  meta_description: string;
  cover_photo: Photo;
}

interface Ancestry {
  type: AncestryDetail;
  category: AncestryDetail;
  subcategory: AncestryDetail;
}

interface AncestryDetail {
  slug: string;
  pretty_slug: string;
}


interface AlternativeSlugs {
  en: string;
  es: string;
  ja: string;
  fr: string;
  it: string;
  ko: string;
  de: string;
  pt: string;
}

interface Breadcrumb {
  slug: string;
  title: string;
  index: number;
  type: string;
}

interface Urls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
  small_s3: string;
}

interface Links {
  self: string;
  html: string;
  download: string;
  download_location: string;
}

interface TopicSubmissions {
  [key: string]: TopicSubmission;
}

interface TopicSubmission {
  status: string;
  approved_on: string;
}
