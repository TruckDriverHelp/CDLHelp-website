import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

interface SearchFormProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchForm: React.FC<SearchFormProps> = ({ 
  onSearch, 
  placeholder,
  className = '' 
}) => {
  const { t } = useTranslation('city-schools');
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        maxWidth: '500px'
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder || t('searchPlaceholder', 'Поиск школ по названию или городу...')}
            style={{
              width: '100%',
              padding: '12px 16px',
              paddingRight: query ? '40px' : '16px',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e9ecef';
            }}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#6c757d',
                padding: '4px'
              }}
            >
              ✕
            </button>
          )}
        </div>
        <button
          type="submit"
          style={{
            padding: '12px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0056b3';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#007bff';
          }}
        >
          🔍 {t('search', 'Поиск')}
        </button>
      </div>
    </form>
  );
}; 