/**
 * Meta Tag Optimizer for CDL Help
 * Ensures optimal meta tag lengths for SEO and social sharing
 */

export class MetaOptimizer {
  constructor(locale = 'en') {
    this.locale = locale;

    // Adjust limits for different languages
    this.limits = {
      title: this.getTitleLimit(locale),
      description: this.getDescriptionLimit(locale),
    };
  }

  getTitleLimit(locale) {
    // Arabic and Asian languages need more space for character complexity
    const extendedLangs = ['ar', 'zh', 'ko', 'ja'];
    return extendedLangs.includes(locale) ? 70 : 60;
  }

  getDescriptionLimit(locale) {
    const extendedLangs = ['ar', 'zh', 'ko', 'ja'];
    return extendedLangs.includes(locale) ? 160 : 155;
  }

  optimizeTitle(title, options = {}) {
    const { suffix = ' | CDL Help', includeSuffix = true, keywords = [] } = options;

    let optimized = title;

    // Remove extra spaces and normalize
    optimized = optimized.trim().replace(/\s+/g, ' ');

    // Add suffix if there's room
    if (includeSuffix && !optimized.includes(suffix)) {
      const withSuffix = optimized + suffix;
      if (withSuffix.length <= this.limits.title) {
        optimized = withSuffix;
      }
    }

    // Truncate if too long
    if (optimized.length > this.limits.title) {
      // Try to cut at word boundary
      optimized = this.truncateAtWord(optimized, this.limits.title - 3) + '...';
    }

    // Ensure primary keyword is included if possible
    if (keywords.length > 0 && !optimized.toLowerCase().includes(keywords[0].toLowerCase())) {
      // Try to prepend primary keyword if space allows
      const withKeyword = `${keywords[0]} - ${optimized}`;
      if (withKeyword.length <= this.limits.title) {
        optimized = withKeyword;
      }
    }

    return optimized;
  }

  optimizeDescription(description, options = {}) {
    const { minLength = 120, keywords = [], callToAction = true } = options;

    let optimized = description;

    // Remove extra spaces and normalize
    optimized = optimized.trim().replace(/\s+/g, ' ');

    // Expand if too short
    if (optimized.length < minLength) {
      // Add call to action if needed
      if (callToAction && !optimized.match(/free|download|practice|learn|start/i)) {
        optimized += ' Start practicing for free today.';
      }

      // Add keywords if still short
      if (optimized.length < minLength && keywords.length > 0) {
        const keywordPhrase = ` Learn ${keywords.slice(0, 2).join(' and ')} with our comprehensive guide.`;
        optimized += keywordPhrase;
      }
    }

    // Truncate if too long
    if (optimized.length > this.limits.description) {
      optimized = this.truncateAtWord(optimized, this.limits.description - 3) + '...';
    }

    // Ensure it ends with proper punctuation
    if (!optimized.match(/[.!?]$/)) {
      optimized += '.';
    }

    return optimized;
  }

  truncateAtWord(str, maxLength) {
    if (str.length <= maxLength) return str;

    const truncated = str.substr(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    return lastSpace > 0 ? truncated.substr(0, lastSpace) : truncated;
  }

  generateOpenGraph(page) {
    const { title, description, image, url, type = 'website', locale = 'en' } = page;

    // Ensure we have a default OG image
    const ogImage = image || this.getDefaultOGImage(type);

    return {
      'og:title': this.optimizeTitle(title, { includeSuffix: false }),
      'og:description': this.optimizeDescription(description),
      'og:image': ogImage,
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:alt': title,
      'og:url': url,
      'og:type': type,
      'og:locale': this.getOGLocale(locale),
      'og:site_name': 'CDL Help',
    };
  }

  generateTwitterCard(page) {
    const { title, description, image } = page;

    // Ensure we have a default Twitter image
    const twitterImage = image || this.getDefaultTwitterImage();

    return {
      'twitter:card': 'summary_large_image',
      'twitter:title': this.optimizeTitle(title, { includeSuffix: false }),
      'twitter:description': this.optimizeDescription(description, { minLength: 100 }),
      'twitter:image': twitterImage,
      'twitter:image:alt': title,
      'twitter:site': '@cdlhelp',
      'twitter:creator': '@cdlhelp',
    };
  }

  getOGLocale(locale) {
    const localeMap = {
      en: 'en_US',
      ru: 'ru_RU',
      uk: 'uk_UA',
      ar: 'ar_SA',
      ko: 'ko_KR',
      zh: 'zh_CN',
      tr: 'tr_TR',
      pt: 'pt_BR',
    };
    return localeMap[locale] || 'en_US';
  }

  getDefaultOGImage(type) {
    const baseUrl = 'https://www.cdlhelp.com/images/og/';
    const imageMap = {
      website: 'og-default.jpg',
      article: 'og-article.jpg',
      product: 'og-download.jpg',
      profile: 'og-profile.jpg',
    };
    return baseUrl + (imageMap[type] || 'og-default.jpg');
  }

  getDefaultTwitterImage() {
    return 'https://www.cdlhelp.com/images/og/twitter-default.jpg';
  }

  // Validate meta tags
  validateMeta(title, description) {
    const issues = [];

    // Title validation
    if (!title) {
      issues.push('Missing title');
    } else if (title.length > this.limits.title) {
      issues.push(`Title too long: ${title.length} chars (max: ${this.limits.title})`);
    } else if (title.length < 30) {
      issues.push(`Title too short: ${title.length} chars (min: 30)`);
    }

    // Description validation
    if (!description) {
      issues.push('Missing description');
    } else if (description.length > this.limits.description) {
      issues.push(
        `Description too long: ${description.length} chars (max: ${this.limits.description})`
      );
    } else if (description.length < 120) {
      issues.push(`Description too short: ${description.length} chars (min: 120)`);
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }
}

// Export singleton instance for common use
export const metaOptimizer = new MetaOptimizer();
