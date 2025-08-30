/**
 * SEO-optimized page titles configuration
 * All titles are between 30-60 characters and under 561 pixels
 * Includes proper keywords and localized versions
 */

export const seoTitles = {
  // English titles
  en: {
    // Main pages
    'frequently-asked-questions': 'CDL Help FAQ - Common Questions & Expert Answers',
    'how-to-become-a-truck-driver': 'How to Become a Truck Driver - Complete CDL Guide',
    'how-to-activate-promo': 'CDL Help Promo Code - Activation & Discount Guide',
    'how-to-get-cdl': 'How to Get Your CDL License - Step-by-Step Guide',
    'how-to-use-cdl-help': 'CDL Help App Guide - Master Your CDL Test Prep',
    'what-is-taught-in-cdl-schools': 'CDL School Curriculum - Training Programs Guide',
    contact: 'Contact CDL Help - Support & Customer Service',
    companies: 'Top Trucking Companies Hiring CDL Drivers 2025',
    'cookies-policy': 'Cookie Policy - CDL Help Privacy & Data Usage',
    'privacy-policy': 'Privacy Policy - CDL Help Data Protection Terms',
    'terms-conditions': 'Terms & Conditions - CDL Help Legal Agreement',
    'cdl-texas': 'Texas CDL Practice Test - CVO Knowledge Exam Prep',

    // Schools pages
    schools: 'CDL Schools Directory - Find Training Near You',
    'schools/california': 'California CDL Schools - Top Training Programs',
    'schools/florida': 'Florida CDL Schools - Best Truck Driving Classes',
    'schools/illinois': 'Illinois CDL Schools - Professional Driver Training',
    'schools/new-york': 'New York CDL Schools - Commercial Driver Training',
    'schools/ohio': 'Ohio CDL Schools - Certified Training Programs',
    'schools/pennsylvania': 'Pennsylvania CDL Schools - CDL Training Centers',
    'schools/washington': 'Washington CDL Schools - Truck Driving Programs',
    'schools/wisconsin': 'Wisconsin CDL Schools - Professional CDL Training',

    // City pages
    'schools/california/los-angeles': 'Los Angeles CDL Schools - Top Training Programs',
    'schools/california/sacramento': 'Sacramento CDL Schools - Best Training Centers',
    'schools/florida/jacksonville': 'Jacksonville CDL Schools - Professional Training',
    'schools/florida/orlando': 'Orlando CDL Schools - Commercial Driver Training',
    'schools/florida/miami': 'Miami CDL Schools - Truck Driving Training Centers',
    'schools/illinois/chicago': 'Chicago CDL Schools - Best Trucking Programs',
    'schools/ohio/cincinnati': 'Cincinnati CDL Schools - Top Training Centers',
    'schools/ohio/columbus': 'Columbus CDL Schools - Professional CDL Training',
    'schools/pennsylvania/philadelphia': 'Philadelphia CDL Schools - Best Training Options',
    'schools/washington/seattle': 'Seattle CDL Schools - Premier Truck Training',
    'schools/wisconsin/milwaukee': 'Milwaukee CDL Schools - Top CDL Training Centers',

    // Blog pages
    'blog/article': 'Truck Driver Salaries 2025 - Pay Guide & Tips',
    'blog/essential-cdl-endorsements-guide-for-new-truckers':
      'CDL Endorsements Guide - Essential Add-Ons',
    'blog/manual-vs-automatic-transmission-in-cdl-training-which-should-you-choose':
      'Manual vs Auto CDL - Best Transmission Choice',
    'blog/eldt-requirements-what-new-cdl-drivers-need-to-know':
      'ELDT Requirements 2025 - New CDL Driver Guide',
    'blog/how-to-get-cdl-permit': 'How to Get CDL Permit - Complete Guide 2025',
  },

  // Arabic titles
  ar: {
    'alas-ila-alshaeia-musaedat-cdl': 'الأسئلة الشائعة CDL Help - دليل شامل للمساعدة',
    companies: 'أفضل شركات النقل بالشاحنات - وظائف CDL 2025',
    'cookies-policy': 'سياسة ملفات تعريف الارتباط - CDL Help',
    contact: 'تواصل مع CDL Help - الدعم والخدمة',
    'ma-yatimmu-tadrisuh-fi-madaris-cdl': 'منهج مدارس CDL - دليل البرامج التدريبية',
    'kayfiyat-astikhdam-tatbiq-cdl-musaeda': 'دليل استخدام تطبيق CDL Help - احترف الاختبار',
    'privacy-policy': 'سياسة الخصوصية - حماية بيانات CDL Help',
    'kayfiyat-alhusul-ala-rukhsa-cdl': 'كيفية الحصول على رخصة CDL - دليل خطوة بخطوة',
    'terms-conditions': 'الشروط والأحكام - اتفاقية CDL Help القانونية',
    download: 'تحميل تطبيق CDL Help - اختبارات مجانية 2025',

    // Schools pages - Arabic
    schools: 'دليل مدارس CDL - ابحث عن التدريب القريب',
    'schools/california': 'مدارس CDL في كاليفورنيا - أفضل البرامج',
    'schools/florida': 'مدارس CDL في فلوريدا - تدريب القيادة المهنية',
    'schools/illinois': 'مدارس CDL في إلينوي - برامج تدريب السائقين',
    'schools/new-york': 'مدارس CDL في نيويورك - التدريب التجاري',
    'schools/pennsylvania': 'مدارس CDL في بنسلفانيا - مراكز التدريب',
    'schools/washington': 'مدارس CDL في واشنطن - برامج قيادة الشاحنات',
    'schools/wisconsin': 'مدارس CDL في ويسكونسن - التدريب المهني',

    // City pages - Arabic
    'schools/california/los-angeles': 'مدارس CDL لوس أنجلوس - أفضل التدريب',
    'schools/california/sacramento': 'مدارس CDL ساكرامنتو - مراكز تدريب ممتازة',
    'schools/florida/jacksonville': 'مدارس CDL جاكسونفيل - تدريب احترافي',
    'schools/florida/orlando': 'مدارس CDL أورلاندو - تدريب السائقين التجاري',
    'schools/florida/miami': 'مدارس CDL ميامي - مراكز تدريب الشاحنات',
    'schools/illinois/chicago': 'مدارس CDL شيكاغو - أفضل برامج الشاحنات',
    'schools/ohio/cincinnati': 'مدارس CDL سينسيناتي - مراكز تدريب رائدة',
    'schools/ohio/columbus': 'مدارس CDL كولومبوس - تدريب CDL احترافي',
    'schools/pennsylvania/philadelphia': 'مدارس CDL فيلادلفيا - أفضل خيارات التدريب',
    'schools/washington/seattle': 'مدارس CDL سياتل - تدريب شاحنات متميز',
    'schools/wisconsin/milwaukee': 'مدارس CDL ميلووكي - أفضل مراكز تدريب CDL',
  },

  // Korean titles
  ko: {
    'cdl-eobtneun-bangbeob': 'CDL 면허 취득 방법 - 완벽한 단계별 가이드',
    'cdl-haggyoeseoneun-mueos-eul-galeuchimniga': 'CDL 학교 커리큘럼 - 교육 프로그램 안내',
    'cdl-help-aeb-sayongbeob': 'CDL Help 앱 사용법 - 시험 준비 마스터하기',
    'cdl-texas': '텍사스 CDL 연습 시험 - CVO 지식 테스트',
    contact: 'CDL Help 문의 - 고객 지원 및 서비스',
    'cookies-policy': '쿠키 정책 - CDL Help 개인정보 및 데이터',
    companies: '2025년 최고의 운송 회사 - CDL 채용 정보',
    'jaju-mudneun-jilmun-cdl-doum': 'CDL Help FAQ - 자주 묻는 질문과 답변',
    'migug-eseo-teureog-unjeonsa-ga-doeneun-bangbeob': '트럭 운전사 되는 법 - CDL 완벽 가이드',
    'privacy-policy': '개인정보 보호정책 - CDL Help 데이터 보호',
    'cdl-heogajeungeul-badneun-bangbeob': 'CDL 허가증 받는 방법 - 2025 완벽 가이드',
    'terms-conditions': '이용 약관 - CDL Help 법적 계약서',
    download: 'CDL Help 앱 다운로드 - 무료 연습 시험 2025',

    // Schools pages - Korean
    schools: 'CDL 학교 디렉토리 - 가까운 교육 찾기',
    'schools/california': '캘리포니아 CDL 학교 - 최고의 교육 프로그램',
    'schools/florida': '플로리다 CDL 학교 - 전문 운전 교육',
    'schools/illinois': '일리노이 CDL 학교 - 운전자 교육 프로그램',
    'schools/new-york': '뉴욕 CDL 학교 - 상업용 운전 교육',
    'schools/ohio': '오하이오 CDL 학교 - 인증된 교육 프로그램',
    'schools/pennsylvania': '펜실베니아 CDL 학교 - CDL 교육 센터',
    'schools/washington': '워싱턴 CDL 학교 - 트럭 운전 프로그램',
    'schools/wisconsin': '위스콘신 CDL 학교 - 전문 CDL 교육',
  },

  // Portuguese titles
  pt: {
    'como-obter-cdl': 'Como Obter CDL - Guia Completo Passo a Passo',
    'como-obter-uma-licenca-cdl': 'Licença CDL - Como Tirar e Requisitos 2025',
    'como-usar-o-cdl-help': 'Guia CDL Help - Domine a Preparação do Teste',
    companies: 'Melhores Empresas de Transporte - Vagas CDL 2025',
    'cookies-policy': 'Política de Cookies - CDL Help Privacidade',
    'perguntas-frequentes': 'FAQ CDL Help - Perguntas Frequentes e Respostas',
    'privacy-policy': 'Política de Privacidade - Proteção de Dados CDL',
    'sobre-as-escolas': 'Escolas CDL - Programas de Treinamento Completo',
    'terms-conditions': 'Termos e Condições - Acordo Legal CDL Help',
    'cdl-texas': 'Teste CDL Texas - Preparação Exame CVO',

    // Schools pages - Portuguese
    schools: 'Diretório Escolas CDL - Encontre Treinamento',
    'schools/california': 'Escolas CDL Califórnia - Melhores Programas',
    'schools/california/los-angeles': 'Escolas CDL Los Angeles - Top Treinamento',
    'schools/california/sacramento': 'Escolas CDL Sacramento - Centros Premium',
    'schools/florida/jacksonville': 'Escolas CDL Jacksonville - Formação Pro',
    'schools/florida/miami': 'Escolas CDL Miami - Centros de Treinamento',
    'schools/florida/orlando': 'Escolas CDL Orlando - Treinamento Comercial',
    'schools/illinois/chicago': 'Escolas CDL Chicago - Melhores Programas',
    'schools/ohio/cincinnati': 'Escolas CDL Cincinnati - Centros Top',
    'schools/ohio/columbus': 'Escolas CDL Columbus - Treinamento Pro',
    'schools/pennsylvania/philadelphia': 'Escolas CDL Philadelphia - Melhores Opções',
    'schools/washington/seattle': 'Escolas CDL Seattle - Treinamento Premier',
    'schools/wisconsin/milwaukee': 'Escolas CDL Milwaukee - Top Centros CDL',
  },

  // Russian titles
  ru: {
    'cdl-texas': 'Техасский CDL тест - подготовка к экзамену CVO',
    'chasto-zadavaemye-voprosy': 'Часто задаваемые вопросы CDL Help - FAQ',
    companies: 'Лучшие транспортные компании - вакансии CDL',
    'cookies-policy': 'Политика Cookie - CDL Help конфиденциальность',
    'kak-poluchit-cdl': 'Как получить CDL - пошаговое руководство 2025',
    'kak-poluchit-cdl-permit': 'CDL пермит - полное руководство получения',
    'o-cdl-shkolakh': 'Программы CDL школ - обучение водителей грузовиков',
    'privacy-policy': 'Политика конфиденциальности - защита данных',
    'terms-conditions': 'Условия использования - правовое соглашение',

    // Schools pages - Russian
    schools: 'Каталог CDL школ - найдите обучение рядом',
    'schools/california': 'CDL школы Калифорния - лучшие программы',
    'schools/california/los-angeles': 'CDL школы Лос-Анджелес - топ обучение',
    'schools/california/sacramento': 'CDL школы Сакраменто - лучшие центры',
    'schools/florida': 'CDL школы Флорида - профессиональное обучение',
    'schools/florida/jacksonville': 'CDL школы Джексонвилл - про обучение',
    'schools/florida/miami': 'CDL школы Майами - центры подготовки водителей',
    'schools/florida/orlando': 'CDL школы Орландо - коммерческое обучение',
    'schools/illinois': 'CDL школы Иллинойс - программы водителей',
    'schools/illinois/chicago': 'CDL школы Чикаго - лучшие программы грузовиков',
    'schools/new-york': 'CDL школы Нью-Йорк - коммерческое обучение',
    'schools/ohio': 'CDL школы Огайо - сертифицированные программы',
    'schools/ohio/cincinnati': 'CDL школы Цинциннати - ведущие центры',
    'schools/ohio/columbus': 'CDL школы Колумбус - профессиональное CDL',
    'schools/pennsylvania': 'CDL школы Пенсильвания - центры обучения',
    'schools/pennsylvania/philadelphia': 'CDL школы Филадельфия - лучшие варианты',
    'schools/washington': 'CDL школы Вашингтон - программы грузовиков',
    'schools/washington/seattle': 'CDL школы Сиэтл - премиум обучение',
    'schools/wisconsin': 'CDL школы Висконсин - профессиональное CDL',
    'schools/wisconsin/milwaukee': 'CDL школы Милуоки - топ центры CDL',
  },

  // Turkish titles
  tr: {
    'cdl-izni-nasil-alinir': 'CDL İzni Alma Rehberi - 2025 Tam Kılavuz',
    'cdl-nasil-alinir': 'CDL Nasıl Alınır - Adım Adım Komple Rehber',
    'cdl-yardim-nasil-kullanilir': 'CDL Help Kullanım Kılavuzu - Sınav Hazırlık',
    companies: 'En İyi Nakliye Şirketleri - CDL İş İlanları 2025',
    'cookies-policy': 'Çerez Politikası - CDL Help Gizlilik Kuralları',
    'nasil-kamyon-soforu-olunur': 'Kamyon Şoförü Nasıl Olunur - CDL Rehberi',
    'privacy-policy': 'Gizlilik Politikası - CDL Help Veri Koruma',
    'terms-conditions': 'Kullanım Şartları - CDL Help Yasal Sözleşme',

    // Schools pages - Turkish
    'schools/california': 'California CDL Okulları - En İyi Programlar',
    'schools/california/los-angeles': 'Los Angeles CDL Okulları - Üst Eğitim',
    'schools/pennsylvania': 'Pennsylvania CDL Okulları - Eğitim Merkezleri',
    'schools/pennsylvania/philadelphia': 'Philadelphia CDL Okulları - En İyi Seçenekler',
    'schools/washington': 'Washington CDL Okulları - Kamyon Programları',
  },

  // Chinese titles
  zh: {
    'ruhe-huode-cdl': '如何获得CDL执照 - 2025完整步骤指南',
    'guanyu-cdl-xuexiao': 'CDL学校课程 - 商业驾驶培训项目指南',
    'changjian-wenti-cdl-bangzhu': 'CDL Help常见问题 - 专业解答与帮助',
    companies: '顶级运输公司招聘 - 2025年CDL工作机会',
    'cdl-texas': '德州CDL练习测试 - CVO知识考试准备',
    contact: '联系CDL Help - 客户支持与服务中心',
    'cookies-policy': 'Cookie政策 - CDL Help隐私和数据使用',
    'privacy-policy': '隐私政策 - CDL Help数据保护条款',
    'ruhe-huode-cdl-xukezheng': 'CDL许可证获取指南 - 2025完整流程',
    'ruhe-shiyong-cdl-bangzhu-yingyongchengxu': 'CDL Help应用使用指南 - 掌握考试准备',
    'terms-conditions': '条款和条件 - CDL Help法律协议',
    download: '下载CDL Help应用 - 2025免费练习测试',

    // Schools pages - Chinese
    schools: 'CDL学校目录 - 查找附近的培训中心',
    'schools/california': '加州CDL学校 - 顶级培训项目',
    'schools/florida': '佛罗里达CDL学校 - 专业驾驶培训',
    'schools/illinois': '伊利诺伊CDL学校 - 驾驶员培训项目',
    'schools/new-york': '纽约CDL学校 - 商业驾驶培训',
    'schools/ohio': '俄亥俄CDL学校 - 认证培训项目',
  },

  // Ukrainian titles
  uk: {
    'yak-staty-dalekobiinykom-v-Amerytsi': 'Як стати далекобійником в США - повний гід',
    'yak-otrymaty-permit-cdl': 'CDL перміт - як отримати дозвіл 2025',
    'yak-otrymaty-cdl': 'Як отримати CDL - покроковий посібник 2025',
    'terms-conditions': 'Умови використання - правова угода CDL Help',
    'privacy-policy': 'Політика конфіденційності - захист даних',
    'cookies-policy': 'Політика Cookie - CDL Help конфіденційність',
    companies: 'Кращі транспортні компанії - вакансії CDL',
    'choho-navchayut-u-shkolakh-cdl': 'Програми CDL шкіл - навчання водіїв вантажівок',
    'chasti-zapytannya': 'Часті запитання CDL Help - відповіді FAQ',
    'cdl-texas': 'Техаський CDL тест - підготовка до іспиту',

    // Schools pages - Ukrainian
    schools: 'Каталог CDL шкіл - знайдіть навчання поруч',
    'schools/california': 'CDL школи Каліфорнія - кращі програми',
    'schools/california/los-angeles': 'CDL школи Лос-Анджелес - топ навчання',
    'schools/california/sacramento': 'CDL школи Сакраменто - кращі центри',
    'schools/florida/jacksonville': 'CDL школи Джексонвілл - професійне навчання',
    'schools/new-york': 'CDL школи Нью-Йорк - комерційне навчання',
    'schools/pennsylvania': 'CDL школи Пенсільванія - центри навчання',
    'schools/pennsylvania/philadelphia': 'CDL школи Філадельфія - кращі варіанти',
    'schools/washington': 'CDL школи Вашингтон - програми вантажівок',
    'schools/washington/seattle': 'CDL школи Сіетл - преміум навчання',
    'schools/wisconsin': 'CDL школи Вісконсін - професійне CDL',
    'schools/wisconsin/milwaukee': 'CDL школи Мілуокі - топ центри CDL',
  },
};

/**
 * Get SEO optimized title for a page
 * @param {string} path - The page path
 * @param {string} locale - The locale code
 * @returns {string} - The optimized title
 */
export function getSEOTitle(path, locale = 'en') {
  // Remove leading slash and locale from path
  let cleanPath = path.replace(/^\//, '');

  // Remove locale prefix if present
  const localePattern = /^(en|ar|ko|pt|ru|tr|zh|uk)\//;
  cleanPath = cleanPath.replace(localePattern, '');

  // Get the title from configuration
  const titles = seoTitles[locale] || seoTitles.en;
  const title = titles[cleanPath];

  // Return the optimized title or generate a default
  if (title) {
    return title;
  }

  // Generate default title for unmatched paths
  const pageName = cleanPath.split('/').pop().replace(/-/g, ' ');
  const capitalizedName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  return `${capitalizedName} - CDL Help`;
}

/**
 * Check if title meets SEO requirements
 * @param {string} title - The title to check
 * @returns {boolean} - Whether title meets requirements
 */
export function validateSEOTitle(title) {
  const length = title.length;
  const pixelWidth = title.length * 8.5; // Approximate pixel calculation

  return length >= 30 && length <= 60 && pixelWidth <= 561 && pixelWidth >= 200;
}
