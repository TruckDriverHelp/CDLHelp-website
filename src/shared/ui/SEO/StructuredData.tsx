import React from 'react';
import Head from 'next/head';
import {
  getLocalizedOrganizationName,
  getLocalizedAlternateName,
  getLocalizedUrl,
  getLocalizedSocialLinks,
  getAvailableLanguages,
} from '../../../../lib/schemaLocalization';
import type {
  BaseStructuredData,
  OrganizationConfig,
  WebsiteConfig,
  ArticleConfig,
  BlogPostingConfig,
  CourseConfig,
  FAQConfig,
  QuizConfig,
  BreadcrumbItem,
  ContactPageConfig,
  HowToConfig,
  VideoConfig,
  ItemListConfig,
  WebPageConfig,
  SchoolConfig,
  SoftwareApplicationConfig,
  MobileApplicationConfig,
  ImageObject,
  Person,
} from './types/schema.types';

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

// Organization schema with localization and enhanced properties
export const generateOrganizationSchema = (
  locale = 'en',
  config?: Partial<OrganizationConfig>
): BaseStructuredData => {
  const baseSchema: any = {
    '@context': 'https://schema.org',
    '@type': config?.type || 'Organization',
    '@id': `${getLocalizedUrl(locale)}#organization`,
    name: config?.name || getLocalizedOrganizationName(locale),
    alternateName: config?.alternateName || getLocalizedAlternateName(locale),
    url: config?.url || getLocalizedUrl(locale),
    logo: config?.logo || {
      '@type': 'ImageObject',
      url: 'http://localhost:3001/images/black-logo.png',
      width: 600,
      height: 60,
    },
    sameAs: config?.sameAs || getLocalizedSocialLinks(locale),
    description: config?.description || 'CDL Help - Free CDL practice tests and trucking resources',
    foundingDate: config?.foundingDate || '2019-01-01',
    contactPoint: config?.contactPoint || {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@cdlhelp.com',
      availableLanguage: [
        'English',
        'Russian',
        'Spanish',
        'Arabic',
        'Korean',
        'Chinese',
        'Turkish',
        'Portuguese',
      ],
    },
  };

  if (config?.address) {
    baseSchema.address = config.address;
  }

  if (config?.founders) {
    baseSchema.founders = config.founders;
  }

  return baseSchema;
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
        url: 'http://localhost:3001/images/black-logo.png',
      },
    },
  };
};

// Legacy export for backward compatibility
export const websiteSchema: BaseStructuredData = generateWebsiteSchema();

// Enhanced Course schema with all required properties
export const generateCourseSchema = (
  locale = 'en',
  config?: Partial<CourseConfig>
): BaseStructuredData => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${config?.url || getLocalizedUrl(locale)}#course`,
    name: config?.name || 'CDL Practice Test',
    description:
      config?.description ||
      "Free CDL practice tests to help you pass your Commercial Driver's License exam",
    provider: config?.provider
      ? generateOrganizationSchema(locale, { ...config.provider, type: 'EducationalOrganization' })
      : {
          '@type': 'EducationalOrganization',
          name: getLocalizedOrganizationName(locale),
          url: getLocalizedUrl(locale),
        },
    educationalLevel: config?.skillLevel || 'Professional Certification',
    teaches: config?.teaches || [
      'CDL General Knowledge',
      'Air Brakes',
      'Combination Vehicles',
      'Hazmat',
      'Doubles/Triples',
      'Tanker',
      'Passenger',
    ],
    hasCourseInstance: config?.hasCourseInstance || {
      '@type': 'CourseInstance',
      courseMode: 'online',
      duration: 'PT20H',
      inLanguage: locale,
    },
    inLanguage: config?.inLanguage || locale,
    url: config?.url || getLocalizedUrl(locale),
    isAccessibleForFree: true,
    courseCode: config?.courseCode || 'CDL-001',
  };

  // Add enhanced properties
  if (config?.aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: config.aggregateRating.ratingValue,
      reviewCount: config.aggregateRating.reviewCount,
      bestRating: config.aggregateRating.bestRating || 5,
      worstRating: config.aggregateRating.worstRating || 1,
    };
  }

  if (config?.educationalCredentialAwarded) {
    schema.educationalCredentialAwarded = config.educationalCredentialAwarded;
  }

  if (config?.coursePrerequisites) {
    schema.coursePrerequisites = config.coursePrerequisites;
  }

  if (config?.financialAidEligible !== undefined) {
    schema.financialAidEligible = config.financialAidEligible;
  }

  if (config?.totalHistoricalEnrollment) {
    schema.totalHistoricalEnrollment = config.totalHistoricalEnrollment;
  }

  if (config?.educationalProgramMode) {
    schema.educationalProgramMode = config.educationalProgramMode;
  }

  if (config?.learningOutcome) {
    schema.learningResourceType = 'Practice tests and study materials';
    schema.educationalUse = 'Professional Development';
    schema.competencyRequired = 'Basic English proficiency, Valid driver license';
    schema.teaches = config.learningOutcome;
  }

  if (config?.offers) {
    schema.offers = config.offers;
  } else {
    schema.offers = {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      category: 'Free',
    };
  }

  return schema;
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

