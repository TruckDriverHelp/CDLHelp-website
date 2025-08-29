import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { StructuredData, organizationSchema, websiteSchema } from './StructuredData';
import { MetaOptimizer } from '../../../../lib/meta-optimizer';
import {
  generateHreflangUrls,
  shouldHaveHreflang,
  HREFLANG_LOCALE_MAP,
} from '../../../../lib/hreflang-config';

export interface SEOHeadProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: 'website' | 'article';
  siteName?: string;
  locale?: string;
  alternateLinks?: Record<string, string>;
  noindex?: boolean;
  canonical?: string;
  keywords?: string[];
  article?: {
    publishedAt?: string;
    updatedAt?: string;
    author?: string;
    tags?: string[];
  };
}

// HREFLANG_LOCALE_MAP is now imported from hreflang-config.js

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  url,
  image = '/images/truckdriverhelp-og.jpg',
  type = 'website',
  siteName = 'CDL Help',
  locale,
  alternateLinks = {},
  noindex = false,
  canonical,
  keywords = [],
  article,
}) => {
  const router = useRouter();
  const currentLocale = locale || router.locale || 'en';
  const baseUrl = 'https://www.cdlhelp.com';
  // Remove query parameters from the path for canonical URL
  const cleanPath = router.asPath.split('?')[0].split('#')[0];
  const fullUrl = url || `${baseUrl}${cleanPath}`;
  const canonicalUrl = canonical || fullUrl;

  // Initialize meta optimizer
  const optimizer = new MetaOptimizer(currentLocale);

  // Optimize meta content
  const optimizedTitle = optimizer.optimizeTitle(title, { keywords });
  const optimizedDescription = optimizer.optimizeDescription(description, { keywords });

  // Generate Open Graph tags
  const ogTags = optimizer.generateOpenGraph({
    title,
    description,
    image: image.startsWith('http') ? image : `${baseUrl}${image}`,
    url: fullUrl,
    type,
    locale: currentLocale,
  });

  // Generate Twitter Card tags
  const twitterTags = optimizer.generateTwitterCard({
    title,
    description,
    image: image.startsWith('http') ? image : `${baseUrl}${image}`,
  });

  // Generate proper alternate links based on current path
  const currentPath = router.asPath;
  const pathWithoutLocale = currentPath.replace(/^\/(ru|uk|ar|ko|zh|tr|pt)(\/|$)/, '/');

  // Check if this page should have hreflang tags
  const shouldAddHreflang = shouldHaveHreflang(pathWithoutLocale);

  // Generate appropriate alternate links
  let finalAlternateLinks: Record<string, string> = {};

  if (shouldAddHreflang) {
    // If explicit alternateLinks are provided, use them
    if (Object.keys(alternateLinks).length > 0) {
      finalAlternateLinks = alternateLinks;

      // Ensure self-referencing hreflang is included
      if (!finalAlternateLinks[currentLocale]) {
        finalAlternateLinks[currentLocale] =
          currentLocale === 'en' ? pathWithoutLocale : `/${currentLocale}${pathWithoutLocale}`;
      }
    } else {
      // Generate hreflang URLs based on actual available translations
      finalAlternateLinks = generateHreflangUrls(pathWithoutLocale, currentLocale);
    }
  }

  return (
    <Head>
      {/* Basic Meta Tags - Optimized */}
      <title>{optimizedTitle}</title>
      <meta name="description" content={optimizedDescription} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Google / Search Engine Tags */}
      <meta itemProp="name" content={optimizedTitle} />
      <meta itemProp="description" content={optimizedDescription} />
      <meta itemProp="image" content={image.startsWith('http') ? image : `${baseUrl}${image}`} />

      {/* Facebook / Open Graph Meta Tags - Optimized */}
      {Object.entries(ogTags).map(([key, value]) => (
        <meta key={key} property={key} content={value as string} />
      ))}

      {/* Twitter Meta Tags - Optimized */}
      {Object.entries(twitterTags).map(([key, value]) => (
        <meta key={key} name={key} content={value as string} />
      ))}

      {/* Article specific meta */}
      {article && type === 'article' && (
        <>
          {article.publishedAt && (
            <meta property="article:published_time" content={article.publishedAt} />
          )}
          {article.updatedAt && (
            <meta property="article:modified_time" content={article.updatedAt} />
          )}
          {article.author && <meta property="article:author" content={article.author} />}
          {article.tags?.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Alternate Language Links - Only render if we have valid alternate links */}
      {shouldAddHreflang && Object.keys(finalAlternateLinks).length > 0 && (
        <>
          {/* Add hreflang for each available translation */}
          {/* Note: We're not using x-default to avoid "multiple entries" warnings in SEO tools */}
          {/* The en-US version serves as the default for English speakers */}
          {Object.entries(finalAlternateLinks).map(([lang, path]) => (
            <link
              key={lang}
              rel="alternate"
              href={`${baseUrl}${path}`}
              hrefLang={HREFLANG_LOCALE_MAP[lang] || lang}
            />
          ))}
        </>
      )}

      {/* Organization and Website structured data (on homepage only) */}
      {router.pathname === '/' && (
        <>
          <StructuredData data={organizationSchema} />
          <StructuredData data={websiteSchema} />
        </>
      )}

      {/* Additional structured data for articles */}
      {type === 'article' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: title,
              description: description,
              image: image,
              url: fullUrl,
              publisher: {
                '@type': 'Organization',
                name: siteName,
                logo: {
                  '@type': 'ImageObject',
                  url: `${baseUrl}/images/black-logo.png`,
                },
              },
            }),
          }}
        />
      )}
    </Head>
  );
};
