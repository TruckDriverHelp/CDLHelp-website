import React from 'react';
import { useTranslation } from 'next-i18next';
import { SchoolCard, SchoolListProps } from '../../../entities/School';

export const SchoolList: React.FC<SchoolListProps> = ({ 
  schools, 
  loading = false, 
  error = null 
}) => {
  const { t } = useTranslation('city-schools');

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 20px',
        color: '#666'
      }}>
        <p>{t('loading', 'Loading schools...')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        background: '#fff3cd',
        borderRadius: '8px',
        border: '1px solid #ffeaa7',
        color: '#856404'
      }}>
        <h3>{t('errorTitle', 'Error loading schools')}</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (schools.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        background: '#f8f9fa',
        borderRadius: '8px',
        color: '#666'
      }}>
        <h3>{t('noSchoolsTitle', 'No schools found')}</h3>
        <p>{t('noSchoolsText', 'No CDL schools available in this area.')}</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px 0'
    }}>
      {schools.map(school => (
        <SchoolCard key={school.id} schoolLocation={school} />
      ))}
    </div>
  );
}; 