/**
 * School fetcher for CDL schools data
 */

class SchoolFetcher {
  constructor(config) {
    this.baseUrl = `http://${config.baseUrl}:${process.env.STRAPI_PORT || 1337}`;
    this.apiKey = config.apiKey;
    this.cache = new Map();
  }

  /**
   * Fetch all states with schools
   */
  async fetchAllStates() {
    const cacheKey = 'schools:states';

    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < 86400000) {
        // 24 hour cache
        return cached.data;
      }
    }

    try {
      // For now, return a static list of states
      // In production, this would fetch from Strapi or database
      const states = [
        { name: 'Alabama', slug: 'alabama', schoolCount: 45 },
        { name: 'Alaska', slug: 'alaska', schoolCount: 12 },
        { name: 'Arizona', slug: 'arizona', schoolCount: 38 },
        { name: 'Arkansas', slug: 'arkansas', schoolCount: 29 },
        { name: 'California', slug: 'california', schoolCount: 156 },
        { name: 'Colorado', slug: 'colorado', schoolCount: 42 },
        { name: 'Connecticut', slug: 'connecticut', schoolCount: 28 },
        { name: 'Delaware', slug: 'delaware', schoolCount: 8 },
        { name: 'Florida', slug: 'florida', schoolCount: 98 },
        { name: 'Georgia', slug: 'georgia', schoolCount: 67 },
        { name: 'Hawaii', slug: 'hawaii', schoolCount: 6 },
        { name: 'Idaho', slug: 'idaho', schoolCount: 18 },
        { name: 'Illinois', slug: 'illinois', schoolCount: 89 },
        { name: 'Indiana', slug: 'indiana', schoolCount: 54 },
        { name: 'Iowa', slug: 'iowa', schoolCount: 31 },
        { name: 'Kansas', slug: 'kansas', schoolCount: 27 },
        { name: 'Kentucky', slug: 'kentucky', schoolCount: 36 },
        { name: 'Louisiana', slug: 'louisiana', schoolCount: 41 },
        { name: 'Maine', slug: 'maine', schoolCount: 14 },
        { name: 'Maryland', slug: 'maryland', schoolCount: 33 },
        { name: 'Massachusetts', slug: 'massachusetts', schoolCount: 29 },
        { name: 'Michigan', slug: 'michigan', schoolCount: 76 },
        { name: 'Minnesota', slug: 'minnesota', schoolCount: 48 },
        { name: 'Mississippi', slug: 'mississippi', schoolCount: 24 },
        { name: 'Missouri', slug: 'missouri', schoolCount: 52 },
        { name: 'Montana', slug: 'montana', schoolCount: 11 },
        { name: 'Nebraska', slug: 'nebraska', schoolCount: 19 },
        { name: 'Nevada', slug: 'nevada', schoolCount: 15 },
        { name: 'New Hampshire', slug: 'new-hampshire', schoolCount: 9 },
        { name: 'New Jersey', slug: 'new-jersey', schoolCount: 45 },
        { name: 'New Mexico', slug: 'new-mexico', schoolCount: 17 },
        { name: 'New York', slug: 'new-york', schoolCount: 112 },
        { name: 'North Carolina', slug: 'north-carolina', schoolCount: 58 },
        { name: 'North Dakota', slug: 'north-dakota', schoolCount: 8 },
        { name: 'Ohio', slug: 'ohio', schoolCount: 94 },
        { name: 'Oklahoma', slug: 'oklahoma', schoolCount: 32 },
        { name: 'Oregon', slug: 'oregon', schoolCount: 26 },
        { name: 'Pennsylvania', slug: 'pennsylvania', schoolCount: 87 },
        { name: 'Rhode Island', slug: 'rhode-island', schoolCount: 7 },
        { name: 'South Carolina', slug: 'south-carolina', schoolCount: 34 },
        { name: 'South Dakota', slug: 'south-dakota', schoolCount: 9 },
        { name: 'Tennessee', slug: 'tennessee', schoolCount: 49 },
        { name: 'Texas', slug: 'texas', schoolCount: 189 },
        { name: 'Utah', slug: 'utah', schoolCount: 21 },
        { name: 'Vermont', slug: 'vermont', schoolCount: 6 },
        { name: 'Virginia', slug: 'virginia', schoolCount: 51 },
        { name: 'Washington', slug: 'washington', schoolCount: 43 },
        { name: 'West Virginia', slug: 'west-virginia', schoolCount: 16 },
        { name: 'Wisconsin', slug: 'wisconsin', schoolCount: 44 },
        { name: 'Wyoming', slug: 'wyoming', schoolCount: 5 },
      ];

      // Cache the result
      this.cache.set(cacheKey, {
        data: states,
        timestamp: Date.now(),
      });

      return states;
    } catch (error) {
      console.error('Failed to fetch states:', error);
      return [];
    }
  }

  /**
   * Fetch schools by state
   */
  async fetchByState(state) {
    const cacheKey = `schools:state:${state}`;

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
      // For now, return sample data
      const schools = [];

      // Generate sample schools based on state
      const stateData = await this.fetchAllStates();
      const stateInfo = stateData.find(s => s.slug === state);

      if (stateInfo) {
        for (let i = 1; i <= Math.min(stateInfo.schoolCount, 10); i++) {
          schools.push({
            id: `${state}-${i}`,
            name: `CDL School ${i} - ${stateInfo.name}`,
            city: `City ${i}`,
            state: stateInfo.name,
            address: `${i}23 Main Street`,
            phone: `555-0${100 + i}`,
            website: `https://cdlschool${i}-${state}.com`,
            programs: ['Class A CDL', 'Class B CDL', 'Hazmat'],
            updatedAt: new Date().toISOString(),
          });
        }
      }

      // Cache the result
      this.cache.set(cacheKey, {
        data: schools,
        timestamp: Date.now(),
      });

      return schools;
    } catch (error) {
      console.error(`Failed to fetch schools for state ${state}:`, error);
      return [];
    }
  }

  /**
   * Fetch cities by state
   */
  async fetchCitiesByState(state) {
    const schools = await this.fetchByState(state);
    const cities = new Set();

    schools.forEach(school => {
      if (school.city) {
        cities.add({
          name: school.city,
          slug: this.cityToSlug(school.city),
        });
      }
    });

    return Array.from(cities).sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Fetch schools by state and city
   */
  async fetchByStateAndCity(state, city) {
    const schools = await this.fetchByState(state);

    return schools.filter(school => this.cityToSlug(school.city) === city);
  }

  /**
   * Convert state name to URL slug
   */
  stateToSlug(state) {
    return state.toLowerCase().replace(/\s+/g, '-');
  }

  /**
   * Convert city name to URL slug
   */
  cityToSlug(city) {
    return city
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  /**
   * Get total school count
   */
  async getTotalSchoolCount() {
    const states = await this.fetchAllStates();
    return states.reduce((total, state) => total + state.schoolCount, 0);
  }

  /**
   * Get featured schools
   */
  async getFeaturedSchools(limit = 10) {
    // In production, this would fetch featured schools from Strapi
    const schools = [];

    const states = await this.fetchAllStates();
    const topStates = states.sort((a, b) => b.schoolCount - a.schoolCount).slice(0, 5);

    for (const state of topStates) {
      const stateSchools = await this.fetchByState(state.slug);
      schools.push(...stateSchools.slice(0, 2));
    }

    return schools.slice(0, limit);
  }
}

module.exports = SchoolFetcher;
