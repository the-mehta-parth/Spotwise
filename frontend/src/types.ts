export interface ParkingSpot {
  id: string;
  isOccupied: boolean;
  isReserved: boolean;
  spotNumber: string;
  type: 'standard' | 'handicap' | 'electric';
  location: {
    x: number;
    y: number;
  };
  reservation?: {
    code: string;
    duration: number;
    arrivalTime: string;
    userId: string;
  };
}

export interface ParkingStats {
  total: number;
  occupied: number;
  available: number;
  occupancyRate: number;
  reserved: number;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface NavigationInfo {
  distance: number;
  walkingTime: number;
  directions: string[];
}