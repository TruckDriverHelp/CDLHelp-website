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
      // Fetch actual states from Strapi GraphQL API
      const query = `
        query {
          schoolCities(pagination: { limit: 500 }) {
            state
            city
            schools {
              documentId
            }
          }
        }
      `;

      const response = await fetch(`${this.baseUrl}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.errors) {
        console.error('GraphQL errors:', data.errors);
        // Fallback to known states if API fails
        return this.getFallbackStates();
      }

      const schoolCities = data.data?.schoolCities || [];

      // Group by states and count schools
      const statesMap = new Map();

      schoolCities.forEach(cityData => {
        const { state, schools } = cityData;
        const schoolCount = schools?.length || 0;

        if (!statesMap.has(state)) {
          statesMap.set(state, {
            name: state,
            slug: state.toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-'),
            schoolCount: 0,
          });
        }

        const stateData = statesMap.get(state);
        stateData.schoolCount += schoolCount;
      });

      const states = Array.from(statesMap.values()).sort((a, b) => a.name.localeCompare(b.name));

      // Cache the result
      this.cache.set(cacheKey, {
        data: states,
        timestamp: Date.now(),
      });

      return states;
    } catch (error) {
      console.error('Failed to fetch states:', error);
      // Return fallback states if API is unavailable
      return this.getFallbackStates();
    }
  }

  /**
   * Get fallback states (only the states that actually have schools)
   */
  getFallbackStates() {
    return [
      { name: 'California', slug: 'california', schoolCount: 2 },
      { name: 'Florida', slug: 'florida', schoolCount: 3 },
      { name: 'Illinois', slug: 'illinois', schoolCount: 1 },
      { name: 'New York', slug: 'new-york', schoolCount: 1 },
      { name: 'Ohio', slug: 'ohio', schoolCount: 2 },
      { name: 'Pennsylvania', slug: 'pennsylvania', schoolCount: 1 },
      { name: 'Washington', slug: 'washington', schoolCount: 1 },
      { name: 'Wisconsin', slug: 'wisconsin', schoolCount: 1 },
    ];
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
    const cacheKey = `schools:cities:${state}`;

    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < 86400000) {
        // 24 hour cache
        return cached.data;
      }
    }

    try {
      // Convert slug back to state name format
      const stateName = state
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      const query = `
        query {
          schoolCities(
            filters: { state: { eq: "${stateName}" } }
            pagination: { limit: 100 }
          ) {
            city
            schools {
              documentId
            }
          }
        }
      `;

      const response = await fetch(`${this.baseUrl}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.errors) {
        console.error('GraphQL errors:', data.errors);
        return this.getFallbackCities(state);
      }

      const schoolCities = data.data?.schoolCities || [];

      const cities = schoolCities
        .map(cityData => ({
          name: cityData.city,
          slug: cityData.city.toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-'),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      // Cache the result
      this.cache.set(cacheKey, {
        data: cities,
        timestamp: Date.now(),
      });

      return cities;
    } catch (error) {
      console.error(`Failed to fetch cities for state ${state}:`, error);
      return this.getFallbackCities(state);
    }
  }

  /**
   * Get fallback cities for a state
   */
  getFallbackCities(state) {
    const fallbackCities = {
      california: [
        { name: 'Los Angeles', slug: 'los-angeles' },
        { name: 'Sacramento', slug: 'sacramento' },
      ],
      florida: [
        { name: 'Jacksonville', slug: 'jacksonville' },
        { name: 'Miami', slug: 'miami' },
        { name: 'Orlando', slug: 'orlando' },
      ],
      illinois: [{ name: 'Chicago', slug: 'chicago' }],
      'new-york': [{ name: 'New York', slug: 'new-york' }],
      ohio: [
        { name: 'Cincinnati', slug: 'cincinnati' },
        { name: 'Columbus', slug: 'columbus' },
      ],
      pennsylvania: [{ name: 'Philadelphia', slug: 'philadelphia' }],
      washington: [{ name: 'Seattle', slug: 'seattle' }],
      wisconsin: [{ name: 'Milwaukee', slug: 'milwaukee' }],
    };

    return fallbackCities[state] || [];
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
