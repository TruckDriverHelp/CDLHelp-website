import axios from 'axios';

export default async function handler(req, res) {
  const { locale = 'en' } = req.query;

  try {
    const graphqlUrl = `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/graphql`;

    // Strapi v5 query
    const query = `
      query GetRoadSigns($locale: I18NLocaleCode) {
        dmvRoadSigns(pagination: { limit: 100 }, locale: $locale) {
          documentId
          original_name
          translated_name
          Sign {
            url
            alternativeText
          }
        }
      }
    `;

    const response = await axios.post(
      graphqlUrl,
      {
        query,
        variables: { locale },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
        },
      }
    );

    if (response.data.errors) {
      // Fallback to query without locale variable
      const fallbackQuery = `
        query GetRoadSigns {
          dmvRoadSigns(pagination: { limit: 100 }) {
            documentId
            original_name
            translated_name
            Sign {
              url
              alternativeText
            }
          }
        }
      `;

      const fallbackResponse = await axios.post(
        graphqlUrl,
        { query: fallbackQuery },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
          },
        }
      );

      if (fallbackResponse.data.errors) {
        throw new Error('GraphQL query failed');
      }

      res.status(200).json({
        data: fallbackResponse.data.data.dmvRoadSigns || [],
      });
      return;
    }

    res.status(200).json({
      data: response.data.data.dmvRoadSigns || [],
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch road signs' });
  }
}
