/**
 * CLS (Cumulative Layout Shift) monitoring
 * Tracks layout shifts and reports high CLS events
 */

export function initCLSMonitoring() {
  if (typeof window === 'undefined') return;

  let clsScore = 0;
  let clsEntries = [];
  let sessionValue = 0;
  let sessionEntries = [];

  // Create PerformanceObserver for layout shifts
  const observer = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      // Only count shifts without user input
      if (!entry.hadRecentInput) {
        const value = entry.value;
        sessionValue += value;
        clsScore += value;

        const shiftData = {
          value: value,
          startTime: entry.startTime,
          sources: entry.sources?.map(source => ({
            node: source.node?.tagName || source.node?.className || 'unknown',
            previousRect: source.previousRect,
            currentRect: source.currentRect,
          })),
        };

        sessionEntries.push(shiftData);
        clsEntries.push(shiftData);

        // Log high CLS events in development
        if (process.env.NODE_ENV === 'development' && value > 0.05) {
          console.warn('⚠️ High CLS detected:', {
            value: value.toFixed(4),
            sources: entry.sources,
            totalCLS: clsScore.toFixed(4),
            element: entry.sources?.[0]?.node,
          });

          // Highlight the shifting element in development
          if (entry.sources?.[0]?.node) {
            const element = entry.sources[0].node;
            element.style.outline = '2px solid red';
            setTimeout(() => {
              element.style.outline = '';
            }, 2000);
          }
        }

        // Create a new session after 5 seconds gap
        if (
          sessionEntries.length &&
          entry.startTime - sessionEntries[sessionEntries.length - 1].startTime > 5000
        ) {
          // Report session if it had significant CLS
          if (sessionValue > 0.1) {
            reportCLSSession(sessionValue, sessionEntries);
          }
          sessionValue = 0;
          sessionEntries = [];
        }
      }
    }
  });

  try {
    observer.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    // PerformanceObserver not supported

    return () => {};
  }

  // Report CLS session to analytics
  function reportCLSSession(value, entries) {
    // Send to Google Analytics if available
    if (window.gtag) {
      window.gtag('event', 'CLS', {
        event_category: 'Web Vitals',
        event_label: 'CLS Session',
        value: Math.round(value * 1000), // Convert to milliseconds
        non_interaction: true,
        custom_map: {
          cls_score: value,
          cls_entries: entries.length,
        },
      });
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 CLS Session Report:', {
        score: value.toFixed(4),
        entries: entries.length,
        details: entries,
      });
    }
  }

  // Report final CLS on page unload
  const reportFinalCLS = () => {
    if (clsScore > 0) {
      // Report to analytics
      if (window.gtag) {
        window.gtag('event', 'CLS_Final', {
          event_category: 'Web Vitals',
          event_label: window.location.pathname,
          value: Math.round(clsScore * 1000),
          non_interaction: true,
        });
      }

      // Send beacon if available
      if ('sendBeacon' in navigator && process.env.NEXT_PUBLIC_CLS_ENDPOINT) {
        const data = JSON.stringify({
          cls: clsScore,
          entries: clsEntries.length,
          url: window.location.href,
          timestamp: Date.now(),
        });
        navigator.sendBeacon(process.env.NEXT_PUBLIC_CLS_ENDPOINT, data);
      }
    }
  };

  // Listen for page unload
  window.addEventListener('pagehide', reportFinalCLS);
  window.addEventListener('beforeunload', reportFinalCLS);

  // Also report when visibility changes (mobile browsers)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      reportFinalCLS();
    }
  });

  // Return cleanup function
  return () => {
    observer.disconnect();
    window.removeEventListener('pagehide', reportFinalCLS);
    window.removeEventListener('beforeunload', reportFinalCLS);
  };
}

/**
 * Helper to prevent CLS from specific elements
 */
export function preventCLS(element, minHeight = '100px') {
  if (!element) return;

  // Set minimum height to prevent collapse
  if (!element.style.minHeight) {
    element.style.minHeight = minHeight;
  }

  // Add skeleton loading class if content is loading
  if (!element.querySelector('img[complete="false"]')) {
    element.classList.add('skeleton');

    // Remove skeleton when content loads
    const images = element.querySelectorAll('img');
    let loadedCount = 0;

    images.forEach(img => {
      if (img.complete) {
        loadedCount++;
      } else {
        img.addEventListener('load', () => {
          loadedCount++;
          if (loadedCount === images.length) {
            element.classList.remove('skeleton');
          }
        });
      }
    });

    if (loadedCount === images.length) {
      element.classList.remove('skeleton');
    }
  }
}

/**
 * Set up intersection observer for lazy-loaded content
 */
export function setupLazyLoadObserver() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const lazyElements = document.querySelectorAll('[data-lazy]');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;

          // Reserve space before loading
          const height = element.getAttribute('data-lazy-height');
          if (height) {
            element.style.minHeight = height;
          }

          // Load the content
          const src = element.getAttribute('data-lazy-src');
          if (src) {
            if (element.tagName === 'IMG') {
              element.src = src;
            } else {
              // For other elements, fetch and insert content
              fetch(src)
                .then(response => response.text())
                .then(html => {
                  element.innerHTML = html;
                  element.classList.remove('skeleton');
                });
            }
          }

          observer.unobserve(element);
        }
      });
    },
    {
      rootMargin: '50px',
    }
  );

  lazyElements.forEach(element => {
    // Add skeleton loading state
    element.classList.add('skeleton');
    observer.observe(element);
  });
}
