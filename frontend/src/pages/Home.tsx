import React, { useState, useEffect, useRef } from 'react';
import { VideoFeed } from '../components/VideoFeed';
import { Stats } from '../components/Stats';
import { ParkingLayout } from '../components/ParkingLayout';
import { ThemeToggle } from '../components/ThemeToggle';
import type { ParkingSpot, ParkingStats, UserLocation, NavigationInfo } from '../types';
import { HelpCircle, TestTube2Icon, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // New function to handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append('image', file);
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setUploadStatus('uploading');

    try {
      const response = await fetch('http://localhost:8000/upload-json', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();

      // Handle the specific backend response format
      // Convert object of objects to array
      const detectedSpots: ParkingSpot[] = Object.entries(data).map(([index, spotData]: [string, any]) => {
        // First create an object with all the properties we need
        const spot: ParkingSpot = {
          id: `spot-${spotData.label_id}-${Math.random().toString(36).substring(2, 6)}`,
          spotNumber: `P${parseInt(index) + 1}`,
          isOccupied: spotData.label_name === 'not_free_parking_space',
          isReserved: false,
          type: 'standard',
          location: {
            x: Math.round((spotData.bbox[0] + spotData.bbox[2]) / 2),
            y: Math.round((spotData.bbox[1] + spotData.bbox[3]) / 2)
          },
        };

        // Return the spot object that conforms to ParkingSpot type
        return spot;
      });

      // If we have less detected spots than our mock data, keep some of the mock spots
      if (detectedSpots.length < mockSpots.length) {
        const remainingCount = mockSpots.length - detectedSpots.length;
        // Ensure these also match the ParkingSpot type
        const remainingSpots: ParkingSpot[] = mockSpots.slice(0, remainingCount).map(spot => ({
          ...spot,
          id: `spot-mock-${Math.random().toString(36).substring(2, 6)}`, // Generate new IDs to avoid conflicts
        }));

        setSpots([...detectedSpots, ...remainingSpots]);
      } else {
        setSpots(detectedSpots);
      }

      setUploadStatus('success');

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadStatus('error');
    }
  };

  const openFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });

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

  useEffect(() => {
    return () => {
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage);
      }
    };
  }, [uploadedImage]);

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
            userId: 'user-1' 
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
              onClick={openFileUpload}
              className={`flex items-center p-2 rounded-lg ${uploadStatus === 'uploading' ? 'bg-gray-300' : 'hover:bg-gray-100'} transition-colors`}
              aria-label="Upload Image"
              disabled={uploadStatus === 'uploading'}
            >
              <Upload className={`w-5 h-5 ${uploadStatus === 'error' ? 'text-red-600' :
                  uploadStatus === 'success' ? 'text-green-600' : 'text-gray-600'
                }`} />
              <span className="ml-2 text-sm">
                {uploadStatus === 'uploading' ? 'Uploading...' : 'Update Parking Data'}
              </span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
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

        {uploadStatus === 'error' && (
          <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
            Failed to upload image. Please try again.
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="bg-green-50 text-green-700 p-3 rounded mb-4">
            Parking data successfully updated from image!
          </div>
        )}

        {showHelp && (
          <div className="bg-blue-50 p-4 rounded-lg mb-8">
          </div>
        )}

        <div className="space-y-8">
          <VideoFeed isLoading={isLoading} uploadedImage={uploadedImage} />
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