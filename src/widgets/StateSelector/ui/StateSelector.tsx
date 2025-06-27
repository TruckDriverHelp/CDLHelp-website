import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

export interface State {
  slug: string;
  name: string;
  schoolCount?: number;
  cities?: Array<{
    name: string;
    slug: string;
    schoolCount: number;
  }>;
}

export interface StateSelectorProps {
  states: State[];
  className?: string;
}

export const StateSelector: React.FC<StateSelectorProps> = ({ states, className = '' }) => {
  const { t } = useTranslation('city-schools');

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e1e5e9',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  };

  const linkStyle: React.CSSProperties = {
    textDecoration: 'none',
    textAlign: 'center',
    color: '#1f2937',
    fontWeight: '600',
    fontSize: '16px'
  };

  const countStyle: React.CSSProperties = {
    backgroundColor: '#3c3d78',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600'
  };

  return (
    <div className={className}>
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '600',
          color: '#1a1a1a',
          marginBottom: '12px'
        }}>
          {t('selectState')}
        </h2>
        <p style={{
          color: '#6b7280',
          fontSize: '1rem'
        }}>
          {t('selectStateDescription')}
        </p>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {states.map((state) => (
          <Link key={state.slug} href={`/cdl-schools/${state.slug}`}>
            <div 
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              }}
            >
              <span style={linkStyle}>
                {state.name}
              </span>
                <span style={countStyle}>
                  {state.schoolCount}
                </span>
            </div>
          </Link>
        ))}
      </div>
      
      {states.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#666',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <p>{t('noStatesAvailable', 'Штаты временно недоступны')}</p>
        </div>
      )}
    </div>
  );
}; 