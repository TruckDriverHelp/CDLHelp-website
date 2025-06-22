import React, { useEffect, useRef, useState } from "react";
import styles from './YouTubePlayer.module.css';

const YouTubePlayer = ({ videoId }) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  // Load YouTube IFrame API
  useEffect(() => {
    let isMounted = true;
    let timeoutId;
    
    // Set a timeout to use fallback if API doesn't load
    timeoutId = setTimeout(() => {
      if (isMounted && isLoading) {
        setUseFallback(true);
        setIsLoading(false);
      }
    }, 5000); // 5 second timeout
    
    // Load the IFrame Player API code asynchronously
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      if (!isMounted) return;
      clearTimeout(timeoutId);
      
      if (containerRef.current && videoId) {
        try {
          playerRef.current = new window.YT.Player(containerRef.current, {
            height: '390',
            width: '100%',
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
                if (!isMounted) return;
                console.error('Player error:', event);
                setUseFallback(true);
                setIsLoading(false);
              }
            }
          });
        } catch (error) {
          console.error('Error creating YouTube player:', error);
          setUseFallback(true);
          setIsLoading(false);
        }
      }
    };

    // Cleanup
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      window.onYouTubeIframeAPIReady = null;
    };
  }, [videoId, isLoading]);

  // Fallback iframe
  if (useFallback) {
    return (
      <div className={styles['youtube-player-container']}>
        <iframe
          width="100%"
          height="390"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className={styles['youtube-player-container']}>
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
