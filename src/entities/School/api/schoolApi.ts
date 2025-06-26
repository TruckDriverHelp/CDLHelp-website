import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { SchoolLocation, SupabaseSchoolData } from '../model/types';

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

    const response = await fetch(`http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_KEY}`,
      },
      body: JSON.stringify({ 
        query,
        variables: { state }
      }),
    });

    const { data } = await response.json();
    return data?.schoolLocations?.data || [];
  } catch (error) {
    console.error('Error fetching schools by state:', error);
    throw new Error('Failed to fetch schools');
  }
};

// Supabase API для школ (legacy)
export const fetchSupabaseSchools = async (): Promise<SupabaseSchoolData[]> => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials are missing');
    return [];
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    const { data, error } = await supabase
      .from('phonenumbers')
      .select('*, schools(school_name), locations(address_street, address_city, address_state, address_zip)');
    
    if (error) {
      console.error('Data fetch error:', error);
      throw new Error('Failed to fetch schools from Supabase');
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching Supabase schools:', error);
    throw new Error('Failed to fetch schools from Supabase');
  }
};

// Получение всех школ (GraphQL API)
export const fetchAllSchools = async (): Promise<SchoolLocation[]> => {
  try {
    const query = `
      query GetAllSchoolLocations {
        schoolLocations {
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

    const response = await fetch(`http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_KEY}`,
      },
      body: JSON.stringify({ query }),
    });

    const { data } = await response.json();
    return data?.schoolLocations?.data || [];
  } catch (error) {
    console.error('Error fetching all schools:', error);
    // Возвращаем пустой массив вместо выброса ошибки для graceful fallback
    return [];
  }
};

// Получение уникальных штатов с количеством школ
export const fetchStatesWithSchoolCounts = async (): Promise<Array<{slug: string, name: string, schoolCount: number}>> => {
  try {
    const query = `
      query GetStatesWithCounts {
        schoolLocations {
          data {
            attributes {
              state
              city
            }
          }
        }
      }
    `;

    const response = await fetch(`http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_KEY}`,
      },
      body: JSON.stringify({ query }),
    });

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
      schoolCount: count
    }));

    return states.sort((a, b) => b.schoolCount - a.schoolCount); // Сортируем по количеству школ
  } catch (error) {
    console.error('Error fetching states with school counts:', error);
    return [];
  }
}; 