import { gql } from 'graphql-request';

export const ALTERNATE_LINKS_QUERY = gql`
  query alternateLinks($slug: String!, $locale: I18NLocaleCode) {
    articles(filters: { slug: { eq: $slug } }, locale: $locale) {
      data {
        attributes {
          locale
          slug
          blog_page
          localizations {
            data {
              attributes {
                locale
                slug
                blog_page
              }
            }
          }
        }
      }
    }
  }
`;
