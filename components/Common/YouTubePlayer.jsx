import React, { useEffect, useRef, useState } from "react";
import styles from './YouTubePlayer.module.css';

const YouTubePlayer = ({ videoId }) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load YouTube IFrame API
  useEffect(() => {
    if (!isClient) {
      return;
    }
    
    let isMounted = true;
    let timeoutId;
    
    // Set a timeout to use fallback if API doesn't load
    timeoutId = setTimeout(() => {
      if (isMounted && isLoading) {
        setUseFallback(true);
        setIsLoading(false);
      }
    }, 5000); // 5 second timeout
    
    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      clearTimeout(timeoutId);
      createPlayer();
    } else {
      // Load the IFrame Player API code asynchronously
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }

      // Initialize player when API is ready
      window.onYouTubeIframeAPIReady = () => {
        if (!isMounted) return;
        clearTimeout(timeoutId);
        createPlayer();
      };
    }

    function createPlayer() {
      if (containerRef.current && videoId) {
        try {
          playerRef.current = new window.YT.Player(containerRef.current, {
            videoId: videoId,
            playerVars: {
              autoplay: 0,
              controls: 1,
              rel: 0,
              showinfo: 0,
              modestbranding: 1
            },
            events: {
              onReady: (event) => {
                if (!isMounted) return;
                setIsLoading(false);
              },
              onError: (event) => {
                console.error('YouTubePlayer: Player error:', event);
                if (!isMounted) return;
                setUseFallback(true);
                setIsLoading(false);
              }
            }
          });
        } catch (error) {
          console.error('YouTubePlayer: Error creating player:', error);
          setUseFallback(true);
          setIsLoading(false);
        }
      } else {
        setUseFallback(true);
        setIsLoading(false);
      }
    }

    // Cleanup
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
      if (window.onYouTubeIframeAPIReady) {
        window.onYouTubeIframeAPIReady = null;
      }
    };
  }, [videoId, isLoading, isClient]);

  // Show loading on server side
  if (!isClient) {
    return (
      <div className={styles['youtube-player-wrapper']}>
        <div className={styles['loading-placeholder']}>
          Loading video...
        </div>
      </div>
    );
  }

  // Fallback iframe
  if (useFallback) {
    return (
      <div className={styles['youtube-player-wrapper']}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className={styles['youtube-player-wrapper']}>
      {isLoading && (
        <div className={styles['loading-placeholder']}>
          Loading video...
        </div>
      )}
      <div
        ref={containerRef}
        className={styles['youtube-player']}
        style={{ opacity: isLoading ? 0 : 1 }}
      />
    </div>
  );
};

export default YouTubePlayer; 
