import Image from 'next/image';
import { useState } from 'react';

/**
 * Optimized hero image component for improved LCP (Largest Contentful Paint)
 * Uses Next.js Image component with priority loading and proper sizing
 */
export default function HeroImage({
  src,
  alt,
  priority = true,
  className = '',
  objectFit = 'cover',
  objectPosition = 'center',
  width = 1920,
  height = 1080,
}) {
  const [isLoading, setLoading] = useState(true);

  // Generate shimmer placeholder for better perceived performance
  const shimmer = (w, h) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f5f5f5" offset="20%" />
          <stop stop-color="#eeeeee" offset="50%" />
          <stop stop-color="#f5f5f5" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#f5f5f5" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite" />
    </svg>`;

  const toBase64 = str =>
    typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);

  const blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`;

  return (
    <div className={`hero-image-container ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={85}
        placeholder="blur"
        blurDataURL={blurDataURL}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px"
        style={{
          objectFit: objectFit,
          objectPosition: objectPosition,
          width: '100%',
          height: 'auto',
        }}
        onLoadingComplete={() => setLoading(false)}
        className={`
          hero-image
          duration-700 ease-in-out
          ${isLoading ? 'scale-105 blur-sm' : 'scale-100 blur-0'}
        `}
      />
      <style jsx>{`
        .hero-image-container {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .hero-image {
          transition:
            opacity 0.3s ease-in-out,
            transform 0.7s ease-in-out,
            filter 0.7s ease-in-out;
        }
      `}</style>
    </div>
  );
}
