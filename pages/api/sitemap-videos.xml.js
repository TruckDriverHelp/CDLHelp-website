/**
 * Video Sitemap for CDL Help
 * Enables rich video snippets in Google search results
 */

const SitemapGenerator = require('../../lib/sitemap-generator');

const SITE_URL = process.env.BASE_URL || 'https://www.cdlhelp.com';

// Define video content
function getVideoContent() {
  return [
    {
      pageUrl: '/pre-trip-inspection/guide',
      title: 'CDL Pre-Trip Inspection Complete Guide',
      description:
        'Learn how to perform a complete CDL pre-trip inspection step-by-step. This comprehensive guide covers engine compartment, cab, trailer, and all required inspection points.',
      thumbnailUrl: '/images/video/pre-trip-thumb.jpg',
      contentUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Replace with actual video URL
      duration: 1200, // 20 minutes in seconds
      publicationDate: '2024-01-15T00:00:00+00:00',
      expirationDate: '2025-12-31T23:59:59+00:00',
      rating: 4.8,
      viewCount: 150000,
      familyFriendly: true,
      requiresSubscription: false,
      uploader: {
        name: 'CDL Help',
        info: 'https://www.cdlhelp.com',
      },
      live: false,
      tags: ['CDL', 'pre-trip inspection', 'truck inspection', 'CDL test', 'commercial driving'],
      category: 'Education',
    },
    {
      pageUrl: '/',
      title: 'CDL Practice Test App Overview',
      description:
        'Get an overview of the CDL Help app - the most comprehensive CDL practice test application with all endorsements, pre-trip inspection, and road signs.',
      thumbnailUrl: '/images/video/app-overview-thumb.jpg',
      contentUrl: 'https://player.vimeo.com/video/123456789', // Replace with actual video URL
      duration: 180, // 3 minutes
      publicationDate: '2024-02-01T00:00:00+00:00',
      rating: 4.9,
      viewCount: 250000,
      familyFriendly: true,
      requiresSubscription: false,
      uploader: {
        name: 'CDL Help',
        info: 'https://www.cdlhelp.com',
      },
      live: false,
      tags: ['CDL app', 'CDL practice test', 'CDL study guide', 'truck driver training'],
      category: 'Education',
    },
    {
      pageUrl: '/road-signs/test',
      title: 'CDL Road Signs Test Tutorial',
      description:
        'Master all road signs required for your CDL test. Interactive tutorial covering warning signs, regulatory signs, and guide signs.',
      thumbnailUrl: '/images/video/road-signs-thumb.jpg',
      contentUrl: 'https://www.youtube.com/watch?v=abc123', // Replace with actual video URL
      duration: 600, // 10 minutes
      publicationDate: '2024-01-20T00:00:00+00:00',
      rating: 4.7,
      viewCount: 75000,
      familyFriendly: true,
      requiresSubscription: false,
      uploader: {
        name: 'CDL Help',
        info: 'https://www.cdlhelp.com',
      },
      live: false,
      tags: ['road signs', 'CDL test', 'traffic signs', 'highway signs'],
      category: 'Education',
    },
    {
      pageUrl: '/schools',
      title: 'How to Choose the Right CDL School',
      description:
        'Expert guide on selecting the best CDL training school. Learn what to look for, questions to ask, and how to evaluate CDL schools.',
      thumbnailUrl: '/images/video/cdl-schools-thumb.jpg',
      contentUrl: 'https://www.youtube.com/watch?v=xyz789', // Replace with actual video URL
      duration: 480, // 8 minutes
      publicationDate: '2024-02-10T00:00:00+00:00',
      rating: 4.6,
      viewCount: 45000,
      familyFriendly: true,
      requiresSubscription: false,
      uploader: {
        name: 'CDL Help',
        info: 'https://www.cdlhelp.com',
      },
      live: false,
      tags: ['CDL school', 'truck driving school', 'CDL training', 'career training'],
      category: 'Education',
    },
    {
      pageUrl: '/blog/hazmat-endorsement-guide',
      title: 'Complete Hazmat Endorsement Study Guide',
      description:
        'Everything you need to know to pass your hazmat endorsement test. Covers all regulations, safety procedures, and test questions.',
      thumbnailUrl: '/images/video/hazmat-thumb.jpg',
      contentUrl: 'https://www.youtube.com/watch?v=hazmat123', // Replace with actual video URL
      duration: 900, // 15 minutes
      publicationDate: '2024-01-25T00:00:00+00:00',
      rating: 4.8,
      viewCount: 95000,
      familyFriendly: true,
      requiresSubscription: false,
      uploader: {
        name: 'CDL Help',
        info: 'https://www.cdlhelp.com',
      },
      live: false,
      tags: ['hazmat', 'CDL endorsement', 'hazardous materials', 'CDL test'],
      category: 'Education',
    },
    {
      pageUrl: '/blog/air-brakes-test-guide',
      title: 'CDL Air Brakes Test Complete Tutorial',
      description:
        'Master the CDL air brakes test with this comprehensive tutorial. Learn pre-trip inspection, operation, and all test questions.',
      thumbnailUrl: '/images/video/air-brakes-thumb.jpg',
      contentUrl: 'https://www.youtube.com/watch?v=airbrakes456', // Replace with actual video URL
      duration: 1080, // 18 minutes
      publicationDate: '2024-02-05T00:00:00+00:00',
      rating: 4.9,
      viewCount: 180000,
      familyFriendly: true,
      requiresSubscription: false,
      uploader: {
        name: 'CDL Help',
        info: 'https://www.cdlhelp.com',
      },
      live: false,
      tags: ['air brakes', 'CDL test', 'brake system', 'truck brakes', 'CDL endorsement'],
      category: 'Education',
    },
    {
      pageUrl: '/dot-physical-exam/search',
      title: 'DOT Physical Exam: What to Expect',
      description:
        'Prepare for your DOT physical exam. Learn what tests are performed, requirements, and how to ensure you pass your medical certification.',
      thumbnailUrl: '/images/video/dot-physical-thumb.jpg',
      contentUrl: 'https://www.youtube.com/watch?v=dotphysical789', // Replace with actual video URL
      duration: 420, // 7 minutes
      publicationDate: '2024-02-08T00:00:00+00:00',
      rating: 4.5,
      viewCount: 60000,
      familyFriendly: true,
      requiresSubscription: false,
      uploader: {
        name: 'CDL Help',
        info: 'https://www.cdlhelp.com',
      },
      live: false,
      tags: ['DOT physical', 'medical exam', 'CDL medical', 'driver health'],
      category: 'Education',
    },
  ];
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');

  try {
    const generator = new SitemapGenerator();
    const videos = getVideoContent();

    // Build video sitemap
    const xml = generator.buildVideoSitemap(videos, SITE_URL);

    // Validate sitemap
    const validation = generator.validateSitemap(xml);
    if (!validation.valid) {
      console.error('Video sitemap validation errors:', validation.errors);
    }

    res.status(200).send(xml);
  } catch (error) {
    console.error('Error generating video sitemap:', error);

    // Return minimal valid sitemap on error
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>${SITE_URL}/</loc>
    <video:video>
      <video:thumbnail_loc>${SITE_URL}/images/video/app-overview-thumb.jpg</video:thumbnail_loc>
      <video:title>CDL Practice Test App</video:title>
      <video:description>CDL Practice Test Application</video:description>
      <video:content_loc>https://www.youtube.com/watch?v=example</video:content_loc>
    </video:video>
  </url>
</urlset>`;

    res.status(500).send(fallbackXml);
  }
}
