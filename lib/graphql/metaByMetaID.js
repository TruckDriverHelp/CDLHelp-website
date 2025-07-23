import { gql } from 'graphql-request';

export const META_BY_META_ID_QUERY = gql`
  query metaByMetaID($metaID: String!, $locale: String) {
    metaTags(filters: { metaID: { eq: $metaID }, locale: { eq: $locale } }) {
      documentId
      title
      description
      image {
        url
        alternativeText
        width
        height
      }
    }
  }
`;

export default META_BY_META_ID_QUERY;
