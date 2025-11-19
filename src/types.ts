// src/types.ts
export type MenuItem = {
  id?: string;
  name?: string;
  price?: number;
};

export type Restaurant = {
  id?: string | number;
  name?: string;
  cuisine?: string[];         // your JSON uses an array of cuisine strings
  image?: string;
  rating?: number;
  costForTwo?: number;
  deliveryTimeMins?: number;
  shortDescription?: string;
  menu?: MenuItem[];
};

export type Filters = {
  query: string;
  cuisine: string | null;
  minRating: number | null;
  sortBy: "relevance" | "rating" | "deliveryTime" | "minOrder";
};
