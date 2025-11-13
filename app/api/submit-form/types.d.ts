// Typy dla danych formularza

export interface FormData {
  flightType: 'direct' | 'withstops'
  tripType: 'oneway' | 'roundtrip' | 'multicity'
  from: string
  to: string
  maxStops?: string
  maxTransitHours?: string
  dateFrom: string
  dateTo?: string
  multiCityReturn?: boolean
  multiCityReturnDate?: string
  adults: string
  children: string
  infants: string
  departureTime: string
  seatChoice: 'tak' | 'nie'
  specialNeedsMain: 'tak' | 'nie'
  airportAssist?: boolean
  maas?: boolean
  wchr?: boolean
  wchs?: boolean
  wchc?: boolean
  deaf?: boolean
  blnd?: boolean
  manualWheelchair?: boolean
  electricWheelchair?: boolean
  dietaryRestrictions?: boolean
  medicalEquipment?: boolean
  mobilityAssistance?: boolean
  visualAssistance?: boolean
  hearingAssistance?: boolean
  cognitiveAssistance?: boolean
  petTravel?: boolean
  infantTravel?: boolean
  hotelQuality: string
  distanceCenter: string
  distanceBeach: string
  rooms: string
  meals: string[]
  insurance: string
  tickets: string
  budget: string
  currency: string
  email: string
  accept: boolean
  handLuggage?: HandLuggage[]
  checkedLuggage?: CheckedLuggage[]
  beds?: Bed[]
  multiCity?: MultiCity[]
}

export interface HandLuggage {
  type: 'plecak' | 'walizka'
  count: string
}

export interface CheckedLuggage {
  weight: string
}

export interface Bed {
  type: 'pojedyncze' | 'podwójne' | 'małżeńskie'
  count: string
  room: string
}

export interface MultiCity {
  city: string
  date: string
}

