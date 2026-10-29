export type RoomType = 'ocean_suite' | 'pool_villa' | 'penthouse' | 'garden_studio' | 'executive_king';

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

export interface HotelRoom {
  id: string;
  title: string;
  subtitle: string;
  type: RoomType;
  pricePerNight: number;
  originalPrice?: number;
  sizeSqM: number;
  maxGuests: number;
  bedType: string;
  view: string;
  rating: number;
  reviewsCount: number;
  description: string;
  features: string[];
  amenities: string[];
  badge?: string;
  threeModelType: 'ocean_suite' | 'pool_villa' | 'penthouse';
}

export interface AddOnOption {
  id: string;
  name: string;
  description: string;
  price: number;
  perNight?: boolean;
  category: 'wellness' | 'dining' | 'transport' | 'convenience';
  icon: string;
}

export interface BookingDetails {
  bookingId: string;
  roomId: string;
  roomTitle: string;
  roomType: RoomType;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  roomsCount: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  country: string;
  specialRequests?: string;
  bedPreference: 'king' | 'twin';
  floorPreference: 'high' | 'garden' | 'quiet';
  selectedAddOns: string[];
  basePrice: number;
  addOnsPrice: number;
  resortFee: number;
  tax: number;
  discount: number;
  totalPrice: number;
  currency: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  digitalPin: string;
}

export interface HotspotItem {
  id: string;
  title: string;
  description: string;
  position: [number, number, number];
  cameraTarget: [number, number, number];
  cameraPos: [number, number, number];
  tag: string;
}

export type TimeOfDay = 'morning' | 'daylight' | 'golden' | 'dusk';

export type CameraPreset = 'overview' | 'bed' | 'balcony' | 'lounge' | 'topdown';

export type MaterialTheme = 'santorini' | 'kyoto' | 'nordic';
