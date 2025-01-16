import React from 'react';
import { Car, ParkingSquare, Percent } from 'lucide-react';
import type { ParkingStats } from '../types';

interface StatsProps {
  stats: ParkingStats;
}

export const Stats: React.FC<StatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <ParkingSquare className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Spots</p>
            <p className="text-xl font-semibold">{stats.total}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-green-50 p-2 rounded-lg">
            <Car className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Available</p>
            <p className="text-xl font-semibold">{stats.available}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-50 p-2 rounded-lg">
            <Percent className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Occupancy Rate</p>
            <p className="text-xl font-semibold">{stats.occupancyRate}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};