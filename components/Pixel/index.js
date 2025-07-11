import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import pixel implementations
const FacebookPixel = dynamic(() => import('./facebook/pixel-1'), {
  ssr: false,
});

const Pixel = ({ name }) => {
  // Map pixel names to components
  const pixelComponents = {
    FACEBOOK_PIXEL_1: FacebookPixel,
  };

  const PixelComponent = pixelComponents[name];

  if (!PixelComponent) {
    return null;
  }

  return <PixelComponent />;
};

export default Pixel;
