import React, { useState } from 'react';
import type { ParkingSpot } from '../types';
import { Clock, Car } from 'lucide-react';

interface ParkingLayoutProps {
  spots: ParkingSpot[];
}

interface SpotDetailsProps {
  spot: ParkingSpot;
  onClose: () => void;
}

const SpotDetails: React.FC<SpotDetailsProps> = ({ spot, onClose }) => (
  <div className="absolute z-10 bg-white rounded-lg shadow-lg p-4 w-64 transform -translate-x-1/2 -translate-y-full mb-2">
    <div className="flex justify-between items-start mb-3">
      <h4 className="font-medium">{spot.id}</h4>
      <button 
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600"
      >
        ×
      </button>
    </div>
    <div className="space-y-2">
      <div className="flex items-center text-sm">
        <Car className="w-4 h-4 mr-2" />
        <span>{spot.isOccupied ? 'Occupied' : 'Available'}</span>
      </div>
      <div className="flex items-center text-sm">
        <Clock className="w-4 h-4 mr-2" />
        <span>{spot.isOccupied ? '2 hours' : 'Ready for parking'}</span>
      </div>
    </div>
  </div>
);

export const ParkingLayout: React.FC<ParkingLayoutProps> = ({ spots }) => {
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Parking Layout</h3>
      <div className="grid grid-cols-5 gap-2">
        {spots.map((spot) => (
          <div key={spot.id} className="relative">
            <button
              className={`w-full aspect-video rounded-md transition-all transform hover:scale-105 ${
                spot.isOccupied 
                  ? 'bg-red-100 hover:bg-red-200' 
                  : 'bg-green-100 hover:bg-green-200'
              } ${selectedSpot === spot.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedSpot(selectedSpot === spot.id ? null : spot.id)}
              aria-label={`Parking spot ${spot.id}: ${spot.isOccupied ? 'Occupied' : 'Available'}`}
            />
            {selectedSpot === spot.id && (
              <SpotDetails 
                spot={spot} 
                onClose={() => setSelectedSpot(null)} 
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};