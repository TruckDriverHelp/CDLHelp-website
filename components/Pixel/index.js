import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import pixel implementations
const FacebookPixel = dynamic(() => import('./facebook/pixel-1'), {
  ssr: false,
});

// Advanced Facebook Pixel with user data hashing
const FacebookPixelAdvanced = dynamic(() => import('./facebook/pixel-advanced'), {
  ssr: false,
});

const Pixel = ({ name }) => {
  // Map pixel names to components
  const pixelComponents = {
    FACEBOOK_PIXEL_1: FacebookPixel,
    FACEBOOK_PIXEL_ADVANCED: FacebookPixelAdvanced,  // New advanced implementation
  };

  const PixelComponent = pixelComponents[name];

  if (!PixelComponent) {
    return null;
  }

  return <PixelComponent />;
};

export default Pixel;
