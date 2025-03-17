import React, { useEffect, useState } from "react";
import YouTube from 'react-youtube';
import styles from './YouTubePlayer.module.css';

const YouTubePlayer = ({ videoId }) => {
  const [playerDimensions, setPlayerDimensions] = useState({
    width: '100%',
    height: '390'
  });

  // Update dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      // Calculate responsive height based on 16:9 aspect ratio
      const containerWidth = document.querySelector(`.${styles['youtube-player-container']}`)?.clientWidth || 0;
      const height = Math.floor(containerWidth * 0.5625); // 16:9 aspect ratio (9/16 = 0.5625)
      
      setPlayerDimensions({
        width: '100%',
        height: height.toString()
      });
    };

    // Initial calculation
    handleResize();

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles['youtube-player-container']}>
      <YouTube
        videoId={videoId}
        opts={{
          height: playerDimensions.height,
          width: playerDimensions.width,
          playerVars: {
            autoplay: 0,
            controls: 1,
            rel: 0,
            showinfo: 0,
          },
        }}
        className={styles['youtube-player']}
      />
    </div>
  );
};

export default YouTubePlayer; 