// Enhanced Article schema generator with all required properties
export const generateArticleSchema = (locale = 'en', config: ArticleConfig): BaseStructuredData => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${config.url}#article`,
    headline: config.title,
    description: config.description,
    author:
      typeof config.author === 'string'
        ? { '@type': 'Person', name: config.author }
        : config.author || { '@type': 'Person', name: 'CDL Help Editorial Team' },
    datePublished: config.datePublished || new Date().toISOString(),
    dateModified: config.dateModified || config.datePublished || new Date().toISOString(),
    image: config.image || 'http://localhost:3001/images/truckdriverhelp-og.jpg',
    url: config.url,
    inLanguage: config.inLanguage || locale,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': config.mainEntityOfPage || config.url,
    },
    publisher: generateOrganizationSchema(locale, config.publisher),
  };

  // Add enhanced properties for better SEO
  if (config.keywords && config.keywords.length > 0) {
    schema.keywords = config.keywords.join(', ');
  }

  if (config.wordCount) {
    schema.wordCount = config.wordCount;
  }

  if (config.articleSection) {
    schema.articleSection = config.articleSection;
  }

  if (config.articleBody) {
    schema.articleBody = config.articleBody;
  }

  if (config.speakable) {
    schema.speakable = config.speakable;
  }

  if (config.video) {
    schema.video = generateVideoSchema(config.video);
  }

  return schema;
};

// BlogPosting schema generator (extends Article)
export const generateBlogPostingSchema = (
  locale = 'en',
  config: BlogPostingConfig
): BaseStructuredData => {
  const articleSchema = generateArticleSchema(locale, config);
  articleSchema['@type'] = 'BlogPosting';

  if (config.blogSection) {
    articleSchema.articleSection = config.blogSection;
  }

  if (config.commentCount !== undefined) {
    articleSchema.commentCount = config.commentCount;
  }

  if (config.discussionUrl) {
    articleSchema.discussionUrl = config.discussionUrl;
  }

  return articleSchema;
};

// Local Business/School schema for CDL schools
export const generateSchoolSchema = (school: SchoolConfig): BaseStructuredData => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': school.url
      ? `${school.url}#school`
      : `#school-${school.name.replace(/\s+/g, '-').toLowerCase()}`,
    name: school.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: school.address.streetAddress,
      addressLocality: school.address.addressLocality,
      addressRegion: school.address.addressRegion,
      postalCode: school.address.postalCode,
      addressCountry: school.address.addressCountry || 'US',
    },
  };

  if (school.telephone) schema.telephone = school.telephone;
  if (school.url) schema.url = school.url;

  if (school.latitude && school.longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: school.latitude,
      longitude: school.longitude,
    };
  }

  if (school.priceRange) schema.priceRange = school.priceRange;

  if (school.areaServed) {
    schema.areaServed = school.areaServed;
  }

  if (school.aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: school.aggregateRating.ratingValue,
      reviewCount: school.aggregateRating.reviewCount,
      bestRating: school.aggregateRating.bestRating || 5,
      worstRating: school.aggregateRating.worstRating || 1,
    };
  }

  return schema;
};

