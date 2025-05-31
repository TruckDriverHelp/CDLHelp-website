import React, { useEffect, useRef, useState } from "react";
import styles from './YouTubePlayer.module.css';

const YouTubePlayer = ({ videoId }) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [playerDimensions, setPlayerDimensions] = useState({
    width: '100%',
    height: '390'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load YouTube IFrame API
  useEffect(() => {
    let isMounted = true;
    
    // Load the IFrame Player API code asynchronously
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      if (!isMounted) return;
      
      if (containerRef.current && videoId) {
        playerRef.current = new window.YT.Player(containerRef.current, {
          height: playerDimensions.height,
          width: playerDimensions.width,
          videoId: videoId,
          playerVars: {
            autoplay: 0,
            controls: 1,
            rel: 0,
            showinfo: 0,
            modestbranding: 1,
            loading: 'lazy'
          },
          events: {
            onReady: (event) => {
              if (!isMounted) return;
              setIsLoading(false);
              console.log('Player is ready');
            },
            onError: (event) => {
              if (!isMounted) return;
              console.error('Player error:', event);
            }
          }
        });
      }
    };

    // Cleanup
    return () => {
      isMounted = false;
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      window.onYouTubeIframeAPIReady = null;
    };
  }, [videoId]);

  // Handle responsive sizing
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const height = Math.floor(containerWidth * 0.5625); // 16:9 aspect ratio
        
        setPlayerDimensions({
          width: '100%',
          height: height.toString()
        });

        // Update player size if it exists
        if (playerRef.current && playerRef.current.setSize) {
          playerRef.current.setSize(containerWidth, height);
        }
      }
    };

    // Initial calculation
    handleResize();

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
