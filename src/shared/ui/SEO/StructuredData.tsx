import React from 'react';
import Head from 'next/head';
import {
  getLocalizedOrganizationName,
  getLocalizedAlternateName,
  getLocalizedUrl,
  getLocalizedSocialLinks,
  getAvailableLanguages,
} from '../../../../lib/schemaLocalization';

interface BaseStructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

interface StructuredDataProps {
  data: BaseStructuredData | BaseStructuredData[];
}

export const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data),
        }}
      />
    </Head>
  );
};

// Organization schema with localization
export const generateOrganizationSchema = (locale = 'en'): BaseStructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: getLocalizedOrganizationName(locale),
    alternateName: getLocalizedAlternateName(locale),
    url: getLocalizedUrl(locale),
    logo: 'https://www.cdlhelp.com/images/black-logo.png',
    sameAs: getLocalizedSocialLinks(locale),
  };
};

// Legacy export for backward compatibility
export const organizationSchema: BaseStructuredData = generateOrganizationSchema();

// WebSite schema with search action (localized)
export const generateWebsiteSchema = (locale = 'en', description?: string): BaseStructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: getLocalizedUrl(locale),
    name: getLocalizedOrganizationName(locale),
    description:
      description ||
      'CDL practice tests, trucking resources, and career guidance for truck drivers',
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${getLocalizedUrl(locale)}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: getLocalizedOrganizationName(locale),
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.cdlhelp.com/images/black-logo.png',
      },
    },
  };
};

// Legacy export for backward compatibility
export const websiteSchema: BaseStructuredData = generateWebsiteSchema();

// Education/Course schema for CDL tests (localized, excluding 'teaches')
export const generateCourseSchema = (
  locale = 'en',
  name?: string,
  description?: string
): BaseStructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: name || 'CDL Practice Test',
    description:
      description ||
      "Free CDL practice tests to help you pass your Commercial Driver's License exam",
    provider: {
      '@type': 'Organization',
      name: getLocalizedOrganizationName(locale),
      url: getLocalizedUrl(locale),
    },
    educationalLevel: 'Professional Certification',
    // 'teaches' property kept in English as requested
    teaches: [
      'CDL General Knowledge',
      'Air Brakes',
      'Combination Vehicles',
      'Hazmat',
      'Doubles/Triples',
      'Tanker',
      'Passenger',
    ],
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      inLanguage: locale,
    },
    inLanguage: locale,
    url: getLocalizedUrl(locale),
  };
};

// Legacy export for backward compatibility
export const courseSchema: BaseStructuredData = generateCourseSchema();

// FAQ schema generator
export const generateFAQSchema = (
  faqs: Array<{ question: string; answer: string }>
): BaseStructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};

// Article schema generator with localization
export const generateArticleSchema = (article: {
  title: string;
  description: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  url: string;
  locale?: string;
}): BaseStructuredData => {
  const locale = article.locale || 'en';

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      name: article.author || 'CDL Help Editorial Team',
    },
    datePublished: article.datePublished || new Date().toISOString(),
    dateModified: article.dateModified || new Date().toISOString(),
    image: article.image || 'https://www.cdlhelp.com/images/truckdriverhelp-og.jpg',
    url: article.url,
    inLanguage: locale,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
    publisher: {
      '@type': 'Organization',
      name: getLocalizedOrganizationName(locale),
      url: getLocalizedUrl(locale),
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.cdlhelp.com/images/black-logo.png',
      },
    },
  };
};

// Local Business schema for CDL schools
export const generateSchoolSchema = (school: {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  telephone?: string;
  url?: string;
  latitude?: number;
  longitude?: number;
  priceRange?: string;
}): BaseStructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: school.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: school.address.street,
      addressLocality: school.address.city,
      addressRegion: school.address.state,
      postalCode: school.address.postalCode,
      addressCountry: 'US',
    },
    ...(school.telephone && { telephone: school.telephone }),
    ...(school.url && { url: school.url }),
    ...(school.latitude &&
      school.longitude && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: school.latitude,
          longitude: school.longitude,
        },
      }),
    ...(school.priceRange && { priceRange: school.priceRange }),
    areaServed: {
      '@type': 'State',
      name: school.address.state,
    },
  };
};

// Breadcrumb schema generator
export const generateBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
): BaseStructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};
