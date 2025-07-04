import { gql } from 'graphql-request';

export const META_BY_META_ID_QUERY = gql`
  query metaByMetaID($metaID: String!, $locale: I18NLocaleCode) {
    metaTags(filters: { metaID: { eq: $metaID } }, locale: $locale) {
      data {
        attributes {
          title
          description
          image {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`;

export default META_BY_META_ID_QUERY;
