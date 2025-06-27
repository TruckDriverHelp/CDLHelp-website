import React from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { SchoolCardProps } from '../model/types';
import { formatPhoneNumber } from '../../../shared/lib/utils/formatters';

const SchoolMap = dynamic(() => import('../../../shared/ui/Map/SchoolMap'), {
    ssr: false,
});

export const SchoolCard: React.FC<SchoolCardProps> = ({ schoolLocation, className = '' }) => {
  const { t } = useTranslation('city-schools');
  
  const {
    Address,
    phone_number,
    coords,
    city,
    state,
    locations,
  } = schoolLocation.attributes;

  const lat = coords?.latitude;
  const lon = coords?.longitude;

  const stateFormatted = state ? state.replace(/_/g, ' ') : '';
  const cityFormatted = city ? city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '';
  const phoneFormatted = formatPhoneNumber(phone_number);
  
  // Получаем имя школы из массива locations
  const schoolName = locations?.data?.[0]?.attributes?.Name || 'CDL School';

  const [isHovered, setIsHovered] = React.useState(false);

  const cardStyle: React.CSSProperties = {
    border: '1px solid #e1e5e9',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: '#fff',
    boxShadow: isHovered ? '0 12px 32px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    height: 'fit-content'
  };

  const mapStyle: React.CSSProperties = {
    width: '100%',
    height: '180px',
    borderRadius: '12px',
    overflow: 'hidden'
  };

  const placeholderStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#aaa',
    borderRadius: '6px'
  };

  const contentStyle: React.CSSProperties = {
    flexGrow: 1
  };

  const headerStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '18px',
    color: '#1a1a1a',
    fontWeight: 600,
    lineHeight: '1.3'
  };

  const bodyStyle: React.CSSProperties = {
    margin: 0
  };

  const textStyle: React.CSSProperties = {
    margin: '8px 0',
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.4'
  };

  const phoneStyle: React.CSSProperties = {
    margin: '12px 0',
    fontSize: '16px',
    color: '#3c3d78',
    lineHeight: '1.4',
    fontWeight: 500
  };

  return (
    <div 
      className={className} 
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={mapStyle}>
        {lat && lon ? (
            <SchoolMap lat={parseFloat(String(lat))} lon={parseFloat(String(lon))} />
        ) : (
          <div style={placeholderStyle}>
            <p>{t('mapNotAvailable')}</p>
          </div>
        )}
      </div>
      <div style={contentStyle}>
        <div>
          <h3 style={headerStyle}>{schoolName}</h3>
        </div>
        <div style={bodyStyle}>
            <p style={textStyle}>{cityFormatted}, {stateFormatted}</p>
            {phoneFormatted && (
              <a 
                href={`tel:${phone_number}`} 
                style={phoneStyle}
                title="Call this number"
              >
                {phoneFormatted}
              </a>
            )}
        </div>
      </div>
    </div>
  );
}; 