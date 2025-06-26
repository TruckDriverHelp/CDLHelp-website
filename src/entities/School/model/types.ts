export interface SchoolLocation {
  id: number;
  attributes: {
    Address: string;
    phone_number: string;
    coords?: {
      latitude: string | number;
      longitude: string | number;
    };
    city: string;
    state: string;
    zip?: string;
    locations?: {
      data?: Array<{
        id: number;
        attributes: {
          Name: string;
        };
      }>;
    };
  };
}

export interface School {
  id: number;
  school_name: string;
  locations: SchoolLocation[];
}

export interface SupabaseSchoolData {
  id: number;
  phone_number: string;
  schools: {
    school_name: string;
  };
  locations: {
    address_street: string;
    address_city: string;
    address_state: string;
    address_zip: string;
  };
}

export interface SchoolCardProps {
  schoolLocation: SchoolLocation;
  className?: string;
}

export interface SchoolListProps {
  schools: SchoolLocation[];
  loading?: boolean;
  error?: string | null;
} 