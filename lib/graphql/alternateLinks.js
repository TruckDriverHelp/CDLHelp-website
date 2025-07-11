import { gql } from 'graphql-request';

export const ALTERNATE_LINKS_QUERY = gql`
  query alternateLinks($slug: String!) {
    articles(filters: { slug: { eq: $slug } }) {
      locale
      slug
      blog_page
      localizations {
        locale
        slug
        blog_page
      }
    }
  }
`;
