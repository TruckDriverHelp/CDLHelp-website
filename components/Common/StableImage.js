import Image from 'next/image';
import { useState } from 'react';

/**
 * Image component that prevents CLS by reserving space before image loads
 * Uses aspect ratio to maintain layout stability
 */
export default function StableImage({
  src,
  alt,
  width,
  height,
  aspectRatio,
  className = '',
  priority = false,
  objectFit = 'cover',
  quality = 85,
}) {
  const [isLoading, setIsLoading] = useState(true);

  // Calculate dimensions from aspect ratio if not provided
  const finalWidth = width || (aspectRatio ? 800 : undefined);
  const finalHeight =
    height || (aspectRatio && width ? Math.round(width / aspectRatio) : undefined);

  // Generate shimmer placeholder for better perceived performance
  const shimmer = (w, h) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f0f0f0" offset="20%" />
          <stop stop-color="#eeeeee" offset="50%" />
          <stop stop-color="#f0f0f0" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#f0f0f0" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite" />
    </svg>`;

  const toBase64 = str =>
    typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);

  const blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(finalWidth, finalHeight))}`;

  return (
    <div
      className={`image-container ${className} ${isLoading ? 'skeleton' : ''}`}
      style={{
        aspectRatio: aspectRatio || `${finalWidth}/${finalHeight}`,
        maxWidth: finalWidth,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={finalWidth}
        height={finalHeight}
        priority={priority}
        quality={quality}
        placeholder="blur"
        blurDataURL={blurDataURL}
        onLoadingComplete={() => setIsLoading(false)}
        style={{
          width: '100%',
          height: 'auto',
          objectFit: objectFit,
        }}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    </div>
  );
}
