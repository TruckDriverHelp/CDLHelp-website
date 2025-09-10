// Critical CSS that should be loaded immediately
const CriticalStyles = () => (
  <style jsx global>{`
    /* Critical CSS for above-the-fold content */

    /* Reset and base styles */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      font-size: 16px;
      -webkit-text-size-adjust: 100%;
    }

    body {
      margin: 0;
      padding: 0;
      padding-top: 150px;
      font-family: var(
        --fontFamily,
        -apple-system,
        BlinkMacSystemFont,
        'Segoe UI',
        Roboto,
        'Helvetica Neue',
        Arial,
        sans-serif
      );
      font-size: 16px;
      line-height: 1.5;
      color: #262a37;
      background-color: #fff;
    }

    /* Critical layout styles */
    .container {
      width: 100%;
      padding-right: 15px;
      padding-left: 15px;
      margin-right: auto;
      margin-left: auto;
    }

    @media (min-width: 576px) {
      .container {
        max-width: 540px;
      }
    }

    @media (min-width: 768px) {
      .container {
        max-width: 720px;
      }
    }

    @media (min-width: 992px) {
      .container {
        max-width: 960px;
      }
    }

    @media (min-width: 1200px) {
      .container {
        max-width: 1200px;
      }
    }

    /* Critical typography */
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: 0;
      margin-bottom: 0.5rem;
      font-weight: 700;
      line-height: 1.2;
      color: #262a37;
    }

    p {
      margin-top: 0;
      margin-bottom: 1rem;
    }

    a {
      color: #262a37;
      text-decoration: none;
      background-color: transparent;
    }

    a:hover {
      color: #5a5886;
    }

    img {
      vertical-align: middle;
      border-style: none;
      max-width: 100%;
      height: auto;
    }

    /* Critical button styles */
    .default-btn {
      display: inline-block;
      padding: 14px 32px;
      font-size: 15px;
      font-weight: 600;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      cursor: pointer;
      user-select: none;
      border: none;
      border-radius: 50px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: linear-gradient(135deg, #4a4876 0%, #6b689a 100%);
      color: #fff;
      position: relative;
      overflow: hidden;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .default-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #6b689a 0%, #4a4876 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: -1;
    }

    .default-btn:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 10px 20px rgba(74, 72, 118, 0.3);
    }

    .default-btn:hover::before {
      opacity: 1;
    }

    .default-btn:active {
      transform: translateY(0) scale(1);
    }

    /* Critical utilities */
    .d-none {
      display: none !important;
    }

    .d-block {
      display: block !important;
    }

    .d-flex {
      display: flex !important;
    }

    .text-center {
      text-align: center !important;
    }

    /* Prevent layout shift */
    .navbar {
      min-height: 70px;
    }

    /* Loading states */
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }

    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `}</style>
);

export default CriticalStyles;
