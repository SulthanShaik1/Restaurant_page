// src/types.ts
export type Filters = {
  query?: string;
  // new: allow multiple cuisine selections
  cuisines?: string[]; // prefer this for new code
  // backwards-compatible single-string cuisine (comma separated) may still appear from older code
  cuisine?: string | null;
  minRating?: number;
  // 'relevance' kept for modal; useRestaurants will map to internal sort keys
  sortBy?: "relevance" | "rating" | "deliveryTime" | "minOrder" | "";
};

export type MenuItem = {
  id: string;
  name: string;
  price: number;
};

export type Restaurant = {
  id: string;
  name: string;
  cuisine?: string[] | string; // some data files use array (your restaurants.json uses array)
  cuisines?: string[]; // normalized form (hook will use this)
  rating?: number;
  costForTwo?: number;
  image?: string;
  deliveryTimeMins?: number;
  shortDescription?: string;
  menu?: MenuItem[];
};

