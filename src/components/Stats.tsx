import React from 'react';
import { Car, ParkingSquare, Percent, Clock } from 'lucide-react';
import type { ParkingStats } from '../types';

interface StatsProps {
  stats: ParkingStats;
}

export const Stats: React.FC<StatsProps> = ({ stats }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <ParkingSquare className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Spots</p>
              <p className="text-xl font-semibold">{stats.total}</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Updated in real-time
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="bg-green-50 p-2 rounded-lg">
              <Car className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-xl font-semibold">{stats.available}</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            {stats.available > 5 ? 'Plenty of spots' : 'Limited availability'}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-50 p-2 rounded-lg">
              <Percent className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Occupancy Rate</p>
              <p className="text-xl font-semibold">{stats.occupancyRate}%</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            {stats.occupancyRate > 80 ? 'High demand' : 'Normal demand'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-50 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Duration</p>
              <p className="text-xl font-semibold">2.5h</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Based on today's data
          </div>
        </div>
      </div>
    </div>
  );
};