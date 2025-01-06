export type ModelPhone = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  variantCount?: number;
  isActive: boolean;
};

export type CardsModelProps = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  isActive: boolean;
  firstImage: string | null;
  minPrice: number | null;
};

export type ShowModelProps = {
  data: {
    id: string;
    slug: string;
    brand: string;
    name: string;
    isActive: boolean;
    firstImage: string | null;
    minPrice: number | null;
  }[];
  totalPages: number;
};

//! VARIANT
export type CountryProps = {
  id: string;
  name: string;
};

export type VariantProps = {
  id: string;
  name: string;
  memory: number;
  color: string;
  price: number;
  country: CountryProps;
  description: string;
  isActive: boolean;
  images: string[];
  model: { id: string; name: string };
};

//! FAVORITE VARIANT
export interface Brand {
  name: string;
}

export interface Model {
  id: string;
  name: string;
  brand: Brand;
}

export interface Country {
  id: string;
  name: string;
  flagUrl: string;
}

export interface VariantFav {
  id: string;
  color: string;
  modelId: string;
  memory: number;
  price: number;
  stock: number | null;
  isActive: boolean;
  description: string;
  images: string[];
  countryId: string | null; // Allow countryId to be string or null
  model: {
    id: string;
    name: string;
    isActive: boolean;
    brand: string;
  };
  country: {
    id: string;
    name: string;
    imageUrl: string | null;
  } | null;
}

// export interface Favorite {
//   userId: string;
//   variantId: string;
//   createdAt: Date;
//   Variant: Variant;
// }

//! ====== USER
export interface UserPropsAdmin {
  id: string;
  email: string | null;
  emailVerified: Date | null;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  image: string | null;
  isVerified: boolean;
  role: string;
  stripeCustomerId: string | null;
  createdAt: string;
  updatedAt: string;
  orderCount: number;
  Order: OrderProps[];
  _count: {
    Order: number;
  };
}

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

//! ORDER
export type PersonalInfos = {
  lastName: string;
  firstName: string;
};

export type OrderProps = {
  id: string;
  orderNumber: string;
  userId: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
  paymentStatus: string;
  price: number;
  promoCodeId: string | null;
  quantity: number;
  statut: string;
  stripeSessionId: string | null;
  addressId: string | null;
  PersonnalInfos: PersonalInfos;
  shippingAddress: Address;
  items: {
    Variant: {
      images: string[];
      model: { name: string };
    };
    id: string;
    variantId: string;
    quantity: number;
    price: number;
  }[];
  deliveryInfos: {
    cost: number;
  };
};

export type OrderProps2 = {
  data: {
    id: string;
    orderNumber: string;
    userId: string;
    contactEmail: string;
    contactPhone: string;
    createdAt: string;
    updatedAt: string;
    paymentStatus: string;
    price: number;
    promoCodeId: string | null;
    quantity: number;
    statut: string;
    stripeSessionId: string | null;
    addressId: string | null;
    PersonnalInfos: PersonalInfos;
    shippingAddress: Address;
    items: {
      Variant: {
        images: string[];
        model: { name: string };
      };
      id: string;
      variantId: string;
      quantity: number;
      price: number;
    }[];
    deliveryInfos: {
      cost: number;
    };
  };
  totalPages: number;
};
