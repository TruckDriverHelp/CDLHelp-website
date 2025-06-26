export { SchoolCard } from './ui/SchoolCard';
export { 
  fetchSchoolsByState, 
  fetchSupabaseSchools, 
  fetchAllSchools 
} from './api/schoolApi';
export type { 
  School, 
  SchoolLocation, 
  SchoolCardProps, 
  SchoolListProps,
  SupabaseSchoolData 
} from './model/types'; 