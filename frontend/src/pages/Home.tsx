import React, { useState, useEffect } from 'react';
import { VideoFeed } from '../components/VideoFeed';
import { Stats } from '../components/Stats';
import { ParkingLayout } from '../components/ParkingLayout';
import { ThemeToggle } from '../components/ThemeToggle';
import type { ParkingSpot, ParkingStats, UserLocation, NavigationInfo } from '../types';
import { HelpCircle, TestTube2Icon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Simulated data with enhanced spot information
const mockSpots: ParkingSpot[] = Array.from({ length: 20 }, (_, i) => ({
  id: `spot-${i + 1}`,
  spotNumber: `${String.fromCharCode(65 + Math.floor(i / 5))}${(i % 5) + 1}`,
  isOccupied: Math.random() > 0.7,
  isReserved: Math.random() > 0.8,
  type: i % 10 === 0 ? 'handicap' : i % 5 === 0 ? 'electric' : 'standard',
  location: { x: i % 5, y: Math.floor(i / 5) },
}));

function App() {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [spots, setSpots] = useState<ParkingSpot[]>(mockSpots);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [nearestSpot, setNearestSpot] = useState<string | null>(null);
  const [navigationInfo, setNavigationInfo] = useState<NavigationInfo>({
    distance: 150,
    walkingTime: 2,
    directions: ['Head north', 'Turn right at entrance', 'Spot is on your left']
  });

  const stats: ParkingStats = {
    total: spots.length,
    occupied: spots.filter(spot => spot.isOccupied).length,
    reserved: spots.filter(spot => spot.isReserved).length,
    available: spots.filter(spot => !spot.isOccupied && !spot.isReserved).length,
    occupancyRate: Math.round(
      (spots.filter(spot => spot.isOccupied || spot.isReserved).length / spots.length) * 100
    ),
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Simulate getting user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          
          // Find nearest available spot (simplified simulation)
          const availableSpots = spots.filter(spot => !spot.isOccupied && !spot.isReserved);
          if (availableSpots.length > 0) {
            setNearestSpot(availableSpots[0].id);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    return () => clearTimeout(timer);
  }, []);

  const handleReserveSpot = (spotId: string, duration: number, arrivalTime: string) => {
    setSpots(spots.map(spot => {
      if (spot.id === spotId) {
        return {
          ...spot,
          isReserved: true,
          reservation: {
            code: Math.random().toString(36).substring(2, 8).toUpperCase(),
            duration,
            arrivalTime,
            userId: 'user-1' // In a real app, this would come from authentication
          }
        };
      }
      return spot;
    }));
  };

  const handleCancelReservation = (spotId: string) => {
    setSpots(spots.map(spot => {
      if (spot.id === spotId) {
        return {
          ...spot,
          isReserved: false,
          reservation: undefined
        };
      }
      return spot;
    }));
  };

  const navigate = useNavigate();
  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Spotwise</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Help"
            >
              <HelpCircle className="w-5 h-5 text-gray-600" />
            </button>
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
            <button
              onClick={() => navigate("/test")}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Help"
            >
              <TestTube2Icon className="w-5 h-5 text-gray-600" />
            </button>

          </div>
        </div>

        {showHelp && (
          <div className="bg-blue-50 p-4 rounded-lg mb-8">
            <h2 className="font-medium mb-2">How to Use the Parking System</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                - The system automatically shows the nearest available parking spot based on your location.
              </p>
              <p>
                - Click on any available (green) spot to make a reservation. You'll receive a confirmation code.
              </p>
              <p>
                <strong>Spot Types:</strong>
                <span className="ml-2">🚗 Standard</span>
                <span className="ml-2">♿ Handicap</span>
                <span className="ml-2">⚡ Electric</span>
              </p>
              <p>
                <strong>Navigation:</strong> Follow the turn-by-turn directions to reach your reserved spot.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-8">
          <VideoFeed isLoading={isLoading} />
          <Stats stats={stats} />
          <ParkingLayout 
            spots={spots}
            onReserveSpot={handleReserveSpot}
            onCancelReservation={handleCancelReservation}
            nearestSpot={nearestSpot ?? undefined}
            navigationInfo={navigationInfo}
          />
        </div>
      </div>
    </div>
  );
}

export default App;