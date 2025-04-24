import React, { useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';

interface VideoFeedProps {
  isLoading: boolean;
  error?: string;
  uploadedImage?: string | null;
  onFrameProcessed?: (data: any) => void;
}

export const VideoFeed: React.FC<VideoFeedProps> = ({ isLoading, error, onFrameProcessed }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined;

    const captureAndSendFrame = async () => {
      if (!videoRef.current || !canvasRef.current) {
        console.log('Video or canvas ref not available');
        return;
      }
      
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) {
        console.log('Canvas context not available');
        return;
      }

      if (video.readyState !== 4) {
        console.log('Video not ready yet, current readyState:', video.readyState);
        return;
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob
      try {
        console.log('Capturing frame...');
        const blob = await new Promise<Blob>((resolve) => 
          canvas.toBlob((blob) => resolve(blob as Blob), 'image/jpeg')
        );
        
        // Create form data
        const formData = new FormData();
        formData.append('image', blob, 'frame.jpg');
        
        console.log('Sending frame to backend...');
        // Send to backend
        const response = await fetch('http://localhost:8000/upload-json', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) throw new Error('Failed to process frame');
        
        const data = await response.json();
        console.log('Frame processed successfully:', data);
        // Call the callback with the processed frame data
        if (onFrameProcessed) {
          onFrameProcessed(data);
        }
      } catch (error) {
        console.error('Error processing frame:', error);
      }
    };
    
    if (videoRef.current) {
      const video = videoRef.current;

      const handleVideoReady = () => {
        console.log('Video metadata loaded');
        setIsVideoReady(true);
        if (video.paused) {
          console.log('Starting video playback');
          video.play().catch(err => console.error('Error playing video:', err));
        }
      };

      video.addEventListener('loadedmetadata', handleVideoReady);
      video.addEventListener('canplay', handleVideoReady);

      // Start capture only when video is actually ready
      if (isVideoReady) {
        console.log('Starting frame capture interval');
        intervalId = setInterval(captureAndSendFrame, 3000);
      }

      return () => {
        video.removeEventListener('loadedmetadata', handleVideoReady);
        video.removeEventListener('canplay', handleVideoReady);
        if (intervalId) {
          console.log('Clearing frame capture interval');
          clearInterval(intervalId);
        }
      };
    }
  }, [onFrameProcessed, isVideoReady]);

  if (error) {
    return (
      <div className="relative w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="font-medium">Video Error</p>
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
            <p className="text-sm text-gray-500">Loading video feed...</p>
          </div>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src="/large.mp4"
            muted
            loop
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </>
      )}
      <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium">
        Live Feed
      </div>
    </div>
  );
};