export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check environment variables
    const strapiHost = process.env.STRAPI_HOST;
    const strapiPort = process.env.STRAPI_PORT;
    const strapiApiKey = process.env.STRAPI_API_KEY;

    if (!strapiHost || !strapiPort || !strapiApiKey) {
      return res.status(500).json({
        error: 'Missing Strapi configuration',
        config: {
          STRAPI_HOST: strapiHost || 'missing',
          STRAPI_PORT: strapiPort || 'missing',
          STRAPI_API_KEY: strapiApiKey ? '***' : 'missing',
        },
      });
    }

    // Test the connection
    const url = `http://${strapiHost}:${strapiPort}/api/dmv-road-signs?populate=*&locale=en&pagination[limit]=1`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${strapiApiKey}`,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Strapi API error: ${response.status}`,
        statusText: response.statusText,
        url: url,
      });
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      message: 'Strapi connection successful',
      dataCount: data.data ? data.data.length : 0,
      hasData: !!data.data && Array.isArray(data.data),
      url: url,
    });
  } catch (error) {
    console.error('Strapi test error:', error);
    return res.status(500).json({
      error: 'Failed to connect to Strapi',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}
