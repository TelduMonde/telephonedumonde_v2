export type ModelPhone = {
  id: string;
  brand: string;
  name: string;
  variantCount?: number;
  isActive: boolean;
};

export type CardsModelProps = {
  id: string;
  brand: string;
  name: string;
  isActive: boolean;
  firstImage: string | null;
  minPrice: number | null;
};

export type ShowModelProps = {
  data: {
    id: string;
    brand: string;
    name: string;
    isActive: boolean;
    firstImage: string | null;
    minPrice: number | null;
  }[];
  totalPages: number;
};

//! ====== USER
export interface Address {
  id?: string;
  street: string;
  city: string;
  state?: string | null;
  postalCode: string;
  country: string;
  typeAdress?: string | null;
}

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
};

export type RemoveUrlQueryParams = {
  params: string;
  keysToRemove: string[];
};

export type SearchParamProps = {
  page?: number;
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

//! PROMO CODE
export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  isActive: boolean;
  expiresAt: Date;
}
