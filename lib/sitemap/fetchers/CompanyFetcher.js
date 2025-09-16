/**
 * Company fetcher for trucking companies data
 */

class CompanyFetcher {
  constructor(config) {
    this.baseUrl = `http://${config.baseUrl}:${process.env.STRAPI_PORT || 1337}`;
    this.apiKey = config.apiKey;
    this.cache = new Map();
  }

  /**
   * Fetch all companies for a specific locale
   */
  async fetchAll(options = {}) {
    const { locale = 'en' } = options;
    const cacheKey = `companies:${locale}`;

    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < 86400000) {
        // 24 hour cache
        return cached.data;
      }
    }

    try {
      // In production, this would fetch from Strapi
      // For now, return sample trucking companies
      const companies = [
        {
          id: 1,
          slug: 'swift-transportation',
          name: 'Swift Transportation',
          description: 'One of the largest trucking companies in North America',
          locale,
          updatedAt: new Date().toISOString(),
          fleet_size: 20000,
          headquarters: 'Phoenix, AZ',
        },
        {
          id: 2,
          slug: 'jb-hunt',
          name: 'J.B. Hunt Transport Services',
          description: 'Leading transportation and logistics company',
          locale,
          updatedAt: new Date().toISOString(),
          fleet_size: 15000,
          headquarters: 'Lowell, AR',
        },
        {
          id: 3,
          slug: 'schneider-national',
          name: 'Schneider National',
          description: 'Premier provider of trucking and logistics services',
          locale,
          updatedAt: new Date().toISOString(),
          fleet_size: 13000,
          headquarters: 'Green Bay, WI',
        },
        {
          id: 4,
          slug: 'werner-enterprises',
          name: 'Werner Enterprises',
          description: 'Transportation and logistics company',
          locale,
          updatedAt: new Date().toISOString(),
          fleet_size: 8000,
          headquarters: 'Omaha, NE',
        },
        {
          id: 5,
          slug: 'cr-england',
          name: 'C.R. England',
          description: 'Family-owned trucking company',
          locale,
          updatedAt: new Date().toISOString(),
          fleet_size: 4500,
          headquarters: 'Salt Lake City, UT',
        },
        {
          id: 6,
          slug: 'prime-inc',
          name: 'Prime Inc.',
          description: 'Refrigerated and flatbed trucking company',
          locale,
          updatedAt: new Date().toISOString(),
          fleet_size: 7000,
          headquarters: 'Springfield, MO',
        },
        {
          id: 7,
          slug: 'knight-transportation',
          name: 'Knight Transportation',
          description: 'Truckload transportation provider',
          locale,
          updatedAt: new Date().toISOString(),
          fleet_size: 5000,
          headquarters: 'Phoenix, AZ',
        },
        {
          id: 8,
          slug: 'us-xpress',
          name: 'U.S. Xpress Enterprises',
          description: 'Asset-based truckload carrier',
          locale,
          updatedAt: new Date().toISOString(),
          fleet_size: 7000,
          headquarters: 'Chattanooga, TN',
        },
        {
          id: 9,
          slug: 'covenant-transport',
          name: 'Covenant Transport',
          description: 'Expedited and dedicated trucking services',
          locale,
          updatedAt: new Date().toISOString(),
          fleet_size: 2800,
          headquarters: 'Chattanooga, TN',
        },
        {
          id: 10,
          slug: 'pam-transport',
          name: 'PAM Transport',
          description: 'Dedicated and OTR trucking services',
          locale,
          updatedAt: new Date().toISOString(),
          fleet_size: 2000,
          headquarters: 'Tontitown, AR',
        },
      ];

      // Add Russian translations if locale is 'ru'
      if (locale === 'ru') {
        companies.forEach(company => {
          company.localizations = [
            {
              locale: 'en',
              slug: company.slug,
            },
          ];
        });
      }

      // Cache the result
      this.cache.set(cacheKey, {
        data: companies,
        timestamp: Date.now(),
      });

      return companies;
    } catch (error) {
      console.error(`Failed to fetch companies for locale ${locale}:`, error);
      return [];
    }
  }

  /**
   * Fetch a single company by slug
   */
  async fetchBySlug(slug, locale = 'en') {
    const companies = await this.fetchAll({ locale });
    return companies.find(company => company.slug === slug) || null;
  }

  /**
   * Get company categories
   */
  async getCategories() {
    return [
      { slug: 'refrigerated', name: 'Refrigerated Carriers' },
      { slug: 'flatbed', name: 'Flatbed Carriers' },
      { slug: 'dry-van', name: 'Dry Van Carriers' },
      { slug: 'tanker', name: 'Tanker Carriers' },
      { slug: 'ltl', name: 'LTL Carriers' },
      { slug: 'dedicated', name: 'Dedicated Carriers' },
      { slug: 'owner-operator', name: 'Owner Operator Companies' },
      { slug: 'regional', name: 'Regional Carriers' },
      { slug: 'otr', name: 'OTR Carriers' },
      { slug: 'local', name: 'Local Carriers' },
    ];
  }

  /**
   * Get featured companies
   */
  async getFeaturedCompanies(locale = 'en', limit = 5) {
    const companies = await this.fetchAll({ locale });

    // Return top companies by fleet size
    return companies.sort((a, b) => (b.fleet_size || 0) - (a.fleet_size || 0)).slice(0, limit);
  }

  /**
   * Get companies by category
   */
  async getByCategory(category, locale = 'en') {
    // In production, this would filter by category
    const companies = await this.fetchAll({ locale });

    // For now, return a subset based on category
    const categoryMap = {
      refrigerated: ['prime-inc', 'cr-england'],
      flatbed: ['werner-enterprises', 'schneider-national'],
      'dry-van': ['swift-transportation', 'jb-hunt'],
      dedicated: ['covenant-transport', 'pam-transport'],
      otr: ['knight-transportation', 'us-xpress'],
    };

    const slugs = categoryMap[category] || [];
    return companies.filter(company => slugs.includes(company.slug));
  }

  /**
   * Search companies
   */
  async search(query, locale = 'en') {
    const companies = await this.fetchAll({ locale });
    const searchTerm = query.toLowerCase();

    return companies.filter(
      company =>
        company.name.toLowerCase().includes(searchTerm) ||
        company.description.toLowerCase().includes(searchTerm) ||
        company.headquarters?.toLowerCase().includes(searchTerm)
    );
  }
}

module.exports = CompanyFetcher;
