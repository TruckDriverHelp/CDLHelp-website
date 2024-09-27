import META_BY_META_ID_QUERY from "./graphql/metaByMetaID";
import axios from "axios";

async function getMeta(locale, metaID) {
    const url = `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/graphql`;

    const response = await axios.post(url, {
        query: META_BY_META_ID_QUERY,
        variables: {
            metaID: metaID,
            locale: locale,
        }},
        {
        headers: {
            Authorization: `Bearer ${process.env.STRAPI_API_KEY}`
            }
        }
    );
    const meta = response.data.data.metaTags.data[0].attributes;

    return {
        title: meta.title,
        description: meta.description,
        image: meta.image.data.attributes.url
    }
}

export default getMeta;