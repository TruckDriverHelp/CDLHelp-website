import { useEffect } from 'react';

const AsyncStyles = () => {
  useEffect(() => {
    // Load non-critical CSS asynchronously
    const loadStyle = href => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.media = 'print';
      link.onload = function () {
        this.media = 'all';
      };
      document.head.appendChild(link);
    };

    // Load library CSS files asynchronously
    const stylesheets = ['/css/fontawesome.min.css', '/css/remixicon.css', '/css/animate.min.css'];

    // Load with a small delay to prioritize critical content
    setTimeout(() => {
      stylesheets.forEach(loadStyle);
    }, 100);
  }, []);

  return null;
};

export default AsyncStyles;
