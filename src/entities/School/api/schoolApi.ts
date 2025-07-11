import { createClient } from '@supabase/supabase-js';
import { SchoolLocation, SupabaseSchoolData } from '../model/types';
const STRAPI_URL =
  process.env.STRAPI_HOST && process.env.STRAPI_PORT
    ? `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}`
    : 'http://localhost:1337';
const GRAPHQL_ENDPOINT = `${STRAPI_URL}/graphql`;

// Strapi GraphQL API for schools
export const fetchSchoolsByState = async (state: string): Promise<SchoolLocation[]> => {
  try {
    const query = `
      query GetSchoolLocationsByState($state: String!) {
        schoolLocations(filters: { state: { eq: $state } }) {
          documentId
          Address
          phone_number
          coords
          city
          state
          zip
          locations {
            documentId
            Name
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
    const schoolLocations = data?.schoolLocations || [];

    // Transform to match expected structure
    return schoolLocations.map(location => ({
      id: location.documentId,
      attributes: {
        Address: location.Address,
        phone_number: location.phone_number,
        coords: location.coords,
        city: location.city,
        state: location.state,
        zip: location.zip,
        locations: {
          data:
            location.locations?.map(loc => ({
              id: loc.documentId,
              attributes: {
                Name: loc.Name,
              },
            })) || [],
        },
      },
    }));
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
          documentId
          Address
          phone_number
          coords
          city
          state
          zip
          locations {
            documentId
            Name
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
    const schoolLocations = data?.schoolLocations || [];

    // Transform to match expected structure
    return schoolLocations.map(location => ({
      id: location.documentId,
      attributes: {
        Address: location.Address,
        phone_number: location.phone_number,
        coords: location.coords,
        city: location.city,
        state: location.state,
        zip: location.zip,
        locations: {
          data:
            location.locations?.map(loc => ({
              id: loc.documentId,
              attributes: {
                Name: loc.Name,
              },
            })) || [],
        },
      },
    }));
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
          state
          city
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
    const schoolLocations = data?.schoolLocations || [];

    // Group by states and count the number
    const stateMap = new Map<string, number>();

    schoolLocations.forEach((location: any) => {
      const state = location.state;
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
  // Strapi v5 query using documentId
  const query = `
    query {
      schoolCities(pagination: { limit: 100 }) {
        documentId
        city
        state
        schools {
          documentId
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

    const data = await response.json();

    if (data.errors) {
      return [];
    }

    const schoolCities = data.data?.schoolCities || [];

    // Group cities by state for v5 structure
    const statesMap = new Map();

    schoolCities.forEach(cityData => {
      const { city, state, schools } = cityData;
      const schoolCount = schools?.length || 0;

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

    const result = Array.from(statesMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    return result;
  } catch (error) {
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
        documentId
        city
        state
        schools {
          documentId
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

    const data = await response.json();

    if (data.errors) {
      // GraphQL errors found
      return [];
    }

    const schoolCities = data.data?.schoolCities || [];

    return schoolCities
      .map(cityData => ({
        name: cityData.city,
        slug: cityData.city.toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-'),
        schoolCount: cityData.schools?.length || 0,
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
        documentId
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
          documentId
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
    const location = data?.schoolLocation;

    if (!location) return null;

    // Transform to match expected structure
    return {
      id: location.documentId,
      attributes: {
        Address: location.Address,
        phone_number: location.phone_number,
        coords: location.coords,
        city: location.city,
        state: location.state,
        zip: location.zip,
        createdAt: location.createdAt,
        updatedAt: location.updatedAt,
        publishedAt: location.publishedAt,
        locations: {
          data:
            location.locations?.map(loc => ({
              id: loc.documentId,
              attributes: {
                Name: loc.Name,
                description: loc.description,
                website: loc.website,
                email: loc.email,
                license_number: loc.license_number,
                operating_hours: loc.operating_hours,
                services_offered: loc.services_offered,
                certifications: loc.certifications,
                languages_spoken: loc.languages_spoken,
                payment_methods: loc.payment_methods,
                student_capacity: loc.student_capacity,
                fleet_size: loc.fleet_size,
                instructor_count: loc.instructor_count,
                success_rate: loc.success_rate,
                average_completion_time: loc.average_completion_time,
                tuition_cost: loc.tuition_cost,
                financial_aid_available: loc.financial_aid_available,
                job_placement_assistance: loc.job_placement_assistance,
                createdAt: loc.createdAt,
                updatedAt: loc.updatedAt,
              },
            })) || [],
        },
      },
    };
  } catch (error) {
    return null;
  }
}

/**
 * Fetch a school by its name/slug
 */
export async function fetchSchoolBySlug(slug: string): Promise<SchoolLocation | null> {
  const query = `
    query GetAllSchoolsForSlugMatch {
      schoolLocations(pagination: { limit: 500 }) {
        documentId
        Address
        phone_number
        coords
        city
        state
        zip
        locations {
          documentId
          Name
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
    const schools = data?.schoolLocations || [];

    // Find school by matching slug
    const matchingSchool = schools.find(school => {
      const schoolName = school.locations?.[0]?.Name;
      if (!schoolName) return false;

      // Create slug from school name and compare
      const schoolSlug = schoolName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      return schoolSlug === slug;
    });

    if (matchingSchool) {
      // Transform to match expected structure
      return {
        id: matchingSchool.documentId,
        attributes: {
          Address: matchingSchool.Address,
          phone_number: matchingSchool.phone_number,
          coords: matchingSchool.coords,
          city: matchingSchool.city,
          state: matchingSchool.state,
          zip: matchingSchool.zip,
          locations: {
            data:
              matchingSchool.locations?.map(loc => ({
                id: loc.documentId,
                attributes: {
                  Name: loc.Name,
                },
              })) || [],
          },
        },
      };
    } else {
    }

    return null;
  } catch (error) {
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
        documentId
        city
        state
        schools {
          documentId
          Name
          school_locations {
            documentId
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

    const data = await response.json();

    if (data.errors) {
      // GraphQL errors found
      return [];
    }

    const schoolCities = data.data?.schoolCities || [];

    // Extract all school locations from all matching city records
    const allSchoolLocations = [];
    schoolCities.forEach(cityData => {
      cityData.schools?.forEach(school => {
        school.school_locations?.forEach(location => {
          allSchoolLocations.push({
            id: location.documentId,
            attributes: {
              Address: location.Address,
              phone_number: location.phone_number,
              city: location.city,
              state: location.state,
              zip: location.zip,
              coords: location.coords,
              locations: {
                data: [
                  {
                    id: school.documentId,
                    attributes: {
                      Name: school.Name,
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
