// Schema.org TypeScript Type Definitions for CDL Help

export interface BaseStructuredData {
  '@context': string;
  '@type': string;
  '@id'?: string;
  [key: string]: any;
}

export interface ImageObject {
  '@type': 'ImageObject';
  url: string;
  width?: number;
  height?: number;
  caption?: string;
}

export interface Person {
  '@type': 'Person';
  name: string;
  url?: string;
  image?: string | ImageObject;
  jobTitle?: string;
  description?: string;
  sameAs?: string[];
}

export interface ContactPoint {
  '@type': 'ContactPoint';
  contactType: string;
  telephone?: string;
  email?: string;
  areaServed?: string | string[];
  availableLanguage?: string | string[];
}

export interface PostalAddress {
  '@type': 'PostalAddress';
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
}

export interface AggregateRating {
  '@type': 'AggregateRating';
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

export interface OrganizationConfig {
  name?: string;
  alternateName?: string;
  url?: string;
  logo?: string | ImageObject;
  description?: string;
  sameAs?: string[];
  contactPoint?: ContactPoint;
  address?: PostalAddress;
  foundingDate?: string;
  founders?: Person[];
  type?: 'Organization' | 'EducationalOrganization' | 'LocalBusiness';
}

export interface WebsiteConfig {
  name?: string;
  description?: string;
  url?: string;
  inLanguage?: string;
  searchActionUrl?: string;
  publisher?: OrganizationConfig;
}

export interface ArticleConfig {
  title: string;
  description: string;
  content?: string;
  author?: string | Person;
  datePublished?: string;
  dateModified?: string;
  image?: string | ImageObject;
  url: string;
  keywords?: string[];
  wordCount?: number;
  articleSection?: string;
  articleBody?: string;
  speakable?: {
    '@type': 'SpeakableSpecification';
    cssSelector?: string[];
    xpath?: string[];
  };
  video?: VideoConfig;
  publisher?: OrganizationConfig;
  mainEntityOfPage?: string;
  inLanguage?: string;
}

export interface BlogPostingConfig extends ArticleConfig {
  blogSection?: string;
  commentCount?: number;
  discussionUrl?: string;
}

export interface CourseConfig {
  name: string;
  description: string;
  url?: string;
  courseCode?: string;
  duration?: string;
  skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  aggregateRating?: AggregateRating;
  educationalCredentialAwarded?: string;
  provider?: OrganizationConfig;
  instructor?: Person | Person[];
  teaches?: string[] | DefinedTerm[];
  hasCourseInstance?: CourseInstance;
  coursePrerequisites?: string | Course;
  financialAidEligible?: boolean;
  totalHistoricalEnrollment?: number;
  educationalProgramMode?: string;
  learningOutcome?: string[];
  offers?: Offer;
  inLanguage?: string;
}

export interface DefinedTerm {
  '@type': 'DefinedTerm';
  name: string;
  termCode?: string;
  description?: string;
}

export interface CourseInstance {
  '@type': 'CourseInstance';
  courseMode: 'online' | 'onsite' | 'blended';
  duration?: string;
  courseWorkload?: string;
  instructor?: Person | Person[];
  startDate?: string;
  endDate?: string;
}

export interface Offer {
  '@type': 'Offer';
  price: string | number;
  priceCurrency: string;
  availability?: string;
  validFrom?: string;
  validThrough?: string;
  category?: string;
}

export interface Course {
  '@type': 'Course';
  name: string;
  description?: string;
  duration?: string;
}

export interface FAQConfig {
  questions: Array<{
    question: string;
    answer: string;
    dateCreated?: string;
    author?: string;
  }>;
  mainEntity?: boolean;
}

export interface QuizConfig {
  name: string;
  description: string;
  questionCount?: number;
  url?: string;
  timeRequired?: string;
  quizType?: string;
  passingScore?: number;
  questions?: QuizQuestion[];
  provider?: OrganizationConfig;
  educationalLevel?: string;
  inLanguage?: string;
}

export interface QuizQuestion {
  question: string;
  correctAnswer?: string;
  options?: string[];
  category?: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
  position?: number;
}

export interface ContactPageConfig {
  name?: string;
  description?: string;
  url?: string;
  mainEntity?: OrganizationConfig;
  inLanguage?: string;
}

export interface HowToConfig {
  name: string;
  description: string;
  image?: string | ImageObject;
  totalTime?: string;
  estimatedCost?: {
    '@type': 'MonetaryAmount';
    currency: string;
    value: string | number;
  };
  supply?: HowToSupply[];
  tool?: HowToTool[];
  step: HowToStep[];
  video?: VideoConfig;
}

export interface HowToSupply {
  '@type': 'HowToSupply';
  name: string;
  requiredQuantity?: number;
  estimatedCost?: {
    '@type': 'MonetaryAmount';
    currency: string;
    value: string | number;
  };
}

export interface HowToTool {
  '@type': 'HowToTool';
  name: string;
  requiredQuantity?: number;
}

export interface HowToStep {
  '@type': 'HowToStep';
  name: string;
  text: string;
  image?: string | ImageObject;
  url?: string;
  video?: VideoConfig;
}

export interface VideoConfig {
  '@type': 'VideoObject';
  name: string;
  description?: string;
  thumbnailUrl?: string | string[];
  uploadDate?: string;
  duration?: string;
  contentUrl?: string;
  embedUrl?: string;
  interactionStatistic?: {
    '@type': 'InteractionCounter';
    interactionType: string;
    userInteractionCount: number;
  };
}

export interface ItemListConfig {
  name: string;
  description?: string;
  url?: string;
  numberOfItems?: number;
  itemListElement?: any[];
  inLanguage?: string;
  publisher?: OrganizationConfig;
}

export interface WebPageConfig {
  name: string;
  description?: string;
  url?: string;
  breadcrumb?: BreadcrumbItem[];
  mainEntity?: any;
  primaryImageOfPage?: string | ImageObject;
  datePublished?: string;
  dateModified?: string;
  inLanguage?: string;
}

export interface SchoolConfig {
  name: string;
  address: PostalAddress;
  telephone?: string;
  url?: string;
  latitude?: number;
  longitude?: number;
  priceRange?: string;
  areaServed?: string | { '@type': string; name: string };
  aggregateRating?: AggregateRating;
}

export interface ReviewConfig {
  itemReviewed: {
    '@type': string;
    name: string;
  };
  reviewRating: {
    '@type': 'Rating';
    ratingValue: number;
    bestRating?: number;
    worstRating?: number;
  };
  author: Person | string;
  datePublished?: string;
  reviewBody?: string;
}

export interface EventConfig {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: {
    '@type': 'Place' | 'VirtualLocation';
    name?: string;
    address?: PostalAddress | string;
    url?: string;
  };
  organizer?: OrganizationConfig | Person;
  performer?: Person[];
  offers?: Offer;
  eventStatus?: string;
  eventAttendanceMode?: string;
}

export interface SoftwareApplicationConfig {
  name: string;
  description?: string;
  operatingSystem?: string;
  applicationCategory?: string;
  aggregateRating?: AggregateRating;
  offers?: Offer;
  downloadUrl?: string;
  fileSize?: string;
  softwareVersion?: string;
  softwareRequirements?: string;
  screenshot?: string | ImageObject | (string | ImageObject)[];
  author?: Person | OrganizationConfig;
  datePublished?: string;
  dateModified?: string;
  permissions?: string | string[];
  countriesSupported?: string | string[];
  contentRating?: string;
}

export interface MobileApplicationConfig extends SoftwareApplicationConfig {
  operatingSystem: 'iOS' | 'Android' | 'Windows Phone';
  applicationCategory: string;
  installUrl?: string;
}
