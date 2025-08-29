/**
 * Course Schema Component for CDL Help
 * Implements Schema.org Course structured data for rich snippets
 */

export default function CourseSchema({
  title,
  description,
  locale = 'en',
  url,
  duration = 'PT20H',
  skillLevel = 'Beginner',
  aggregateRating = { ratingValue: 4.8, reviewCount: 15000 },
  courseCode = 'CDL-001',
  educationalCredentialAwarded = 'CDL Permit Certificate',
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': url,
    name: title,
    description: description,
    url: url,
    courseCode: courseCode,
    inLanguage: locale === 'en' ? 'en-US' : `${locale}-${locale.toUpperCase()}`,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'CDL Help',
      url: 'https://www.cdlhelp.com',
      logo: {
        '@type': 'ImageObject',
        url: 'http://localhost:3001/images/logo.png',
        width: 600,
        height: 60,
      },
      sameAs: [
        'https://www.facebook.com/cdlhelp',
        'https://www.youtube.com/cdlhelp',
        'https://apps.apple.com/app/id6444388755',
        'https://play.google.com/store/apps/details?id=help.truckdriver.cdlhelp',
      ],
      contactPoint: {
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
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: '2024-01-01T00:00:00Z', // Fixed date to prevent hydration mismatch
      category: 'Free',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      duration: duration,
      courseWorkload: duration,
      instructor: {
        '@type': 'Person',
        name: 'CDL Help Instructors',
        description: 'Experienced CDL instructors and industry professionals',
      },
    },
    teaches: [
      {
        '@type': 'DefinedTerm',
        name: "Commercial Driver's License",
        termCode: 'CDL',
      },
      {
        '@type': 'DefinedTerm',
        name: 'CDL General Knowledge',
        termCode: 'CDL-GK',
      },
      {
        '@type': 'DefinedTerm',
        name: 'Air Brakes',
        termCode: 'CDL-AB',
      },
      {
        '@type': 'DefinedTerm',
        name: 'Hazmat',
        termCode: 'CDL-HM',
      },
    ],
    educationalLevel: skillLevel,
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    educationalCredentialAwarded: educationalCredentialAwarded,
    competencyRequired: 'Basic English proficiency, Valid driver license',
    educationalUse: 'Professional Development',
    learningResourceType: 'Practice tests and study materials',
    interactivityType: 'mixed',
    accessMode: ['textual', 'visual'],
    accessModeSufficient: {
      '@type': 'ItemList',
      itemListElement: ['textual', 'visual'],
    },
    accessibilityFeature: [
      'alternativeText',
      'largePrint',
      'highContrast',
      'readingOrder',
      'structuralNavigation',
    ],
    accessibilityHazard: ['noFlashingHazard', 'noMotionSimulationHazard', 'noSoundHazard'],
    accessibilitySummary: 'Content is accessible to users with visual and hearing impairments',
  };

  // Add aggregate rating if provided
  if (aggregateRating && aggregateRating.reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
      bestRating: '5',
      worstRating: '1',
    };
  }

  // Add course sections for better detail
  schema.hasPart = [
    {
      '@type': 'Course',
      name: 'General Knowledge',
      description: 'Core CDL concepts and regulations',
      duration: 'PT5H',
    },
    {
      '@type': 'Course',
      name: 'Air Brakes',
      description: 'Air brake system operation and safety',
      duration: 'PT3H',
    },
    {
      '@type': 'Course',
      name: 'Combination Vehicles',
      description: 'Tractor-trailer combination operations',
      duration: 'PT4H',
    },
    {
      '@type': 'Course',
      name: 'Hazmat',
      description: 'Hazardous materials handling and regulations',
      duration: 'PT4H',
    },
    {
      '@type': 'Course',
      name: 'Practice Tests',
      description: 'Comprehensive practice exams',
      duration: 'PT4H',
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
