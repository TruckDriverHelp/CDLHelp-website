import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateArticleSchema,
  generateBlogPostingSchema,
  generateCourseSchema,
  generateFAQSchema,
  generateQuizSchema,
  generateBreadcrumbSchema,
  generateContactPageSchema,
  generateHowToSchema,
  generateVideoSchema,
  generateItemListSchema,
  generateWebPageSchema,
  generateSchoolSchema,
} from '../StructuredData';
import { SchemaValidator } from '../validators/schemaValidator';
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
} from '../types/schema.types';

/**
 * SchemaBuilder - A fluent interface for building Schema.org structured data
 *
 * Usage:
 * const schema = new SchemaBuilder('en')
 *   .addOrganization()
 *   .addWebsite()
 *   .addBreadcrumb([...])
 *   .addArticle({...})
 *   .build();
 */
export class SchemaBuilder {
  private schemas: BaseStructuredData[] = [];
  private locale: string;
  private validator: SchemaValidator;
  private baseUrl: string = 'https://www.cdlhelp.com';

  constructor(locale: string = 'en') {
    this.locale = locale;
    this.validator = new SchemaValidator();
  }

  /**
   * Set the base URL for the website
   */
  setBaseUrl(url: string): SchemaBuilder {
    this.baseUrl = url;
    return this;
  }

  /**
   * Add Organization schema
   */
  addOrganization(config?: Partial<OrganizationConfig>): SchemaBuilder {
    const schema = generateOrganizationSchema(this.locale, config);
    this.schemas.push(schema);
    return this;
  }

  /**
   * Add Website schema
   */
  addWebsite(config?: Partial<WebsiteConfig>): SchemaBuilder {
    const schema = generateWebsiteSchema(this.locale, config?.description);
    this.schemas.push(schema);
    return this;
  }

  /**
   * Add Article schema
   */
  addArticle(config: ArticleConfig): SchemaBuilder {
    const schema = generateArticleSchema(this.locale, config);
    this.schemas.push(schema);
    return this;
  }

  /**
   * Add BlogPosting schema
   */
  addBlogPosting(config: BlogPostingConfig): SchemaBuilder {
    const schema = generateBlogPostingSchema(this.locale, config);
    this.schemas.push(schema);
    return this;
  }

  /**
   * Add Course schema
   */
  addCourse(config?: Partial<CourseConfig>): SchemaBuilder {
    const schema = generateCourseSchema(this.locale, config);
    this.schemas.push(schema);
    return this;
  }

  /**
   * Add FAQ schema
   */
  addFAQ(config: FAQConfig): SchemaBuilder {
    const schema = generateFAQSchema(config.questions);
    this.schemas.push(schema);
    return this;
  }

  /**
   * Add Quiz schema
   */
  addQuiz(config: QuizConfig): SchemaBuilder {
    const schema = generateQuizSchema(this.locale, config);
    this.schemas.push(schema);
    return this;
  }

  /**
   * Add Breadcrumb schema
   */
  addBreadcrumb(items: BreadcrumbItem[]): SchemaBuilder {
    const schema = generateBreadcrumbSchema(items);
    this.schemas.push(schema);
    return this;
  }

  /**
   * Add ContactPage schema
   */
  addContactPage(config?: ContactPageConfig): SchemaBuilder {
    const schema = generateContactPageSchema(this.locale, config);
    this.schemas.push(schema);
    return this;
  }

  /**
   * Add HowTo schema
   */
  addHowTo(config: HowToConfig): SchemaBuilder {
    const schema = generateHowToSchema(config);
    this.schemas.push(schema);
    return this;
  }

  /**
   * Add Video schema
   */
  addVideo(config: VideoConfig): SchemaBuilder {
    const schema = generateVideoSchema(config);
    this.schemas.push(schema);
    return this;
  }

  /**
   * Add ItemList schema
   */
  addItemList(config: ItemListConfig): SchemaBuilder {
    const schema = generateItemListSchema(this.locale, config);
    this.schemas.push(schema);
    return this;
  }

  /**
   * Add WebPage schema
   */
  addWebPage(config: WebPageConfig): SchemaBuilder {
    const schema = generateWebPageSchema(this.locale, config);
    this.schemas.push(schema);
    return this;
  }

  /**
   * Add School/EducationalOrganization schema
   */
  addSchool(config: SchoolConfig): SchemaBuilder {
    const schema = generateSchoolSchema(config);
    this.schemas.push(schema);
    return this;
  }

  /**
   * Add a custom schema
   */
  addCustom(schema: BaseStructuredData): SchemaBuilder {
    this.schemas.push(schema);
    return this;
  }

  /**
   * Validate and build the final schema(s)
   */
  build(): BaseStructuredData | BaseStructuredData[] {
    const validated = this.validator.validate(this.schemas);

    // Return single schema if only one, otherwise return array
    if (Array.isArray(validated)) {
      return validated.length === 1 ? validated[0] : validated;
    }

    return validated;
  }

  /**
   * Get validation results without building
   */
  validate() {
    this.validator.validate(this.schemas);
    return this.validator.getValidationResult();
  }

  /**
   * Clear all schemas
   */
  clear(): SchemaBuilder {
    this.schemas = [];
    return this;
  }

  /**
   * Get the current schemas without validation
   */
  getSchemas(): BaseStructuredData[] {
    return this.schemas;
  }
}

// Export all generator functions for direct use
export {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateArticleSchema,
  generateBlogPostingSchema,
  generateCourseSchema,
  generateFAQSchema,
  generateQuizSchema,
  generateBreadcrumbSchema,
  generateContactPageSchema,
  generateHowToSchema,
  generateVideoSchema,
  generateItemListSchema,
  generateWebPageSchema,
  generateSchoolSchema,
} from '../StructuredData';

// Export types
export type {
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
} from '../types/schema.types';
