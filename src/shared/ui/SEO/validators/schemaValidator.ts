import { BaseStructuredData } from '../types/schema.types';

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export class SchemaValidator {
  private errors: ValidationError[] = [];
  private warnings: ValidationError[] = [];

  /**
   * Validates an array of schemas
   */
  validate(
    schemas: BaseStructuredData | BaseStructuredData[]
  ): BaseStructuredData | BaseStructuredData[] {
    this.errors = [];
    this.warnings = [];

    const schemasArray = Array.isArray(schemas) ? schemas : [schemas];

    schemasArray.forEach(schema => {
      this.validateSchema(schema);
    });

    if (this.errors.length > 0) {
      console.error('Schema validation errors:', this.errors);
    }

    if (this.warnings.length > 0 && process.env.NODE_ENV === 'development') {
      console.warn('Schema validation warnings:', this.warnings);
    }

    return schemas;
  }

  /**
   * Get validation results
   */
  getValidationResult(): ValidationResult {
    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
    };
  }

  /**
   * Validates a single schema
   */
  private validateSchema(schema: BaseStructuredData): void {
    // Check required base properties
    if (!schema['@context']) {
      this.addError('@context', 'Missing required @context property');
    }

    if (!schema['@type']) {
      this.addError('@type', 'Missing required @type property');
    }

    // Validate based on schema type
    switch (schema['@type']) {
      case 'Organization':
      case 'EducationalOrganization':
        this.validateOrganization(schema);
        break;
      case 'Article':
        this.validateArticle(schema);
        break;
      case 'BlogPosting':
        this.validateBlogPosting(schema);
        break;
      case 'Course':
        this.validateCourse(schema);
        break;
      case 'FAQPage':
        this.validateFAQPage(schema);
        break;
      case 'Quiz':
        this.validateQuiz(schema);
        break;
      case 'BreadcrumbList':
        this.validateBreadcrumbList(schema);
        break;
      case 'WebSite':
        this.validateWebSite(schema);
        break;
      case 'WebPage':
        this.validateWebPage(schema);
        break;
      case 'ContactPage':
        this.validateContactPage(schema);
        break;
      case 'HowTo':
        this.validateHowTo(schema);
        break;
      case 'VideoObject':
        this.validateVideo(schema);
        break;
      case 'ItemList':
        this.validateItemList(schema);
        break;
    }

    // Check for duplicate @id values
    if (schema['@id']) {
      this.checkDuplicateId(schema['@id']);
    }
  }

  private validateOrganization(schema: BaseStructuredData): void {
    if (!schema.name) {
      this.addError('name', 'Organization must have a name');
    }

    if (!schema.url) {
      this.addError('url', 'Organization must have a URL');
    }

    if (!schema.logo) {
      this.addWarning('logo', 'Organization should have a logo for rich snippets');
    }

    if (!schema.contactPoint) {
      this.addWarning('contactPoint', 'Organization should have contact information');
    }

    if (!schema.sameAs || !Array.isArray(schema.sameAs) || schema.sameAs.length === 0) {
      this.addWarning('sameAs', 'Organization should have social media links');
    }
  }

  private validateArticle(schema: BaseStructuredData): void {
    const requiredFields = [
      'headline',
      'description',
      'author',
      'datePublished',
      'publisher',
      'image',
    ];

    requiredFields.forEach(field => {
      if (!schema[field]) {
        this.addError(field, `Article must have ${field}`);
      }
    });

    // Recommended fields
    if (!schema.dateModified) {
      this.addWarning('dateModified', 'Article should have dateModified for freshness signals');
    }

    if (!schema.wordCount) {
      this.addWarning('wordCount', 'Article should have wordCount for better SEO');
    }

    if (!schema.keywords) {
      this.addWarning('keywords', 'Article should have keywords for better categorization');
    }

    if (!schema.articleSection) {
      this.addWarning('articleSection', 'Article should have articleSection for categorization');
    }

    if (!schema.speakable) {
      this.addWarning('speakable', 'Article should have speakable markup for voice assistants');
    }

    // Validate dates
    if (schema.datePublished && !this.isValidDate(schema.datePublished)) {
      this.addError('datePublished', 'Invalid date format for datePublished');
    }

    if (schema.dateModified && !this.isValidDate(schema.dateModified)) {
      this.addError('dateModified', 'Invalid date format for dateModified');
    }
  }

  private validateBlogPosting(schema: BaseStructuredData): void {
    // BlogPosting extends Article
    this.validateArticle(schema);
  }

  private validateCourse(schema: BaseStructuredData): void {
    const requiredFields = ['name', 'description', 'provider'];

    requiredFields.forEach(field => {
      if (!schema[field]) {
        this.addError(field, `Course must have ${field}`);
      }
    });

    // Recommended for rich snippets
    if (!schema.aggregateRating) {
      this.addWarning('aggregateRating', 'Course should have ratings for rich snippets');
    }

    if (!schema.offers) {
      this.addWarning('offers', 'Course should have offer information');
    }

    if (!schema.hasCourseInstance) {
      this.addWarning('hasCourseInstance', 'Course should have course instance details');
    }

    if (!schema.teaches || (Array.isArray(schema.teaches) && schema.teaches.length === 0)) {
      this.addWarning('teaches', 'Course should specify what it teaches');
    }

    if (!schema.educationalCredentialAwarded) {
      this.addWarning('educationalCredentialAwarded', 'Course should specify credential awarded');
    }

    if (!schema.coursePrerequisites) {
      this.addWarning('coursePrerequisites', 'Course should specify prerequisites');
    }
  }

  private validateFAQPage(schema: BaseStructuredData): void {
    if (!schema.mainEntity || !Array.isArray(schema.mainEntity) || schema.mainEntity.length === 0) {
      this.addError('mainEntity', 'FAQPage must have at least one question');
    } else {
      schema.mainEntity.forEach((question: any, index: number) => {
        if (!question.name) {
          this.addError(`mainEntity[${index}].name`, 'Question must have a name');
        }
        if (!question.acceptedAnswer || !question.acceptedAnswer.text) {
          this.addError(`mainEntity[${index}].acceptedAnswer`, 'Question must have an answer');
        }
      });
    }
  }

  private validateQuiz(schema: BaseStructuredData): void {
    const requiredFields = ['name', 'description'];

    requiredFields.forEach(field => {
      if (!schema[field]) {
        this.addError(field, `Quiz must have ${field}`);
      }
    });

    if (!schema.about) {
      this.addWarning('about', 'Quiz should specify what it is about');
    }

    if (!schema.educationalLevel) {
      this.addWarning('educationalLevel', 'Quiz should specify educational level');
    }
  }

  private validateBreadcrumbList(schema: BaseStructuredData): void {
    if (
      !schema.itemListElement ||
      !Array.isArray(schema.itemListElement) ||
      schema.itemListElement.length === 0
    ) {
      this.addError('itemListElement', 'BreadcrumbList must have at least one item');
    } else {
      schema.itemListElement.forEach((item: any, index: number) => {
        if (!item.position) {
          this.addError(`itemListElement[${index}].position`, 'Breadcrumb item must have position');
        }
        if (!item.name) {
          this.addError(`itemListElement[${index}].name`, 'Breadcrumb item must have name');
        }
        if (!item.item) {
          this.addError(`itemListElement[${index}].item`, 'Breadcrumb item must have URL');
        }
      });
    }
  }

  private validateWebSite(schema: BaseStructuredData): void {
    if (!schema.name) {
      this.addError('name', 'WebSite must have a name');
    }

    if (!schema.url) {
      this.addError('url', 'WebSite must have a URL');
    }

    if (!schema.potentialAction) {
      this.addWarning(
        'potentialAction',
        'WebSite should have SearchAction for sitelinks searchbox'
      );
    }
  }

  private validateWebPage(schema: BaseStructuredData): void {
    if (!schema.name) {
      this.addError('name', 'WebPage must have a name');
    }

    if (!schema.url) {
      this.addError('url', 'WebPage must have a URL');
    }

    if (!schema.breadcrumb) {
      this.addWarning('breadcrumb', 'WebPage should have breadcrumb navigation');
    }
  }

  private validateContactPage(schema: BaseStructuredData): void {
    if (!schema.name) {
      this.addError('name', 'ContactPage must have a name');
    }

    if (!schema.mainEntity) {
      this.addWarning('mainEntity', 'ContactPage should have organization contact details');
    }
  }

  private validateHowTo(schema: BaseStructuredData): void {
    if (!schema.name) {
      this.addError('name', 'HowTo must have a name');
    }

    if (!schema.step || !Array.isArray(schema.step) || schema.step.length === 0) {
      this.addError('step', 'HowTo must have at least one step');
    } else {
      schema.step.forEach((step: any, index: number) => {
        if (!step.name) {
          this.addError(`step[${index}].name`, 'HowTo step must have a name');
        }
        if (!step.text) {
          this.addError(`step[${index}].text`, 'HowTo step must have text');
        }
      });
    }
  }

  private validateVideo(schema: BaseStructuredData): void {
    if (!schema.name) {
      this.addError('name', 'VideoObject must have a name');
    }

    if (!schema.description) {
      this.addWarning('description', 'VideoObject should have a description');
    }

    if (!schema.thumbnailUrl) {
      this.addWarning('thumbnailUrl', 'VideoObject should have a thumbnail');
    }

    if (!schema.uploadDate) {
      this.addWarning('uploadDate', 'VideoObject should have upload date');
    }
  }

  private validateItemList(schema: BaseStructuredData): void {
    if (!schema.name) {
      this.addError('name', 'ItemList must have a name');
    }

    if (!schema.itemListElement || !Array.isArray(schema.itemListElement)) {
      this.addWarning('itemListElement', 'ItemList should have items');
    }
  }

  private isValidDate(date: string): boolean {
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(.\d{3})?Z?)?$/;
    return iso8601Regex.test(date);
  }

  private idSet = new Set<string>();

  private checkDuplicateId(id: string): void {
    if (this.idSet.has(id)) {
      this.addError('@id', `Duplicate @id value: ${id}`);
    } else {
      this.idSet.add(id);
    }
  }

  private addError(field: string, message: string): void {
    this.errors.push({ field, message, severity: 'error' });
  }

  private addWarning(field: string, message: string): void {
    this.warnings.push({ field, message, severity: 'warning' });
  }
}

// Export a singleton instance for reuse
export const schemaValidator = new SchemaValidator();
