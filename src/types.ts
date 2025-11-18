export interface MenuItem {
  id: string;
  name: string;
  price: number;
  veg?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  costForTwo: number;
  image: string;
  deliveryTimeMins: number;
  shortDescription?: string;
  menu?: MenuItem[];
}
