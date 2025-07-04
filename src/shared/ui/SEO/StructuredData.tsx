import React from 'react';
import Head from 'next/head';

interface BaseStructuredData {
  "@context": string;
  "@type": string;
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
          __html: JSON.stringify(data)
        }}
      />
    </Head>
  );
};

// Organization schema
export const organizationSchema: BaseStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "CDL Help",
  "alternateName": "Truck Driver Help",
  "url": "https://www.cdlhelp.com",
  "logo": "https://www.cdlhelp.com/images/black-logo.png",
  "sameAs": [
    "https://www.facebook.com/cdlhelp",
    "https://twitter.com/cdlhelp",
    "https://www.youtube.com/cdlhelp"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-800-CDL-HELP",
    "contactType": "customer service",
    "areaServed": "US",
    "availableLanguage": ["English", "Spanish", "Russian", "Ukrainian", "Arabic", "Korean", "Chinese", "Turkish", "Portuguese"]
  }
};

// WebSite schema with search action
export const websiteSchema: BaseStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://www.cdlhelp.com",
  "name": "CDL Help",
  "description": "CDL practice tests, trucking resources, and career guidance for truck drivers",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.cdlhelp.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

// Education/Course schema for CDL tests
export const courseSchema: BaseStructuredData = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "CDL Practice Test",
  "description": "Free CDL practice tests to help you pass your Commercial Driver's License exam",
  "provider": {
    "@type": "Organization",
    "name": "CDL Help",
    "url": "https://www.cdlhelp.com"
  },
  "educationalLevel": "Professional Certification",
  "teaches": ["CDL General Knowledge", "Air Brakes", "Combination Vehicles", "Hazmat", "Doubles/Triples", "Tanker", "Passenger"],
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "Online",
    "inLanguage": ["en", "es", "ru", "uk", "ar", "ko", "zh", "tr", "pt"]
  }
};

// FAQ schema generator
export const generateFAQSchema = (faqs: Array<{question: string, answer: string}>): BaseStructuredData => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

// Article schema generator
export const generateArticleSchema = (article: {
  title: string;
  description: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  url: string;
}): BaseStructuredData => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "author": {
      "@type": "Person",
      "name": article.author || "CDL Help Editorial Team"
    },
    "datePublished": article.datePublished || new Date().toISOString(),
    "dateModified": article.dateModified || new Date().toISOString(),
    "image": article.image || "https://www.cdlhelp.com/images/truckdriverhelp-og.jpg",
    "url": article.url,
    "publisher": {
      "@type": "Organization",
      "name": "CDL Help",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.cdlhelp.com/images/black-logo.png"
      }
    }
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
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": school.name,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": school.address.street,
      "addressLocality": school.address.city,
      "addressRegion": school.address.state,
      "postalCode": school.address.postalCode,
      "addressCountry": "US"
    },
    ...(school.telephone && { "telephone": school.telephone }),
    ...(school.url && { "url": school.url }),
    ...(school.latitude && school.longitude && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": school.latitude,
        "longitude": school.longitude
      }
    }),
    ...(school.priceRange && { "priceRange": school.priceRange }),
    "areaServed": {
      "@type": "State",
      "name": school.address.state
    }
  };
};

// Breadcrumb schema generator
export const generateBreadcrumbSchema = (items: Array<{name: string, url: string}>): BaseStructuredData => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};