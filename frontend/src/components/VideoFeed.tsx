import React from 'react';
import { Camera } from 'lucide-react';

interface VideoFeedProps {
  isLoading: boolean;
  error?: string;
}

export const VideoFeed: React.FC<VideoFeedProps> = ({ isLoading, error }) => {
  if (error) {
    return (
      <div className="relative w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="font-medium">Camera Error</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <Camera className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Initializing camera...</p>
          </div>
        </div>
      ) : (
        <img
          src="https://images.unsplash.com/photo-1593280405106-e438ebe93f5b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGFya2luZyUyMGxvdHxlbnwwfHwwfHx8MA%3D%3D"
          alt="Parking Lot Feed"
          className="w-full h-full object-cover"
        />
      )}
      <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium">
        Live Feed
      </div>
    </div>
  );
};