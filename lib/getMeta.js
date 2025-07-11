import META_BY_META_ID_QUERY from './graphql/metaByMetaID';
import axios from 'axios';

async function getMeta(locale, metaID) {
  try {
    const strapiHost = process.env.STRAPI_HOST;
    const strapiPort = process.env.STRAPI_PORT;
    const strapiApiKey = process.env.STRAPI_API_KEY;
    const url = `http://${strapiHost}:${strapiPort}/graphql`;

    const response = await axios.post(
      url,
      {
        query: META_BY_META_ID_QUERY,
        variables: {
          metaID: metaID,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${strapiApiKey}`,
        },
      }
    );

    const metaTags = response.data?.data?.metaTags || [];
    const meta = metaTags[0];

    return {
      title: meta?.title || null,
      description: meta?.description || null,
      image: meta?.image?.url || null,
    };
  } catch (error) {
    console.error('Error fetching meta data:', error);
    // Return default meta object to prevent undefined
    return {
      title: null,
      description: null,
      image: null,
    };
  }
}

export default getMeta;
