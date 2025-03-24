import React, { useState } from 'react';
import type { ParkingSpot, NavigationInfo } from '../types';
import { Clock, Car, Armchair as Wheelchair, Zap, Navigation, Calendar, X, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface ParkingLayoutProps {
  spots: ParkingSpot[];
  onReserveSpot: (spotId: string, duration: number, arrivalTime: string) => void;
  onCancelReservation: (spotId: string) => void;
  nearestSpot?: string;
  navigationInfo?: NavigationInfo;
}

interface SpotDetailsProps {
  spot: ParkingSpot;
  onClose: () => void;
  onReserve: (duration: number, arrivalTime: string) => void;
  onCancel: () => void;
  isNearest: boolean;
  navigationInfo?: NavigationInfo;
}

const SpotTypeIcon = ({ type }: { type: ParkingSpot['type'] }) => {
  switch (type) {
    case 'handicap':
      return <Wheelchair className="w-4 h-4 text-blue-500" />;
    case 'electric':
      return <Zap className="w-4 h-4 text-green-500" />;
    default:
      return <Car className="w-4 h-4 text-gray-500" />;
  }
};

const SpotDetails: React.FC<SpotDetailsProps> = ({ 
  spot, 
  onClose, 
  onReserve, 
  onCancel,
  isNearest,
  navigationInfo 
}) => {
  const [duration, setDuration] = useState(60);
  const [arrivalTime, setArrivalTime] = useState(
    format(new Date().setMinutes(new Date().getMinutes() + 30), "yyyy-MM-dd'T'HH:mm")
  );

  return (
    <div className="absolute z-10 bg-white rounded-lg shadow-lg p-4 w-80 transform -translate-x-1/2 -translate-y-full mb-2">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <h4 className="font-medium">Spot {spot.spotNumber}</h4>
          {isNearest && (
            <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              Nearest
            </span>
          )}
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm">
          <SpotTypeIcon type={spot.type} />
          <span className="ml-2 capitalize">{spot.type} Spot</span>
        </div>

        {navigationInfo && (
          <div className="bg-blue-50 p-2 rounded-md text-sm">
            <div className="flex items-center mb-1">
              <Navigation className="w-4 h-4 text-blue-500 mr-2" />
              <span>{navigationInfo.distance}m away</span>
            </div>
            <div className="text-gray-600">
              ~{navigationInfo.walkingTime} min walking time
            </div>
            {navigationInfo.directions.length > 0 && (
              <div className="mt-2 text-xs">
                <strong>Directions:</strong>
                <ol className="list-decimal list-inside mt-1">
                  {navigationInfo.directions.map((direction, index) => (
                    <li key={index}>{direction}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}

        {!spot.isOccupied && !spot.isReserved ? (
          <div className="space-y-2">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-gray-500" />
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm text-sm"
              >
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={180}>3 hours</option>
              </select>
            </div>

            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <input
                type="datetime-local"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm text-sm"
                min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              />
            </div>

            <button
              onClick={() => onReserve(duration, arrivalTime)}
              className="w-full bg-blue-500 text-white rounded-md py-2 text-sm hover:bg-blue-600 transition-colors"
            >
              Reserve Spot
            </button>
          </div>
        ) : spot.isReserved && spot.reservation ? (
          <div className="space-y-2">
            <div className="bg-yellow-50 p-2 rounded-md">
              <p className="text-sm font-medium text-yellow-800">Reserved</p>
              <p className="text-xs text-yellow-600">
                Code: {spot.reservation.code}
              </p>
              <p className="text-xs text-yellow-600">
                Arrival: {format(new Date(spot.reservation.arrivalTime), 'PPp')}
              </p>
            </div>
            <button
              onClick={() => onCancel()}
              className="w-full bg-red-500 text-white rounded-md py-2 text-sm hover:bg-red-600 transition-colors"
            >
              Cancel Reservation
            </button>
          </div>
        ) : (
          <div className="bg-red-50 p-2 rounded-md">
            <p className="text-sm font-medium text-red-800">Occupied</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const ParkingLayout: React.FC<ParkingLayoutProps> = ({ 
  spots, 
  onReserveSpot,
  onCancelReservation,
  nearestSpot,
  navigationInfo
}) => {
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);

  const getSpotColor = (spot: ParkingSpot) => {
    if (spot.isOccupied) return 'bg-red-100 hover:bg-red-200';
    if (spot.isReserved) return 'bg-yellow-100 hover:bg-yellow-200';
    return 'bg-green-100 hover:bg-green-200';
  };

  const getSpotClasses = (spot: ParkingSpot) => {
    const baseClasses = `
      w-full aspect-video rounded-md transition-all relative
      ${getSpotColor(spot)}
      ${selectedSpot === spot.id ? 'ring-2 ring-blue-500' : ''}
    `;

    if (spot.id === nearestSpot) {
      return `${baseClasses} 
        ring-2 ring-green-500 
        animate-pulse 
        after:content-[''] 
        after:absolute 
        after:inset-0 
        after:ring-2 
        after:ring-green-500 
        after:rounded-md`;
    }

    return `${baseClasses} hover:scale-105`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Parking Layout</h3>
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-100 mr-2" />
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-100 mr-2" />
            <span>Reserved</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-100 mr-2" />
            <span>Occupied</span>
          </div>
          {nearestSpot && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse mr-2" />
              <span>Nearest</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {spots.map((spot) => (
          <div key={spot.id} className="relative">
            <button
              className={getSpotClasses(spot)}
              onClick={() => setSelectedSpot(selectedSpot === spot.id ? null : spot.id)}
              aria-label={`Parking spot ${spot.spotNumber}: ${
                spot.isOccupied ? 'Occupied' : spot.isReserved ? 'Reserved' : 'Available'
              }${spot.id === nearestSpot ? ' (Nearest spot)' : ''}`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-medium">{spot.spotNumber}</div>
                  <SpotTypeIcon type={spot.type} />
                  {spot.id === nearestSpot && (
                    <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <MapPin className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                </div>
              </div>
            </button>
            {selectedSpot === spot.id && (
              <SpotDetails 
                spot={spot}
                onClose={() => setSelectedSpot(null)}
                onReserve={(duration, arrivalTime) => {
                  onReserveSpot(spot.id, duration, arrivalTime);
                  setSelectedSpot(null);
                }}
                onCancel={() => {
                  onCancelReservation(spot.id);
                  setSelectedSpot(null);
                }}
                isNearest={spot.id === nearestSpot}
                navigationInfo={spot.id === nearestSpot ? navigationInfo : undefined}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};