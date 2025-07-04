// Маппинг названий штатов
export const stateNameMapping: Record<string, string> = {
  alabama: 'Alabama',
  alaska: 'Alaska',
  arizona: 'Arizona',
  arkansas: 'Arkansas',
  california: 'California',
  colorado: 'Colorado',
  connecticut: 'Connecticut',
  delaware: 'Delaware',
  florida: 'Florida',
  georgia: 'Georgia',
  hawaii: 'Hawaii',
  idaho: 'Idaho',
  illinois: 'Illinois',
  indiana: 'Indiana',
  iowa: 'Iowa',
  kansas: 'Kansas',
  kentucky: 'Kentucky',
  louisiana: 'Louisiana',
  maine: 'Maine',
  maryland: 'Maryland',
  massachusetts: 'Massachusetts',
  michigan: 'Michigan',
  minnesota: 'Minnesota',
  mississippi: 'Mississippi',
  missouri: 'Missouri',
  montana: 'Montana',
  nebraska: 'Nebraska',
  nevada: 'Nevada',
  'new hampshire': 'New Hampshire',
  'new jersey': 'New Jersey',
  'new mexico': 'New Mexico',
  'new york': 'New York',
  'north carolina': 'North Carolina',
  'north dakota': 'North Dakota',
  ohio: 'Ohio',
  oklahoma: 'Oklahoma',
  oregon: 'Oregon',
  pennsylvania: 'Pennsylvania',
  'rhode island': 'Rhode Island',
  'south carolina': 'South Carolina',
  'south dakota': 'South Dakota',
  tennessee: 'Tennessee',
  texas: 'Texas',
  utah: 'Utah',
  vermont: 'Vermont',
  virginia: 'Virginia',
  washington: 'Washington',
  'west virginia': 'West Virginia',
  wisconsin: 'Wisconsin',
  wyoming: 'Wyoming',
};

// Форматирование названия штата из slug
export const formatStateName = (stateSlug: string): string => {
  const normalizedSlug = stateSlug.replace(/-/g, ' ').toLowerCase();
  return (
    stateNameMapping[normalizedSlug] ||
    stateSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  );
};

// Капитализация слов
export const capitalizeWords = (str: string): string =>
  str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

// Форматирование зарплаты
export const formatPayRate = (rate: string | null | undefined): string | null => {
  if (!rate) return null;
  return rate.replace('_', ' ').toLowerCase();
};

// Форматирование состояния (штата) с заменой подчеркиваний
export const formatStateDisplay = (state: string | undefined): string => {
  if (!state) return '';
  return state.replace(/_/g, ' ');
};

// Форматирование номера телефона
export const formatPhoneNumber = (phone: string | undefined): string => {
  if (!phone) return '';

  // Убираем все нецифровые символы
  const cleaned = phone.replace(/\D/g, '');

  // Форматируем как (XXX) XXX-XXXX если 10 цифр
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  // Форматируем как +X (XXX) XXX-XXXX если 11 цифр и начинается с 1
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  // Возвращаем как есть если не подходит под стандартные форматы
  return phone;
};