// SoftwareApplication schema generator
export const generateSoftwareApplicationSchema = (
  config: SoftwareApplicationConfig
): BaseStructuredData => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${config.downloadUrl || '#software'}#app`,
    name: config.name,
    description: config.description,
  };

  if (config.operatingSystem) schema.operatingSystem = config.operatingSystem;
  if (config.applicationCategory) schema.applicationCategory = config.applicationCategory;
  if (config.aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: config.aggregateRating.ratingValue,
      reviewCount: config.aggregateRating.reviewCount,
      bestRating: config.aggregateRating.bestRating || 5,
      worstRating: config.aggregateRating.worstRating || 1,
    };
  }
  if (config.offers) schema.offers = config.offers;
  if (config.downloadUrl) schema.downloadUrl = config.downloadUrl;
  if (config.fileSize) schema.fileSize = config.fileSize;
  if (config.softwareVersion) schema.softwareVersion = config.softwareVersion;
  if (config.softwareRequirements) schema.softwareRequirements = config.softwareRequirements;
  if (config.screenshot) schema.screenshot = config.screenshot;
  if (config.author) schema.author = config.author;
  if (config.datePublished) schema.datePublished = config.datePublished;
  if (config.dateModified) schema.dateModified = config.dateModified;
  if (config.permissions) schema.permissions = config.permissions;
  if (config.countriesSupported) schema.countriesSupported = config.countriesSupported;
  if (config.contentRating) schema.contentRating = config.contentRating;

  return schema;
};

// MobileApplication schema generator
export const generateMobileApplicationSchema = (
  config: MobileApplicationConfig
): BaseStructuredData => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    '@id': `${config.downloadUrl || '#mobile'}#app`,
    name: config.name,
    description: config.description,
    operatingSystem: config.operatingSystem,
    applicationCategory: config.applicationCategory,
  };

  if (config.aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: config.aggregateRating.ratingValue,
      reviewCount: config.aggregateRating.reviewCount,
      bestRating: config.aggregateRating.bestRating || 5,
      worstRating: config.aggregateRating.worstRating || 1,
    };
  }
  if (config.offers) schema.offers = config.offers;
  if (config.downloadUrl) schema.downloadUrl = config.downloadUrl;
  if (config.installUrl) schema.installUrl = config.installUrl;
  if (config.fileSize) schema.fileSize = config.fileSize;
  if (config.softwareVersion) schema.softwareVersion = config.softwareVersion;
  if (config.softwareRequirements) schema.softwareRequirements = config.softwareRequirements;
  if (config.screenshot) schema.screenshot = config.screenshot;
  if (config.author) schema.author = config.author;
  if (config.datePublished) schema.datePublished = config.datePublished;
  if (config.dateModified) schema.dateModified = config.dateModified;
  if (config.permissions) schema.permissions = config.permissions;
  if (config.countriesSupported) schema.countriesSupported = config.countriesSupported;
  if (config.contentRating) schema.contentRating = config.contentRating;

  return schema;
};

// Breadcrumb schema generator
export const generateBreadcrumbSchema = (items: BreadcrumbItem[]): BaseStructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${items[0]?.url || '/'}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: item.position || index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `https://www.cdlhelp.com${item.url}`,
    })),
  };
};

