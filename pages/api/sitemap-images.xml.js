/**
 * Image Sitemap for CDL Help
 * Helps Google discover and index images for image search
 */

const SitemapGenerator = require('../../lib/sitemap-generator');

const SITE_URL = process.env.BASE_URL || 'https://www.cdlhelp.com';

// Define all images with their page associations
function getAllImages() {
  const images = {};

  // Homepage images
  images[`${SITE_URL}/`] = [
    {
      url: `${SITE_URL}/images/black-logo.png`,
      title: 'CDL Help Logo',
      caption: 'CDL Help - Your Complete CDL Practice Test App',
    },
    {
      url: `${SITE_URL}/images/home-7-8-9/app-download/download-2.png`,
      title: 'CDL Help Mobile App',
      caption: 'CDL Practice Test Mobile App Screenshot',
    },
    {
      url: `${SITE_URL}/images/video/video-3-no-text.webp`,
      title: 'CDL Training Video',
      caption: 'CDL Training and Practice Test Video',
    },
  ];

  // Download page images
  images[`${SITE_URL}/download`] = [
    {
      url: `${SITE_URL}/images/home-7-8-9/app-download/download-2.png`,
      title: 'Download CDL Help App',
      caption: 'Download CDL Practice Test App for iOS and Android',
    },
    {
      url: `${SITE_URL}/images/app-store-badge.png`,
      title: 'Download on App Store',
      caption: 'Download CDL Help on the App Store',
    },
    {
      url: `${SITE_URL}/images/google-play-badge.png`,
      title: 'Get it on Google Play',
      caption: 'Get CDL Help on Google Play',
    },
  ];

  // Pre-trip inspection images
  images[`${SITE_URL}/pre-trip-inspection/guide`] = [
    {
      url: `${SITE_URL}/images/pre-trip/engine-compartment.jpg`,
      title: 'CDL Pre-Trip Engine Compartment',
      caption: 'Engine compartment inspection for CDL pre-trip test',
    },
    {
      url: `${SITE_URL}/images/pre-trip/cab-inspection.jpg`,
      title: 'CDL Pre-Trip Cab Inspection',
      caption: 'Cab inspection checklist for CDL pre-trip test',
    },
    {
      url: `${SITE_URL}/images/pre-trip/trailer-inspection.jpg`,
      title: 'CDL Pre-Trip Trailer Inspection',
      caption: 'Trailer inspection guide for CDL pre-trip test',
    },
    {
      url: `${SITE_URL}/images/pre-trip/lights-inspection.jpg`,
      title: 'CDL Pre-Trip Lights Check',
      caption: 'Lights and reflectors inspection for CDL pre-trip test',
    },
  ];

  // Road signs test images
  images[`${SITE_URL}/road-signs/test`] = [
    {
      url: `${SITE_URL}/images/road-signs/stop-sign.png`,
      title: 'Stop Sign',
      caption: 'Stop sign for CDL road signs test',
    },
    {
      url: `${SITE_URL}/images/road-signs/yield-sign.png`,
      title: 'Yield Sign',
      caption: 'Yield sign for CDL road signs test',
    },
    {
      url: `${SITE_URL}/images/road-signs/no-parking.png`,
      title: 'No Parking Sign',
      caption: 'No parking sign for CDL road signs test',
    },
  ];

  // School pages images
  images[`${SITE_URL}/schools`] = [
    {
      url: `${SITE_URL}/images/schools/cdl-school-classroom.jpg`,
      title: 'CDL School Classroom',
      caption: 'CDL training school classroom environment',
    },
    {
      url: `${SITE_URL}/images/schools/truck-training.jpg`,
      title: 'CDL Truck Training',
      caption: 'Hands-on truck training at CDL school',
    },
  ];

  // State-specific school images
  const states = [
    'california',
    'florida',
    'illinois',
    'new-york',
    'ohio',
    'pennsylvania',
    'washington',
    'wisconsin',
  ];
  states.forEach(state => {
    images[`${SITE_URL}/schools/${state}`] = [
      {
        url: `${SITE_URL}/images/schools/${state}-cdl-schools.jpg`,
        title: `CDL Schools in ${state.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        caption: `Find the best CDL training schools in ${state.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
      },
    ];
  });

  // DOT Physical Exam images
  images[`${SITE_URL}/dot-physical-exam/search`] = [
    {
      url: `${SITE_URL}/images/dot-physical/medical-exam.jpg`,
      title: 'DOT Physical Exam',
      caption: 'DOT physical examination for CDL drivers',
    },
    {
      url: `${SITE_URL}/images/dot-physical/medical-certificate.jpg`,
      title: 'DOT Medical Certificate',
      caption: 'DOT medical examiner certificate for CDL',
    },
  ];

  // Blog/article images (sample)
  images[`${SITE_URL}/blog`] = [
    {
      url: `${SITE_URL}/images/blog/cdl-requirements.jpg`,
      title: 'CDL Requirements Guide',
      caption: 'Complete guide to CDL requirements and eligibility',
    },
    {
      url: `${SITE_URL}/images/blog/hazmat-endorsement.jpg`,
      title: 'Hazmat Endorsement Guide',
      caption: 'How to get your hazmat endorsement for CDL',
    },
    {
      url: `${SITE_URL}/images/blog/cdl-jobs.jpg`,
      title: 'CDL Job Opportunities',
      caption: 'Top CDL job opportunities and career paths',
    },
  ];

  // Open Graph images for different locales
  const locales = ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];
  locales.forEach(locale => {
    const pageUrl = locale === 'en' ? `${SITE_URL}/` : `${SITE_URL}/${locale}`;
    if (!images[pageUrl]) {
      images[pageUrl] = [];
    }
    images[pageUrl].push({
      url: `${SITE_URL}/images/og/og-default${locale !== 'en' ? `-${locale}` : ''}.jpg`,
      title: `CDL Help ${locale.toUpperCase()}`,
      caption: `CDL Practice Test App - ${locale.toUpperCase()} version`,
    });
  });

  return images;
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');

  try {
    const generator = new SitemapGenerator();
    const pageImages = getAllImages();

    // Validate and build sitemap
    const xml = generator.buildImageSitemap(pageImages);
    const validation = generator.validateSitemap(xml);

    if (!validation.valid) {
      console.error('Image sitemap validation errors:', validation.errors);
    }

    res.status(200).send(xml);
  } catch (error) {
    console.error('Error generating image sitemap:', error);

    // Return minimal valid sitemap on error
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE_URL}/</loc>
    <image:image>
      <image:loc>${SITE_URL}/images/black-logo.png</image:loc>
      <image:title>CDL Help</image:title>
    </image:image>
  </url>
</urlset>`;

    res.status(500).send(fallbackXml);
  }
}
