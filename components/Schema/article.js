export default function ArticleSchema(slug, headline, images) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: headline,
          image: images,
          datePublished: '2024-01-05T08:00:00+08:00',
          dateModified: '2024-02-05T09:20:00+08:00',
          author: [
            {
              '@type': 'Organization',
              name: 'CDL Help',
              url: 'https://www.cdlhelp.com',
            },
          ],
        }),
      }}
    />
  );
}