// Quiz schema generator
export const generateQuizSchema = (locale = 'en', config: QuizConfig): BaseStructuredData => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    '@id': `${config.url}#quiz`,
    name: config.name,
    description: config.description,
    url: config.url,
    about: {
      '@type': 'Thing',
      name: `CDL ${config.quizType || 'General Knowledge'} Test`,
      description: `Commercial Driver's License ${config.quizType || 'General Knowledge'} examination preparation`,
    },
    inLanguage: config.inLanguage || locale,
    educationalLevel: config.educationalLevel || 'Beginner',
    timeRequired: config.timeRequired || 'PT30M',
    numberOfQuestions: config.questionCount,
    provider: config.provider
      ? generateOrganizationSchema(locale, { ...config.provider, type: 'EducationalOrganization' })
      : {
          '@type': 'EducationalOrganization',
          name: getLocalizedOrganizationName(locale),
          url: getLocalizedUrl(locale),
        },
    isAccessibleForFree: true,
    learningResourceType: 'Practice test',
    educationalUse: 'Testing',
    interactivityType: 'active',
  };

  if (config.questions && config.questions.length > 0) {
    schema.hasPart = config.questions.slice(0, 3).map((q, index) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: q.correctAnswer ? { '@type': 'Answer', text: q.correctAnswer } : undefined,
      suggestedAnswer: q.options
        ? q.options.map(option => ({ '@type': 'Answer', text: option }))
        : undefined,
    }));
  }

  if (config.passingScore) {
    schema.award = `Score ${config.passingScore}% or higher to pass`;
  }

  return schema;
};

// ContactPage schema generator
export const generateContactPageSchema = (
  locale = 'en',
  config?: ContactPageConfig
): BaseStructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${config?.url || getLocalizedUrl(locale, '/contact')}#contactpage`,
    name: config?.name || 'Contact CDL Help',
    description:
      config?.description ||
      'Get in touch with CDL Help. We are here to help you with your CDL test preparation.',
    url: config?.url || getLocalizedUrl(locale, '/contact'),
    inLanguage: config?.inLanguage || locale,
    mainEntity: config?.mainEntity
      ? generateOrganizationSchema(locale, config.mainEntity)
      : {
          '@type': 'Organization',
          name: getLocalizedOrganizationName(locale),
          url: getLocalizedUrl(locale),
          email: 'support@cdlhelp.com',
        },
  };
};

// HowTo schema generator
export const generateHowToSchema = (config: HowToConfig): BaseStructuredData => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: config.name,
    description: config.description,
    step: config.step.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
      ...(step.url && { url: step.url }),
      ...(step.video && { video: generateVideoSchema(step.video) }),
    })),
  };

  if (config.image) schema.image = config.image;
  if (config.totalTime) schema.totalTime = config.totalTime;
  if (config.estimatedCost) schema.estimatedCost = config.estimatedCost;
  if (config.supply) schema.supply = config.supply;
  if (config.tool) schema.tool = config.tool;
  if (config.video) schema.video = generateVideoSchema(config.video);

  return schema;
};

// Video schema generator
export const generateVideoSchema = (config: VideoConfig): BaseStructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: config.name,
    description: config.description,
    thumbnailUrl: config.thumbnailUrl,
    uploadDate: config.uploadDate,
    duration: config.duration,
    contentUrl: config.contentUrl,
    embedUrl: config.embedUrl,
    ...(config.interactionStatistic && { interactionStatistic: config.interactionStatistic }),
  };
};

// ItemList schema generator
export const generateItemListSchema = (
  locale = 'en',
  config: ItemListConfig
): BaseStructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${config.url}#itemlist`,
    name: config.name,
    description: config.description,
    url: config.url,
    numberOfItems: config.numberOfItems,
    itemListElement: config.itemListElement,
    inLanguage: config.inLanguage || locale,
    ...(config.publisher && {
      publisher: generateOrganizationSchema(locale, config.publisher),
    }),
  };
};

// WebPage schema generator
export const generateWebPageSchema = (locale = 'en', config: WebPageConfig): BaseStructuredData => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${config.url}#webpage`,
    name: config.name,
    description: config.description,
    url: config.url,
    inLanguage: config.inLanguage || locale,
  };

  if (config.breadcrumb) {
    schema.breadcrumb = generateBreadcrumbSchema(config.breadcrumb);
  }

  if (config.mainEntity) {
    schema.mainEntity = config.mainEntity;
  }

  if (config.primaryImageOfPage) {
    schema.primaryImageOfPage = config.primaryImageOfPage;
  }

  if (config.datePublished) {
    schema.datePublished = config.datePublished;
  }

  if (config.dateModified) {
    schema.dateModified = config.dateModified;
  }

  return schema;
};
