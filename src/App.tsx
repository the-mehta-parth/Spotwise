import { useState, useEffect } from 'react';
import { VideoFeed } from './components/VideoFeed';
import { Stats } from './components/Stats';
import { ParkingLayout } from './components/ParkingLayout';
import { ThemeToggle } from './components/ThemeToggle';
import type { ParkingSpot, ParkingStats } from './types';
import { HelpCircle } from 'lucide-react';

const mockSpots: ParkingSpot[] = Array.from({ length: 20 }, (_, i) => ({
  id: `Spot ${i + 1}`,
  isOccupied: Math.random() > 0.5,
  location: { x: i % 5, y: Math.floor(i / 5) },
}));

function App() {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [spots] = useState<ParkingSpot[]>(mockSpots);

  const stats: ParkingStats = {
    total: spots.length,
    occupied: spots.filter(spot => spot.isOccupied).length,
    available: spots.filter(spot => !spot.isOccupied).length,
    occupancyRate: Math.round((spots.filter(spot => spot.isOccupied).length / spots.length) * 100),
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Parking Space Detection</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Help"
            >
              <HelpCircle className="w-5 h-5 text-gray-600" />
            </button>
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </div>
        </div>

        {showHelp && (
          <div className="bg-blue-50 p-4 rounded-lg mb-8">
            <h2 className="font-medium mb-2">How it works</h2>
            <p className="text-sm text-gray-600">
              This system uses YOLO object detection to monitor parking spaces in real-time.
              Green spots indicate available spaces, while red spots show occupied ones.
              The dashboard updates automatically as vehicles enter and exit the parking lot.
            </p>
          </div>
        )}

        <div className="space-y-8">
          <VideoFeed isLoading={isLoading} />
          <Stats stats={stats} />
          <ParkingLayout spots={spots} />
        </div>
      </div>
    </div>
  );
}

export default App;