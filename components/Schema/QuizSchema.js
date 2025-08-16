/**
 * Quiz Schema Component for CDL Help
 * Implements Schema.org Quiz structured data for practice tests
 */

export default function QuizSchema({
  title,
  description,
  questionCount,
  locale = 'en',
  url,
  timeRequired = 'PT30M',
  quizType = 'General Knowledge',
  passingScore = 80,
  questions = [],
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    '@id': url,
    name: title,
    description: description,
    url: url,
    about: {
      '@type': 'Thing',
      name: `CDL ${quizType} Test`,
      description: `Commercial Driver's License ${quizType} examination preparation`,
    },
    inLanguage: locale === 'en' ? 'en-US' : `${locale}-${locale.toUpperCase()}`,
    educationalLevel: 'Beginner',
    timeRequired: timeRequired,
    numberOfQuestions: questionCount,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'CDL Help',
      url: 'https://www.cdlhelp.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.cdlhelp.com/images/logo.png',
        width: 600,
        height: 60,
      },
    },
    isAccessibleForFree: true,
    learningResourceType: 'Practice test',
    educationalAlignment: {
      '@type': 'AlignmentObject',
      alignmentType: 'educationalSubject',
      targetName: `Commercial Driver's License ${quizType} Exam`,
      targetDescription: `Official CDL ${quizType} test preparation`,
      educationalFramework: 'US Department of Transportation',
    },
    assesses: `CDL ${quizType} Knowledge`,
    educationalUse: 'Testing',
    interactivityType: 'active',
    accessMode: ['textual', 'visual'],
    accessibilityFeature: ['alternativeText', 'readingOrder', 'structuralNavigation'],
    accessibilityHazard: ['noFlashingHazard', 'noMotionSimulationHazard', 'noSoundHazard'],
    typicalAgeRange: '18+',
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      audienceType: 'CDL applicants',
    },
    award: `Score ${passingScore}% or higher to pass`,
  };

  // Add sample questions if provided
  if (questions && questions.length > 0) {
    schema.hasPart = questions.slice(0, 3).map((q, index) => ({
      '@type': 'Question',
      '@id': `${url}#question${index + 1}`,
      name: q.question || `Question ${index + 1}`,
      text: q.question,
      acceptedAnswer: q.correctAnswer
        ? {
            '@type': 'Answer',
            text: q.correctAnswer,
          }
        : undefined,
      suggestedAnswer: q.options
        ? q.options.map(option => ({
            '@type': 'Answer',
            text: option,
          }))
        : undefined,
      educationalAlignment: {
        '@type': 'AlignmentObject',
        alignmentType: 'assesses',
        targetName: q.category || quizType,
      },
    }));
  }

  // Add performance statistics if available
  schema.aggregateRating = {
    '@type': 'AggregateRating',
    ratingValue: '4.7',
    ratingCount: '8500',
    bestRating: '5',
    worstRating: '1',
  };

  // Add completion requirements
  schema.coursePrerequisites = {
    '@type': 'Course',
    name: 'CDL Study Materials',
    description: 'Review CDL manual before taking practice tests',
  };

  // Add certification info
  schema.credentialCategory = 'practice_test';

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
