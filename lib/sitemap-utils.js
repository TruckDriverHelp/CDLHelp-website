const axios = require('axios');

// Функция для получения всех статей из Strapi
async function fetchAllArticles() {
  const locales = ["en", "ru", "uk", "ar", "ko", "zh", "tr", "pt"];
  const articles = [];
  
  for (const locale of locales) {
    try {
      const url = `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/articles?locale=${locale}`;
      const response = await axios.get(url, {
        headers: {
          "Authorization": `Bearer ${process.env.STRAPI_API_KEY}`
        }
      });
      
      if (response.data?.data) {
        response.data.data.forEach(article => {
          articles.push({
            slug: article.attributes.slug,
            locale: locale,
            updatedAt: article.attributes.updatedAt,
            priority: 0.6
          });
        });
      }
    } catch (error) {
      console.error(`Error fetching articles for locale ${locale}:`, error.message);
    }
  }
  
  return articles;
}

// Функция для получения штатов и городов из GraphQL API
async function fetchStatesAndCities() {
  try {
    const query = `
      query {
        schoolCities(pagination: { limit: 100 }) {
          data {
            attributes {
              city
              state
              schools {
                data {
                  id
                }
              }
            }
          }
        }
      }
    `;

    const response = await axios.post(`http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/graphql`, {
      query
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_KEY}`,
      }
    });

    const schoolCities = response.data?.data?.schoolCities?.data || [];
    
    // Группируем по штатам
    const statesMap = new Map();
    
    schoolCities.forEach(item => {
      const { state, city, schools } = item.attributes;
      if (!state || !city) return;
      
      const stateSlug = state.toLowerCase().replace(/[_\s]+/g, '-');
      const citySlug = city.toLowerCase().replace(/[_\s]+/g, '-');
      
      if (!statesMap.has(stateSlug)) {
        statesMap.set(stateSlug, {
          name: state.replace(/_/g, ' '),
          slug: stateSlug,
          cities: []
        });
      }
      
      statesMap.get(stateSlug).cities.push({
        name: city.replace(/_/g, ' '),
        slug: citySlug,
        schoolCount: schools?.data?.length || 0
      });
    });
    
    return Array.from(statesMap.values());
  } catch (error) {
    console.error('Error fetching states and cities:', error.message);
    
    // Fallback к статическим данным
    return [
      {
        slug: 'california',
        name: 'California',
        cities: [
          { slug: 'los-angeles', name: 'Los Angeles' },
          { slug: 'san-francisco', name: 'San Francisco' },
          { slug: 'san-diego', name: 'San Diego' },
          { slug: 'sacramento', name: 'Sacramento' }
        ]
      },
      {
        slug: 'texas',
        name: 'Texas',
        cities: [
          { slug: 'houston', name: 'Houston' },
          { slug: 'dallas', name: 'Dallas' },
          { slug: 'austin', name: 'Austin' },
          { slug: 'san-antonio', name: 'San Antonio' }
        ]
      },
      {
        slug: 'florida',
        name: 'Florida',
        cities: [
          { slug: 'miami', name: 'Miami' },
          { slug: 'orlando', name: 'Orlando' },
          { slug: 'tampa', name: 'Tampa' },
          { slug: 'jacksonville', name: 'Jacksonville' }
        ]
      }
    ];
  }
}

// Функция для получения pre-trip inspection данных
function getPreTripData() {
  return {
    'tractor-front': 11,
    'tractor-side': 10, 
    'engine-driver-side': 6,
    'engine-passenger-side': 6,
    'front-suspension': 3,
    'front-brakes': 5,
    'tractor-coupling': 10,
    'front-of-trailer': 2,
    'rear-wheels': 7,
    'drive-axle-suspension': 5,
    'drive-brakes': 4,
    'coupling-system': 8,
    'side-of-trailer': 4,
    'trailer-suspension': 5,
    'trailer-brakes': 5,
    'trailer-wheels': 5,
    'rear-of-trailer': 5,
    'in-cab-inspection': 17,
    'brakes': 4
  };
}

// Основные локали проекта
const LOCALES = ["en", "ru", "uk", "ar", "ko", "zh", "tr", "pt"];

// Статические страницы
const STATIC_PAGES = [
  'companies', 'contact', 'cdl-texas', 'privacy-policy', 'terms-conditions',
  'cookies-policy', 'road-signs/test', 'dot-physical-exam', 'dot-physical-exam/search',
  'pre-trip-inspection/guide', 'cdl-schools'
];

module.exports = {
  fetchAllArticles,
  fetchStatesAndCities,
  getPreTripData,
  LOCALES,
  STATIC_PAGES
}; 