import { useState, useEffect, useCallback } from 'react';
import {
  SchoolLocation,
  fetchSupabaseSchools,
  fetchSchoolsByState,
  SupabaseSchoolData,
} from '../../../entities/School';

interface UseSchoolsOptions {
  state?: string;
  autoFetch?: boolean;
}

interface UseSchoolsReturn {
  schools: SchoolLocation[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSchools = (options: UseSchoolsOptions = {}): UseSchoolsReturn => {
  const { state, autoFetch = true } = options;
  const [schools, setSchools] = useState<SchoolLocation[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchSchools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (state) {
        // Get schools by state from Strapi
        const data = await fetchSchoolsByState(state);
        setSchools(data);
      } else {
        // Get all schools from Supabase (legacy)
        const supabaseData = await fetchSupabaseSchools();

        // Transform Supabase data to SchoolLocation format
        const transformedSchools: SchoolLocation[] = supabaseData.map(
          (item: SupabaseSchoolData) => ({
            id: item.id,
            attributes: {
              Address: item.locations?.address_street || '',
              phone_number: item.phone_number || '',
              city: item.locations?.address_city || '',
              state: item.locations?.address_state || '',
              location: {
                data: {
                  attributes: {
                    Name: item.schools?.school_name || 'CDL School',
                  },
                },
              },
            },
          })
        );

        setSchools(transformedSchools);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch schools';
      setError(errorMessage);
      // Error fetching schools
    } finally {
      setLoading(false);
    }
  }, [state]);

  useEffect(() => {
    if (autoFetch) {
      fetchSchools();
    }
  }, [state, autoFetch, fetchSchools]);

  return {
    schools,
    loading,
    error,
    refetch: fetchSchools,
  };
};
