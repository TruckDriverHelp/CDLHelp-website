import { createClient } from '@supabase/supabase-js';
import { SchoolLocation, SupabaseSchoolData } from '../model/types';
const STRAPI_URL =
  'http://' + process.env.STRAPI_HOST + ':' + process.env.STRAPI_PORT || 'http://localhost:1337';
const GRAPHQL_ENDPOINT = `${STRAPI_URL}/graphql`;

// Strapi GraphQL API for schools
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

// Supabase API for schools (legacy)
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

// Get all schools (GraphQL API)
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
    // Return empty array instead of throwing error for graceful fallback
    return [];
  }
};

// Get unique states with school counts
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

    // Group by states and count the number
    const stateMap = new Map<string, number>();

    schoolLocations.forEach((location: any) => {
      const state = location.attributes.state;
      if (state) {
        stateMap.set(state, (stateMap.get(state) || 0) + 1);
      }
    });

    // Convert to required format using original names from Strapi
    const states = Array.from(stateMap.entries()).map(([state, count]) => ({
      slug: state.toLowerCase().replace(/[_\s]+/g, '-'), // Replace underscores and spaces with dashes
      name: state.replace(/_/g, ' '), // Replace underscores with spaces for display
      schoolCount: count,
    }));

    return states.sort((a, b) => b.schoolCount - a.schoolCount); // Sort by number of schools
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
 * Fetch a single school by ID
 */
export async function fetchSchoolById(schoolId: string): Promise<SchoolLocation | null> {
  const query = `
    query GetSchoolById($id: ID!) {
      schoolLocation(id: $id) {
        data {
          id
          attributes {
            Address
            phone_number
            coords
            city
            state
            zip
            createdAt
            updatedAt
            publishedAt
            locations {
              data {
                id
                attributes {
                  Name
                  description
                  website
                  email
                  license_number
                  operating_hours
                  services_offered
                  certifications
                  languages_spoken
                  payment_methods
                  student_capacity
                  fleet_size
                  instructor_count
                  success_rate
                  average_completion_time
                  tuition_cost
                  financial_aid_available
                  job_placement_assistance
                  createdAt
                  updatedAt
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
        Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        variables: { id: schoolId },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = await response.json();
    return data?.schoolLocation?.data || null;
  } catch (error) {
    console.error('Error fetching school by ID:', error);
    return null;
  }
}

/**
 * Fetch a school by its name/slug
 */
export async function fetchSchoolBySlug(slug: string): Promise<SchoolLocation | null> {
  console.log('[fetchSchoolBySlug] Looking for school with slug:', slug);

  const query = `
    query GetAllSchoolsForSlugMatch {
      schoolLocations(pagination: { limit: 500 }) {
        data {
          id
          attributes {
            Address
            phone_number
            coords
            city
            state
            zip
            createdAt
            updatedAt
            publishedAt
            locations {
              data {
                id
                attributes {
                  Name
                  description
                  website
                  email
                  license_number
                  operating_hours
                  services_offered
                  certifications
                  languages_spoken
                  payment_methods
                  student_capacity
                  fleet_size
                  instructor_count
                  success_rate
                  average_completion_time
                  tuition_cost
                  financial_aid_available
                  job_placement_assistance
                  createdAt
                  updatedAt
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
        Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = await response.json();
    const schools = data?.schoolLocations?.data || [];

    console.log(`[fetchSchoolBySlug] Found ${schools.length} total schools`);

    // Log first few schools for debugging
    if (schools.length > 0) {
      console.log('[fetchSchoolBySlug] First 5 schools:');
      schools.slice(0, 5).forEach(school => {
        const schoolName = school.attributes?.locations?.data?.[0]?.attributes?.Name;
        const schoolSlug = schoolName
          ? schoolName
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')
          : 'no-name';
        console.log(`  - ${schoolName} => ${schoolSlug}`);
      });
    }

    // Find school by matching slug
    const matchingSchool = schools.find(school => {
      const schoolName = school.attributes?.locations?.data?.[0]?.attributes?.Name;
      if (!schoolName) return false;

      // Create slug from school name and compare
      const schoolSlug = schoolName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Debug logging for potential matches
      if (schoolName.toLowerCase().includes(slug.split('-')[0])) {
        console.log(
          `[fetchSchoolBySlug] Potential match: "${schoolName}" => "${schoolSlug}" (looking for "${slug}")`
        );
      }

      return schoolSlug === slug;
    });

    if (matchingSchool) {
      console.log(
        '[fetchSchoolBySlug] Found matching school:',
        matchingSchool.attributes?.locations?.data?.[0]?.attributes?.Name
      );
    } else {
      console.log('[fetchSchoolBySlug] No matching school found for slug:', slug);
    }

    return matchingSchool || null;
  } catch (error) {
    console.error('Error fetching school by slug:', error);
    return null;
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
