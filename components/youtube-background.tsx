'use client';

import { useState } from 'react';
import { Video, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface YouTubeBackgroundProps {
  videoId?: string;
  opacity?: number;
}

export function YouTubeBackground({
  videoId = 'CeItO4-ARfk', // Default video ID, replace with your preferred video
  opacity = 0.15
}: YouTubeBackgroundProps) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsVisible(!isVisible)}
          className="bg-background/80 backdrop-blur-sm"
        >
          {isVisible ? (
            <VideoOff className="h-4 w-4" />
          ) : (
            <Video className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* YouTube Video Background */}
      {isVisible && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 bg-background"
            style={{ opacity: 1 - opacity }}
          />
          <iframe
            className="absolute top-1/2 left-1/2 w-[100vw] h-[100vh] -translate-x-1/2 -translate-y-1/2 scale-[1.5]"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1`}
            title="YouTube video background"
            allow="autoplay; encrypted-media"
            style={{
              opacity,
              pointerEvents: 'none',
            }}
          />
        </div>
      )}
    </>
  );
}
