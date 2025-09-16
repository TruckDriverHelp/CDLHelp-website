/**
 * Blog fetcher for Strapi CMS
 */

class BlogFetcher {
  constructor(config) {
    this.baseUrl = `http://${config.baseUrl}:${process.env.STRAPI_PORT || 1337}`;
    this.apiKey = config.apiKey;
    this.cache = new Map();
  }

  /**
   * Fetch all blog posts for a specific locale
   */
  async fetchAll(options = {}) {
    const { locale = 'en', limit = 1000, includeUnpublished = false } = options;

    const cacheKey = `blog:${locale}:${limit}:${includeUnpublished}`;

    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < 3600000) {
        // 1 hour cache
        return cached.data;
      }
    }

    try {
      const params = new URLSearchParams({
        locale,
        'pagination[limit]': limit,
        'pagination[page]': 1,
        'sort[0]': 'publishedAt:desc',
        populate: '*',
      });

      if (!includeUnpublished) {
        params.append('filters[publishedAt][$notNull]', 'true');
      }

      const response = await fetch(`${this.baseUrl}/api/articles?${params}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Strapi API error: ${response.status}`);
      }

      const data = await response.json();
      const articles = await this.transformArticles(data.data, locale);

      // Cache the result
      this.cache.set(cacheKey, {
        data: articles,
        timestamp: Date.now(),
      });

      return articles;
    } catch (error) {
      console.error(`Failed to fetch blog posts for locale ${locale}:`, error);
      return [];
    }
  }

  /**
   * Fetch a single blog post by slug
   */
  async fetchBySlug(slug, locale = 'en') {
    try {
      const params = new URLSearchParams({
        locale,
        'filters[slug][$eq]': slug,
        populate: '*',
      });

      const response = await fetch(`${this.baseUrl}/api/articles?${params}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Strapi API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.data.length === 0) {
        return null;
      }

      return this.transformArticle(data.data[0], locale);
    } catch (error) {
      console.error(`Failed to fetch blog post ${slug}:`, error);
      return null;
    }
  }

  /**
   * Transform Strapi articles to sitemap format
   */
  async transformArticles(articles, locale) {
    return Promise.all(articles.map(article => this.transformArticle(article, locale)));
  }

  /**
   * Transform a single article
   */
  async transformArticle(article, locale) {
    const attributes = article.attributes;

    return {
      id: article.id,
      slug: attributes.slug,
      title: attributes.title,
      description: attributes.description,
      publishedAt: attributes.publishedAt,
      updatedAt: attributes.updatedAt,
      locale,
      author: attributes.author?.data?.attributes?.name || null,
      categories: this.extractCategories(attributes.categories),
      tags: this.extractTags(attributes.tags),
      seo: attributes.seo || {},
      localizations: this.extractLocalizations(attributes.localizations),
    };
  }

  /**
   * Extract categories from Strapi response
   */
  extractCategories(categories) {
    if (!categories?.data) return [];

    return categories.data.map(cat => ({
      id: cat.id,
      name: cat.attributes.name,
      slug: cat.attributes.slug,
    }));
  }

  /**
   * Extract tags from Strapi response
   */
  extractTags(tags) {
    if (!tags?.data) return [];

    return tags.data.map(tag => ({
      id: tag.id,
      name: tag.attributes.name,
      slug: tag.attributes.slug,
    }));
  }

  /**
   * Extract localizations from Strapi response
   */
  extractLocalizations(localizations) {
    if (!localizations?.data) return [];

    return localizations.data.map(loc => ({
      id: loc.id,
      locale: loc.attributes.locale,
      slug: loc.attributes.slug,
      title: loc.attributes.title,
    }));
  }

  /**
   * Fetch all blog posts with pagination
   */
  async fetchAllPaginated(locale = 'en') {
    const allArticles = [];
    let page = 1;
    let hasMore = true;
    const pageSize = 100;

    while (hasMore) {
      try {
        const params = new URLSearchParams({
          locale,
          'pagination[page]': page,
          'pagination[pageSize]': pageSize,
          'sort[0]': 'publishedAt:desc',
          populate: '*',
          'filters[publishedAt][$notNull]': 'true',
        });

        const response = await fetch(`${this.baseUrl}/api/articles?${params}`, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Strapi API error: ${response.status}`);
        }

        const data = await response.json();
        const articles = await this.transformArticles(data.data, locale);
        allArticles.push(...articles);

        // Check if there are more pages
        hasMore = data.meta.pagination.page < data.meta.pagination.pageCount;
        page++;
      } catch (error) {
        console.error(`Error fetching page ${page}:`, error);
        hasMore = false;
      }
    }

    return allArticles;
  }
}

module.exports = BlogFetcher;
