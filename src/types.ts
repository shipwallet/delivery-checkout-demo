export interface SIWSessionDTO {
  id: string;
  status: string;
  cart: SIWCartDTO;
  expires_at: string;
  search_address: SIWSearchAddressDTO;
  result: ResultDTO;
  external_id?: string;
}

export class ResultDTO {
  shipping?: ResultShippingDTO;
  category?: ResultCategoryDTO;
  pricing?: ResultPricingDTO;
}

interface SIWCartDTO {
  total_value: number;
  currency: string;
  items: SIWItemDTO[];
  voucher: string;
  shipping_date?: { start: string; end: string };
  cart_id?: string;
  attributes?: string[];
}

interface SIWItemDTO {
  sku: string;
  name: string;
  attributes: string[];
  weight: number;
  dimensions?: {
    height?: number;
    length?: number;
    width?: number;
  };
  quantity?: number;
}

interface SIWSearchAddressDTO {
  country: string;
  postal_code: string;
  name?: string;
  address_lines?: string[];
  city?: string;
  region?: string;
}

interface ResultShippingDTO {
  shipping_method?: string;
  delivery_type?: string;
  delivery_time?: TimeSlotDTO;
  external_method_id?: string;
  location?: PickupLocationDTO;
  carrier?: string;
  product?: string;
}

interface ResultPricingDTO {
  price?: number;
}

interface ResultCategoryDTO {
  name?: string;
}

interface PickupLocationDTO {
  name?: string;
  external_id?: string;
  address?: {
    name: string;
    country: string;
    postal_code: string;
    address_lines: string[];
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

interface TimeSlotDTO {
  id: string;
  expires: string;
  start: string;
  end: string;
}
