export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type Product = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  image_path: string | null;
  /** מוצגת באתר */
  is_available: boolean;
  /** מומלצת בדף הבית */
  is_featured: boolean;
  sort_order: number;
  badges: string[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type GalleryImageRow = {
  id: string;
  title: string | null;
  alt_text: string;
  image_path: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type SiteContentRow = {
  id: string;
  key: string;
  title: string | null;
  body: string | null;
  metadata: unknown;
  updated_at: string;
};
