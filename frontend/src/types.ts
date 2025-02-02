export interface ParkingSpot {
    id: string;
    isOccupied: boolean;
    location: {
      x: number;
      y: number;
    };
  }
  
  export interface ParkingStats {
    total: number;
    occupied: number;
    available: number;
    occupancyRate: number;
  }