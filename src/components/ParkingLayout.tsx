import React from 'react';
import type { ParkingSpot } from '../types';

interface ParkingLayoutProps {
  spots: ParkingSpot[];
}

export const ParkingLayout: React.FC<ParkingLayoutProps> = ({ spots }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Parking Layout</h3>
      <div className="grid grid-cols-5 gap-2">
        {spots.map((spot) => (
          <div
            key={spot.id}
            className={`aspect-video rounded-md transition-colors ${
              spot.isOccupied ? 'bg-red-100' : 'bg-green-100'
            }`}
            title={`Spot ${spot.id}: ${spot.isOccupied ? 'Occupied' : 'Available'}`}
          />
        ))}
      </div>
    </div>
  );
};