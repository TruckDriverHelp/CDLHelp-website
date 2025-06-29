import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

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
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  url,
  image = "/images/truckdriverhelp-og.jpg",
  type = "website",
  siteName = "CDL Help",
  locale,
  alternateLinks = {},
  noindex = false,
  canonical
}) => {
  const router = useRouter();
  const currentLocale = locale || router.locale || 'en';
  const baseUrl = "https://www.cdlhelp.com";
  const fullUrl = url || `${baseUrl}${router.asPath}`;
  const canonicalUrl = canonical || fullUrl;

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
      generatedAlternateLinks[lang] = pathWithoutLocale === '/' 
        ? `/${lang}` 
        : `/${lang}${pathWithoutLocale}`;
    }
  });

  // Use provided alternateLinks but ensure current locale is included
  const finalAlternateLinks = Object.keys(alternateLinks).length > 0 
    ? {
        ...alternateLinks,
        // Ensure self-referencing hreflang
        [currentLocale]: alternateLinks[currentLocale] || (currentLocale === 'en' ? pathWithoutLocale : `/${currentLocale}${pathWithoutLocale}`)
      }
    : generatedAlternateLinks;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Google / Search Engine Tags */}
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={image} />

      {/* Facebook / Open Graph Meta Tags */}
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={currentLocale} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Alternate Language Links */}
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
          hrefLang={lang} 
        />
      ))}

      {/* Additional structured data for articles */}
      {type === 'article' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": title,
              "description": description,
              "image": image,
              "url": fullUrl,
              "publisher": {
                "@type": "Organization",
                "name": siteName,
                "logo": {
                  "@type": "ImageObject",
                  "url": `${baseUrl}/images/black-logo.png`
                }
              }
            })
          }}
        />
      )}
    </Head>
  );
}; 