import { gql } from 'graphql-request';

export const ARTICLES_LIST_QUERY = gql`
  query GetArticlesList($locale: I18NLocaleCode, $page: Int!, $pageSize: Int!) {
    articles(
      locale: $locale
      pagination: { page: $page, pageSize: $pageSize }
      sort: "publishedAt:desc"
    ) {
      data {
        id
        attributes {
          slug
          title
          publishedAt
        }
      }
      meta {
        pagination {
          total
          page
          pageSize
          pageCount
        }
      }
    }
  }
`;

export const BLOG_META_QUERY = gql`
  query GetBlogMeta($locale: I18NLocaleCode) {
    blogPage(locale: $locale) {
      data {
        attributes {
          title
          description
          meta {
            title
            description
          }
        }
      }
    }
  }
`;