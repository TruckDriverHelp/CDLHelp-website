import { createClient } from '@supabase/supabase-js';
import { SchoolLocation, SupabaseSchoolData } from '../model/types';
const STRAPI_URL =
  'http://' + process.env.STRAPI_HOST + ':' + process.env.STRAPI_PORT || 'http://localhost:1337';
const GRAPHQL_ENDPOINT = `${STRAPI_URL}/graphql`;

// Strapi GraphQL API для школ
export const fetchSchoolsByState = async (state: string): Promise<SchoolLocation[]> => {
  try {
    const query = `
      query GetSchoolLocationsByState($state: String!) {
        schoolLocations(filters: { state: { eq: $state } }) {
          data {
            id
            attributes {
              Address
              phone_number
              coords
              city
              state
              zip
              locations {
                data {
                  id
                  attributes {
                    Name
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch(
      `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/graphql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
        },
        body: JSON.stringify({
          query,
          variables: { state },
        }),
      }
    );

    const { data } = await response.json();
    return data?.schoolLocations?.data || [];
  } catch (error) {
    // Error fetching schools by state
    throw new Error('Failed to fetch schools');
  }
};

// Supabase API для школ (legacy)
export const fetchSupabaseSchools = async (): Promise<SupabaseSchoolData[]> => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    // Supabase credentials are missing
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase
      .from('phonenumbers')
      .select(
        '*, schools(school_name), locations(address_street, address_city, address_state, address_zip)'
      );

    if (error) {
      // Data fetch error
      throw new Error('Failed to fetch schools from Supabase');
    }

    return data || [];
  } catch (error) {
    // Error fetching Supabase schools
    throw new Error('Failed to fetch schools from Supabase');
  }
};

// Получение всех школ (GraphQL API)
export const fetchAllSchools = async (): Promise<SchoolLocation[]> => {
  try {
    const query = `
      query GetAllSchoolLocations {
        schoolLocations(pagination: { limit: 100 }) {
          data {
            id
            attributes {
              Address
              phone_number
              coords
              city
              state
              zip
              locations {
                data {
                  id
                  attributes {
                    Name
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch(
      `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/graphql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
        },
        body: JSON.stringify({ query }),
      }
    );

    const { data } = await response.json();
    return data?.schoolLocations?.data || [];
  } catch (error) {
    // Error fetching all schools
    // Возвращаем пустой массив вместо выброса ошибки для graceful fallback
    return [];
  }
};

// Получение уникальных штатов с количеством школ
export const fetchStatesWithSchoolCounts = async (): Promise<
  Array<{ slug: string; name: string; schoolCount: number }>
> => {
  try {
    const query = `
      query GetStatesWithCounts {
        schoolLocations(pagination: { limit: 100 }) {
          data {
            attributes {
              state
              city
            }
          }
        }
      }
    `;

    const response = await fetch(
      `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/graphql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
        },
        body: JSON.stringify({ query }),
      }
    );

    const { data } = await response.json();
    const schoolLocations = data?.schoolLocations?.data || [];

    // Группируем по штатам и считаем количество
    const stateMap = new Map<string, number>();

    schoolLocations.forEach((location: any) => {
      const state = location.attributes.state;
      if (state) {
        stateMap.set(state, (stateMap.get(state) || 0) + 1);
      }
    });

    // Преобразуем в нужный формат, используя оригинальные названия из Strapi
    const states = Array.from(stateMap.entries()).map(([state, count]) => ({
      slug: state.toLowerCase().replace(/[_\s]+/g, '-'), // Заменяем подчеркивания и пробелы на дефисы
      name: state.replace(/_/g, ' '), // Заменяем подчеркивания на пробелы для отображения
      schoolCount: count,
    }));

    return states.sort((a, b) => b.schoolCount - a.schoolCount); // Сортируем по количеству школ
  } catch (error) {
    // Error fetching states with school counts
    return [];
  }
};

/**
 * Fetch all states with their cities and school counts
 */
export async function fetchStatesWithCities() {
  const query = `
    query {
      schoolCities(pagination: { limit: 100 }) {
        data {
          id
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

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      // GraphQL errors found
      return [];
    }

    const schoolCities = data.data?.schoolCities?.data || [];

    // Group cities by state and calculate school counts
    const statesMap = new Map();

    schoolCities.forEach(cityData => {
      const { city, state, schools } = cityData.attributes;
      const schoolCount = schools.data.length;

      if (!statesMap.has(state)) {
        statesMap.set(state, {
          name: state,
          slug: state.toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-'),
          cities: [],
          schoolCount: 0,
        });
      }

      const stateData = statesMap.get(state);
      stateData.cities.push({
        name: city,
        slug: city.toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-'),
        schoolCount,
      });
      stateData.schoolCount += schoolCount;
    });

    return Array.from(statesMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    // Error fetching states with cities
    return [];
  }
}

/**
 * Fetch cities for a specific state
 */
export async function fetchCitiesForState(state: string) {
  const query = `
    query {
      schoolCities(
        filters: { state: { eq: "${state}" } }
        pagination: { limit: 100 }
      ) {
        data {
          id
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

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      // GraphQL errors found
      return [];
    }

    const schoolCities = data.data?.schoolCities?.data || [];

    return schoolCities
      .map(cityData => ({
        name: cityData.attributes.city,
        slug: cityData.attributes.city.toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-'),
        schoolCount: cityData.attributes.schools.data.length,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    // Error fetching cities for state
    return [];
  }
}

/**
 * Fetch schools for a specific city and state
 */
export async function fetchSchoolsForCity(state: string, city: string) {
  const query = `
    query {
      schoolCities(
        filters: { 
          and: [
            { state: { eq: "${state}" } }
            { city: { eq: "${city}" } }
          ]
        }
        pagination: { limit: 100 }
      ) {
        data {
          id
          attributes {
            city
            state
            schools {
              data {
                id
                attributes {
                  Name
                  school_locations {
                    data {
                      id
                      attributes {
                        Address
                        phone_number
                        city
                        state
                        zip
                        coords
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      // GraphQL errors found
      return [];
    }

    const schoolCities = data.data?.schoolCities?.data || [];

    // Extract all school locations from all matching city records
    const allSchoolLocations = [];
    schoolCities.forEach(cityData => {
      cityData.attributes.schools.data.forEach(school => {
        school.attributes.school_locations.data.forEach(location => {
          allSchoolLocations.push({
            id: location.id,
            attributes: {
              Address: location.attributes.Address,
              phone_number: location.attributes.phone_number,
              city: location.attributes.city,
              state: location.attributes.state,
              zip: location.attributes.zip,
              coords: location.attributes.coords,
              locations: {
                data: [
                  {
                    id: school.id,
                    attributes: {
                      Name: school.attributes.Name,
                    },
                  },
                ],
              },
            },
          });
        });
      });
    });

    // Remove duplicates based on location ID
    const uniqueSchoolLocations = allSchoolLocations.filter(
      (location, index, self) => index === self.findIndex(l => l.id === location.id)
    );

    return uniqueSchoolLocations.sort((a, b) =>
      a.attributes.locations.data[0].attributes.Name.localeCompare(
        b.attributes.locations.data[0].attributes.Name
      )
    );
  } catch (error) {
    // Error fetching schools for city
    return [];
  }
}
