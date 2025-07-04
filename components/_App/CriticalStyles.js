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
      padding: 12px 30px;
      font-size: 16px;
      font-weight: 500;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      cursor: pointer;
      user-select: none;
      border: 1px solid transparent;
      border-radius: 5px;
      transition: all 0.3s;
      background-color: #5a5886;
      color: #fff;
    }

    .default-btn:hover {
      background-color: #4a4876;
      transform: translateY(-2px);
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
