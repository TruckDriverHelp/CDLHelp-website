/**
 * Font Loader using Web Font Loading API
 * Optimizes font loading to prevent render-blocking
 */

export const loadInterFont = () => {
  if (typeof window === 'undefined') return;

  // Check if font is already loaded
  if (document.fonts && document.fonts.check('1em Inter')) {
    return;
  }

  // Create a link element for preconnect
  const preconnect = document.createElement('link');
  preconnect.rel = 'preconnect';
  preconnect.href = 'https://fonts.googleapis.com';
  preconnect.crossOrigin = 'anonymous';

  const preconnect2 = document.createElement('link');
  preconnect2.rel = 'preconnect';
  preconnect2.href = 'https://fonts.gstatic.com';
  preconnect2.crossOrigin = 'anonymous';

  // Create font face CSS
  const fontFaceCSS = `
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 100 900;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 100 900;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfAZJhrib2Bg-4.woff2) format('woff2');
      unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 100 900;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuBWfAZJhrib2Bg-4.woff2) format('woff2');
      unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
    }
  `;

  // Add preconnect links
  document.head.appendChild(preconnect);
  document.head.appendChild(preconnect2);

  // Create and add style element
  const style = document.createElement('style');
  style.textContent = fontFaceCSS;
  document.head.appendChild(style);

  // Set CSS variable once font is loaded
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      document.documentElement.style.setProperty('--font-inter', 'Inter');
    });
  } else {
    // Fallback for browsers without Font Loading API
    setTimeout(() => {
      document.documentElement.style.setProperty('--font-inter', 'Inter');
    }, 100);
  }
};
