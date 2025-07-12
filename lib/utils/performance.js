/**
 * Performance utilities for analytics optimization
 */

/**
 * Load script asynchronously with error handling
 */
export function loadScript(src, options = {}) {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('Document not available'));
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    if (options.defer) {
      script.defer = true;
    }

    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

    // Add to head or body based on preference
    const target = options.appendTo === 'body' ? document.body : document.head;
    target.appendChild(script);
  });
}

/**
 * Defer execution until after user interaction or timeout
 */
export function defer(callback, delay = 0) {
  if (typeof window === 'undefined') {
    callback();
    return;
  }

  let executed = false;

  const execute = () => {
    if (executed) return;
    executed = true;
    callback();
  };

  // Execute after user interaction
  const userEvents = ['click', 'scroll', 'keydown', 'touchstart'];
  const cleanup = () => {
    userEvents.forEach(event => document.removeEventListener(event, execute, { passive: true }));
  };

  userEvents.forEach(event =>
    document.addEventListener(
      event,
      () => {
        execute();
        cleanup();
      },
      { passive: true, once: true }
    )
  );

  // Fallback timeout
  setTimeout(() => {
    execute();
    cleanup();
  }, delay);
}

/**
 * Debounce function calls for performance
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if browser supports features
 */
export function supportsFeature(feature) {
  switch (feature) {
    case 'intersectionObserver':
      return typeof window !== 'undefined' && 'IntersectionObserver' in window;
    case 'requestIdleCallback':
      return typeof window !== 'undefined' && 'requestIdleCallback' in window;
    case 'visibilityAPI':
      return typeof document !== 'undefined' && 'visibilityState' in document;
    default:
      return false;
  }
}

/**
 * Execute when browser is idle
 */
export function whenIdle(callback, fallbackDelay = 5000) {
  if (supportsFeature('requestIdleCallback')) {
    requestIdleCallback(callback);
  } else {
    setTimeout(callback, fallbackDelay);
  }
}

/**
 * Bundle size analyzer helper
 */
export function measureBundleSize() {
  if (typeof performance === 'undefined' || !performance.getEntriesByType) {
    return null;
  }

  const resources = performance.getEntriesByType('resource');
  const jsResources = resources.filter(
    resource => resource.name.includes('.js') || resource.initiatorType === 'script'
  );

  return {
    totalJS: jsResources.reduce((total, resource) => total + (resource.transferSize || 0), 0),
    resources: jsResources.map(resource => ({
      name: resource.name,
      size: resource.transferSize || 0,
      loadTime: resource.responseEnd - resource.requestStart,
    })),
  };
}
