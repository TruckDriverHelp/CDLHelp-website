import React, { useEffect, useState } from 'react';
import styles from './YouTubePlayer.module.css';

const YouTubePlayer = ({ videoId }) => {
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading on server side
  if (!isClient) {
    return (
      <div className={styles['youtube-player-wrapper']}>
        <div className={styles['loading-placeholder']}>Loading video...</div>
      </div>
    );
  }

  // Validate video ID
  if (!videoId || videoId.length === 0) {
    return (
      <div className={styles['youtube-player-wrapper']}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#999',
            fontSize: '14px',
            textAlign: 'center',
            width: '100%',
            padding: '20px',
          }}
        >
          Video not available
        </div>
      </div>
    );
  }

  // Clean the video ID if it contains extra parameters
  const cleanVideoId = videoId.split('&')[0].split('?')[0];

  // Direct iframe implementation - simpler and more reliable
  return (
    <div className={styles['youtube-player-wrapper']}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${cleanVideoId}?rel=0&modestbranding=1&showinfo=0&autoplay=0&controls=1`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 0,
        }}
        loading="lazy"
      />
    </div>
  );
};

export default YouTubePlayer;
