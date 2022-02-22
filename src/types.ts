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

export interface DataChangedEventData {
  delivery_type: string;
  price: number;
  search_address?: {
    country?: string;
    postal_code?: string;
    address_lines?: string[];
    city?: string;
    region?: string;
  };
  shipping_method: string;
  external_method_id?: string;
  category_name: string;
  pickup_location:
    | {
        address: {
          country?: string;
          postal_code?: string;
          address_lines?: string[];
          city?: string;
          coordinates?: Coordinates;
        };
        name: string;
      }
    | undefined;
}

export interface Coordinates {
  /** @format double */
  latitude: number;
  /** @format double */
  longitude: number;
}

export interface DataChangedEventMeta {
  search_address_changed: boolean;
  price_changed: boolean;
  delivery_type_changed: boolean;
  shipping_method_changed: boolean;
  pickup_location_changed: boolean;
}

export interface ExternalWidgetAPIEvents {
  door_code_changed: string;
  courier_instructions_changed: string;
  data_changed: [DataChangedEventData, DataChangedEventMeta];
}

export interface PublicAPI {
  suspend(): void;
  resume(): void;
  on: <Name extends keyof ExternalWidgetAPIEvents>(
    name: Name,
    callback: (
      data: Name extends "data_changed"
        ? ExternalWidgetAPIEvents["data_changed"]["0"]
        : Name extends "courier_instructions_changed"
        ? ExternalWidgetAPIEvents["courier_instructions_changed"]
        : Name extends "door_code_changed"
        ? ExternalWidgetAPIEvents["door_code_changed"]
        : never,
      meta: Name extends "data_changed"
        ? ExternalWidgetAPIEvents["data_changed"]["1"]
        : undefined
    ) => void
  ) => void;
}
