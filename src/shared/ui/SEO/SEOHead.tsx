import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { StructuredData, organizationSchema, websiteSchema } from './StructuredData';
import { MetaOptimizer } from '../../../../lib/meta-optimizer';

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

// Mapping of simple locale codes to proper hreflang locale codes
// URLs still use simple codes (/ru/), but hreflang uses proper codes (ru-RU)
const HREFLANG_LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  ru: 'ru-RU',
  uk: 'uk-UA',
  ar: 'ar-SA',
  ko: 'ko-KR',
  zh: 'zh-CN',
  tr: 'tr-TR',
  pt: 'pt-BR',
};

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

  // Generate alternate links for all supported languages
  const supportedLocales = ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];
  const generatedAlternateLinks: Record<string, string> = {};

  supportedLocales.forEach(lang => {
    if (lang === 'en') {
      // English URLs don't have locale prefix
      generatedAlternateLinks[lang] = pathWithoutLocale === '/' ? '/' : pathWithoutLocale;
    } else {
      // Other languages have locale prefix
      generatedAlternateLinks[lang] =
        pathWithoutLocale === '/' ? `/${lang}` : `/${lang}${pathWithoutLocale}`;
    }
  });

  // Use provided alternateLinks but ensure current locale is included
  const finalAlternateLinks =
    Object.keys(alternateLinks).length > 0
      ? {
          ...alternateLinks,
          // Ensure self-referencing hreflang
          [currentLocale]:
            alternateLinks[currentLocale] ||
            (currentLocale === 'en' ? pathWithoutLocale : `/${currentLocale}${pathWithoutLocale}`),
        }
      : generatedAlternateLinks;

  // Always ensure self-referencing hreflang is present
  if (!finalAlternateLinks[currentLocale]) {
    finalAlternateLinks[currentLocale] =
      currentLocale === 'en' ? pathWithoutLocale : `/${currentLocale}${pathWithoutLocale}`;
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

      {/* Alternate Language Links - URLs use simple codes (/ru/) but hreflang uses proper codes (ru-RU) */}
      <link
        rel="alternate"
        href={`${baseUrl}${finalAlternateLinks['en'] || '/'}`}
        hrefLang="x-default"
      />
      {Object.entries(finalAlternateLinks).map(([lang, path]) => (
        <link
          key={lang}
          rel="alternate"
          href={`${baseUrl}${path}`}
          hrefLang={HREFLANG_LOCALE_MAP[lang] || lang}
        />
      ))}

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
