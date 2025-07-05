/**
 * Utility functions for localizing schema.org structured data
 */

type Locale = 'en' | 'ru' | 'uk' | 'ar' | 'ko' | 'zh' | 'tr' | 'pt';

interface LocalizedNames {
  [key: string]: string;
}

interface FAQ {
  name: string;
  acceptedAnswer: {
    '@type': string;
    text: string;
  };
}

interface Schema {
  '@context'?: string;
  '@type'?: string;
  '@id'?: string;
  [key: string]: any;
}

/**
 * Get localized organization name based on locale
 */
export const getLocalizedOrganizationName = (locale: string): string => {
  const names: LocalizedNames = {
    en: 'CDL Help',
    ru: 'CDL Help',
    uk: 'CDL Help',
    ar: 'CDL Help',
    ko: 'CDL Help',
    zh: 'CDL Help',
    tr: 'CDL Help',
    pt: 'CDL Help',
  };
  return names[locale] || names.en;
};

/**
 * Get localized alternate name
 */
export const getLocalizedAlternateName = (locale: string): string => {
  const names: LocalizedNames = {
    en: 'Truck Driver Help',
    ru: 'Помощь Дальнобойщикам',
    uk: 'Допомога Далекобійникам',
    ar: 'مساعدة سائقي الشاحنات',
    ko: '트럭 운전사 도움말',
    zh: '卡车司机帮助',
    tr: 'Kamyon Sürücüsü Yardımı',
    pt: 'Ajuda para Motoristas de Caminhão',
  };
  return names[locale] || names.en;
};

/**
 * Get localized description
 */
export const getLocalizedDescription = (locale: string, t?: any): string => {
  // Use translation function if available, otherwise use defaults
  if (t) {
    return t('description');
  }

  const descriptions: LocalizedNames = {
    en: 'Master your CDL exam with instant feedback and detailed explanations for every question.',
    ru: 'Освойте экзамен CDL с мгновенной обратной связью и подробными объяснениями для каждого вопроса.',
    uk: "Опануйте іспит CDL з миттєвим зворотним зв'язком та детальними поясненнями для кожного питання.",
    ar: 'أتقن امتحان CDL الخاص بك مع ردود فعل فورية وشروحات مفصلة لكل سؤال.',
    ko: '모든 질문에 대한 즉각적인 피드백과 자세한 설명으로 CDL 시험을 마스터하세요.',
    zh: '通过即时反馈和每个问题的详细解释来掌握您的CDL考试。',
    tr: 'Her soru için anında geri bildirim ve ayrıntılı açıklamalarla CDL sınavınızda ustalaşın.',
    pt: 'Domine seu exame CDL com feedback instantâneo e explicações detalhadas para cada pergunta.',
  };
  return descriptions[locale] || descriptions.en;
};

/**
 * Get localized FAQ questions and answers
 */
export const getLocalizedFAQs = (locale: string, t?: any): FAQ[] => {
  // Use translation if available
  if (t) {
    return [
      {
        name: t('faq.questions.whatIsCDL.question'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('faq.questions.whatIsCDL.answer'),
        },
      },
      {
        name: t('faq.questions.howManyQuestions.question'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('faq.questions.howManyQuestions.answer'),
        },
      },
      {
        name: t('faq.questions.howManyMistakes.question'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('faq.questions.howManyMistakes.answer'),
        },
      },
    ].filter(faq => faq.name && faq.acceptedAnswer.text); // Filter out any undefined translations
  }

  // Default English FAQs
  return [
    {
      name: 'What is a CDL?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "A Commercial Driver's License (CDL) is required to operate commercial motor vehicles in the United States.",
      },
    },
    {
      name: 'How many questions are on the CDL exam?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The general knowledge test typically has 50 questions. You need to answer at least 40 correctly to pass.',
      },
    },
  ];
};

/**
 * Get locale-specific URL
 */
export const getLocalizedUrl = (locale: string, path: string = ''): string => {
  const baseUrl = 'https://www.cdlhelp.com';
  const localePath = locale === 'en' ? '' : `/${locale}`;
  return `${baseUrl}${localePath}${path}`;
};

/**
 * Get social media links based on locale
 */
export const getLocalizedSocialLinks = (locale: string): string[] | null => {
  const baseLinks = [
    'https://www.facebook.com/cdlhelp',
    'https://twitter.com/cdlhelp',
    'https://www.youtube.com/cdlhelp',
  ];

  // Add locale-specific social links
  if (locale === 'ru' || locale === 'uk') {
    return [
      'https://www.facebook.com/TruckDriverHelp/',
      'https://www.youtube.com/@truckdriverdothelp',
      'https://www.instagram.com/cdlhelp/',
      'https://www.t.me/truckdrivergroup',
    ];
  }

  return null;
};

/**
 * Get available languages for schema
 */
export const getAvailableLanguages = (): string[] => [
  'English',
  'Spanish',
  'Russian',
  'Ukrainian',
  'Arabic',
  'Korean',
  'Chinese',
  'Turkish',
  'Portuguese',
];

/**
 * Localize any schema object (generic function)
 * Excludes 'teaches' property from localization
 */
export const localizeSchema = (schema: Schema, locale: string, t?: any): Schema => {
  const localizedSchema = { ...schema };

  // Skip localization for teaches property
  const skipProperties = ['teaches', '@context', '@type', '@id'];

  for (const [key, value] of Object.entries(localizedSchema)) {
    if (skipProperties.includes(key)) {
      continue;
    }

    if (typeof value === 'string') {
      // Localize specific known properties
      switch (key) {
        case 'name':
          if (schema['@type'] === 'Organization') {
            localizedSchema[key] = getLocalizedOrganizationName(locale);
          }
          break;
        case 'alternateName':
          if (schema['@type'] === 'Organization') {
            localizedSchema[key] = getLocalizedAlternateName(locale);
          }
          break;
        case 'description':
          localizedSchema[key] = getLocalizedDescription(locale, t);
          break;
        case 'url':
          if (value.includes('cdlhelp.com') && !value.includes('http')) {
            localizedSchema[key] = getLocalizedUrl(locale, value);
          }
          break;
      }
    } else if (Array.isArray(value)) {
      // Handle arrays (like sameAs)
      if (key === 'sameAs') {
        localizedSchema[key] = getLocalizedSocialLinks(locale);
      }
    } else if (typeof value === 'object' && value !== null) {
      // Recursively localize nested objects
      localizedSchema[key] = localizeSchema(value, locale, t);
    }
  }

  // Add inLanguage property if not present
  if (!localizedSchema.inLanguage && schema['@type']) {
    localizedSchema.inLanguage = locale;
  }

  return localizedSchema;
};
