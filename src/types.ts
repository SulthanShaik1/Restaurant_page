// src/types.ts
export type Filters = {
  query?: string;
  //allow multiple cuisine selections
  cuisines?: string[];
  cuisine?: string | null;
  minRating?: number;
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
  cuisine?: string[] | string;
  cuisines?: string[]; 
  rating?: number;
  costForTwo?: number;
  image?: string;
  deliveryTimeMins?: number;
  shortDescription?: string;
  menu?: MenuItem[];
};

export type CartItem = {
  id: string;              // unique id for cart entry, we use `${restaurantId}__${itemId}`
  restaurantId: string;
  restaurantName?: string;
  itemId: string;         
  name: string;
  price: number;
  qty: number;
  notes?: string;
};

