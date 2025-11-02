'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Video, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

// YouTube Player types
interface YTPlayer {
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
}

interface YTPlayerEvent {
  target: YTPlayer;
  data?: number;
}

interface YouTubeBackgroundProps {
  videoId?: string;
  opacity?: number;
  skipStart?: number; // Skip initial seconds
  skipEnd?: number; // Skip ending seconds
}

export function YouTubeBackground({
  videoId = 'CeItO4-ARfk',
  opacity = 0.5,
  skipStart = 10,
  skipEnd = 10,
}: YouTubeBackgroundProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const playerRef = useRef<YTPlayer | null>(null);
  const videoEndTimeRef = useRef<number>(0);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia('(max-width: 768px)').matches;
      setIsMobile(mobile);
      // Auto-hide on mobile for performance
      if (mobile && isVisible) {
        setIsVisible(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isVisible]);

  // Player event handlers
  const onPlayerReady = useCallback((event: YTPlayerEvent) => {
    const player = event.target;
    const duration = player.getDuration();
    videoEndTimeRef.current = duration - skipEnd;
    player.playVideo();
  }, [skipEnd]);

  const onPlayerStateChange = useCallback((event: YTPlayerEvent) => {
    const player = event.target;

    // When video is playing, check if we need to loop
    if (event.data === 1) { // YT.PlayerState.PLAYING
      // Clear any existing interval
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }

      checkIntervalRef.current = setInterval(() => {
        if (player && player.getCurrentTime) {
          const currentTime = player.getCurrentTime();
          if (currentTime >= videoEndTimeRef.current) {
            player.seekTo(skipStart, true);
          }
        }
      }, 1000);
    } else {
      // Clear interval when video is not playing
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    }

    // Loop video when it ends
    if (event.data === 0) { // YT.PlayerState.ENDED
      player.seekTo(skipStart, true);
      player.playVideo();
    }
  }, [skipStart]);

  // Initialize YouTube IFrame API
  useEffect(() => {
    if (!isVisible || isMobile) return;

    // Check if API is already loaded
    if (typeof window !== 'undefined' && (window as Window & { YT?: { Player: unknown } }).YT) {
      if (!playerRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        playerRef.current = new ((window as any).YT.Player)('youtube-bg-player', {
          videoId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            showinfo: 0,
            modestbranding: 1,
            rel: 0,
            iv_load_policy: 3,
            disablekb: 1,
            playsinline: 1,
            start: skipStart,
            enablejsapi: 1,
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        });
      }
      return;
    }

    // Load YouTube IFrame API if not loaded
    if (typeof window !== 'undefined' && !(window as Window & { YT?: { Player: unknown } }).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      // Initialize player when API is ready
      (window as Window & { onYouTubeIframeAPIReady?: () => void }).onYouTubeIframeAPIReady = () => {
        if (!playerRef.current) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          playerRef.current = new ((window as any).YT.Player)('youtube-bg-player', {
            videoId,
            playerVars: {
              autoplay: 1,
              mute: 1,
              controls: 0,
              showinfo: 0,
              modestbranding: 1,
              rel: 0,
              iv_load_policy: 3,
              disablekb: 1,
              playsinline: 1,
              start: skipStart,
              enablejsapi: 1,
            },
            events: {
              onReady: onPlayerReady,
              onStateChange: onPlayerStateChange,
            },
          });
        }
      };
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [isVisible, isMobile, videoId, skipStart, onPlayerReady, onPlayerStateChange]);

  return (
    <>
      {/* Toggle Button - show on desktop, optional on mobile */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsVisible(!isVisible)}
          className="bg-background/80 backdrop-blur-sm"
          title={isMobile ? 'Video disabled on mobile for performance' : 'Toggle background video'}
        >
          {isVisible ? (
            <VideoOff className="h-4 w-4" />
          ) : (
            <Video className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* YouTube Video Background - optimized for mobile */}
      {isVisible && !isMobile && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 bg-background"
            style={{ opacity: 1 - opacity }}
          />
          <div
            className="absolute w-full h-full flex items-center justify-center"
            style={{
              transform: 'scale(1.5)',
              // opacity,
            }}
          >
            <div
              id="youtube-bg-player"
              className="pointer-events-none"
              style={{
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
      )}

      {/* Mobile info message */}
      {isMobile && isVisible && (
        <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-muted-foreground text-sm px-4">
            Background video is disabled on mobile for better performance
          </div>
        </div>
      )}
    </>
  );
}