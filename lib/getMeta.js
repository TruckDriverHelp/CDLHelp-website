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
          locale: locale,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${strapiApiKey}`,
        },
      }
    );

    const metaTagsData = response.data?.data?.metaTags?.data;
    const meta = metaTagsData[0].attributes;

    return {
      title: meta?.title,
      description: meta?.description,
      image: meta?.image?.data?.attributes?.url || null,
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
