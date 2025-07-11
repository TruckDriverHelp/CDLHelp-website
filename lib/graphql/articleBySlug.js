import { gql } from 'graphql-request';

export const ARTICLE_BY_SLUG_QUERY = gql`
  query articleBySlug($slug: String!, $locale: String) {
    articles(filters: { slug: { eq: $slug }, locale: { eq: $locale } }) {
      documentId
      title
      description
      slug
      updatedAt
      publishedAt
      locale
      blog_post
      blog_page
      localizations {
        documentId
        slug
        locale
      }
      blocks {
        __typename
        ... on ComponentArticlePartsRichTextMarkdown {
          richtext
          idtag
        }
        ... on ComponentArticlePartsMedia {
          Media {
            url
            alternativeText
            width
            height
            caption
          }
        }
        ... on ComponentArticlePartsSlider {
          Slider {
            url
            alternativeText
            width
            height
          }
        }
        ... on ComponentArticlePartsQuote {
          Quote
        }
        ... on ComponentArticlePartsYouTube {
          YouTube
        }
        ... on ComponentArticlePartsRelatedArticles {
          articles {
            documentId
            title
            slug
            description
            blog_page
          }
        }
      }
      container {
        __typename
        ... on ComponentSharedContainer {
          container_after_paragraph
          container_title
          container_color
          container_icon
          container_text
          container_button_text
          container_sidenote
          container_sidenote_icon
        }
      }
      meta_tag {
        title
        description
        image {
          url
        }
      }
    }
  }
`;
