/**
 * FAQ Schema Component for CDL Help
 * Implements Schema.org FAQPage structured data for FAQ sections
 */

export default function FAQSchema({ questions = [], locale = 'en', url }) {
  if (!questions || questions.length === 0) {
    return null;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': url || 'https://www.cdlhelp.com/faq',
    url: url || 'https://www.cdlhelp.com/faq',
    name: 'CDL Help Frequently Asked Questions',
    description: 'Common questions about CDL tests, preparation, and the CDL Help app',
    inLanguage: locale === 'en' ? 'en-US' : `${locale}-${locale.toUpperCase()}`,
    mainEntity: questions.map((item, index) => ({
      '@type': 'Question',
      '@id': `${url || 'https://www.cdlhelp.com/faq'}#question${index + 1}`,
      name: item.question,
      position: index + 1,
      answerCount: 1,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
        dateCreated: item.dateCreated || '2024-01-01T00:00:00Z',
        author: {
          '@type': 'Organization',
          name: 'CDL Help Support Team',
        },
      },
      dateCreated: item.dateCreated || '2024-01-01T00:00:00Z',
      author: {
        '@type': 'Person',
        name: item.authorName || 'CDL Help User',
      },
    })),
    author: {
      '@type': 'Organization',
      name: 'CDL Help',
      url: 'https://www.cdlhelp.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CDL Help',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.cdlhelp.com/images/logo.png',
        width: 600,
        height: 60,
      },
    },
    datePublished: '2024-01-01T00:00:00Z',
    dateModified: '2024-01-01T00:00:00Z',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Helper function to format FAQ data
export function formatFAQData(faqs) {
  return faqs.map(faq => ({
    question: faq.question || faq.q,
    answer: faq.answer || faq.a,
    dateCreated: faq.date || '2024-01-01T00:00:00Z',
    authorName: faq.author || 'CDL Help User',
  }));
}

// Common CDL FAQs for default usage
export const defaultCDLFAQs = [
  {
    question: 'How long does it take to get a CDL?',
    answer:
      'The time to get a CDL varies by state and individual preparation. On average, it takes 3-8 weeks including training, studying, and passing all required tests. Using CDL Help app can significantly reduce study time with focused practice tests.',
  },
  {
    question: 'What is the passing score for CDL tests?',
    answer:
      'Most states require a score of 80% or higher to pass CDL knowledge tests. The CDL Help app provides unlimited practice tests to help you consistently score above 80% before taking the real exam.',
  },
  {
    question: 'Is CDL Help app free?',
    answer:
      'Yes, CDL Help offers free access to basic CDL practice tests and study materials. Premium features with additional practice tests and detailed explanations are available for advanced preparation.',
  },
  {
    question: 'What CDL endorsements does the app cover?',
    answer:
      'CDL Help covers all major endorsements including: Hazmat (H), Tanker (N), Double/Triple Trailers (T), Passenger (P), School Bus (S), and Air Brakes. Each endorsement has dedicated practice tests.',
  },
  {
    question: 'Can I use CDL Help app offline?',
    answer:
      'Yes, the CDL Help mobile app allows you to download practice tests for offline use. This feature is perfect for studying without internet connection during breaks or while on the road.',
  },
  {
    question: 'How often are the practice questions updated?',
    answer:
      'CDL Help practice questions are updated regularly to reflect the latest DOT regulations and state-specific requirements. We monitor changes in CDL testing requirements across all states.',
  },
  {
    question: 'Does CDL Help work for all states?',
    answer:
      "Yes, CDL Help provides state-specific practice tests for all 50 US states. The app adapts questions based on your state's specific CDL requirements and regulations.",
  },
  {
    question: 'What languages does CDL Help support?',
    answer:
      'CDL Help is available in 8 languages: English, Spanish, Russian, Arabic, Korean, Chinese, Turkish, and Portuguese, making CDL preparation accessible to diverse communities.',
  },
];
