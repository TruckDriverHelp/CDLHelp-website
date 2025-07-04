import React from 'react';
import Link from '../../utils/ActiveLink';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const SecondaryNavbar = () => {
  // const { t } = useTranslation('navbar');
  const { locale } = useRouter();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 991);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) return null;

  // Links to be moved from resources dropdown
  const secondaryLinks = {
    en: [
      {
        title: 'How to become a Truck Driver in USA',
        slug: 'how-to-become-a-truck-driver',
      },
      {
        title: 'DOT Physical Lookup',
        slug: 'dot-physical-exam/search',
      },
      {
        title: 'Pre-Trip Inspection Guide',
        slug: 'pre-trip-inspection/guide',
      },
      {
        title: 'Frequently Asked Questions CDL help',
        slug: 'frequently-asked-questions',
      },
      {
        title: 'Road Signs Test',
        slug: 'road-signs/test',
      },
    ],
    ru: [
      {
        title: 'Как стать дальнобойщиком в США',
        slug: 'kak-stat-dalnoboishikom',
      },
      {
        title: 'Поиск DOT Physical',
        slug: 'dot-physical-exam/search',
      },
      {
        title: 'Руководство по Pre-Trip Inspection',
        slug: 'pre-trip-inspection/guide',
      },
      {
        title: 'Часто задаваемые вопросы',
        slug: 'chasto-zadavaemye-voprosy',
      },
      {
        title: 'Тест дорожных знаков',
        slug: 'road-signs/test',
      },
    ],
    uk: [
      {
        title: 'Як стати водієм вантажівки в США',
        slug: 'yak-staty-dalekobiinykom-v-Amerytsi',
      },
      {
        title: 'Пошук DOT Physical',
        slug: 'dot-physical-exam/search',
      },
      {
        title: 'Посібник з передрейсового огляду',
        slug: 'pre-trip-inspection/guide',
      },
      {
        title: 'CDL Help – Часті запитання',
        slug: 'chasti-zapytannya',
      },
      {
        title: 'Тест дорожніх знаків',
        slug: 'road-signs/test',
      },
    ],
    ar: [
      {
        title: 'كيف تصبح سائق شاحنة في الولايات المتحدة',
        slug: 'kayfa-tusbih-sayiq-shahinat-fi-alwilayat-almutahida',
      },
      {
        title: 'البحث عن DOT Physical',
        slug: 'dot-physical-exam/search',
      },
      {
        title: 'دليل فحص ما قبل الرحلة',
        slug: 'pre-trip-inspection/guide',
      },
      {
        title: 'الأسئلة الشائعة مساعدة CDL',
        slug: 'alas-ila-alshaeia-musaedat-cdl',
      },
      {
        title: 'اختبار علامات الطريق',
        slug: 'road-signs/test',
      },
    ],
    ko: [
      {
        title: '미국에서 트럭 운전사가 되는 방법',
        slug: 'migug-eseo-teureog-unjeonsa-ga-doeneun-bangbeob',
      },
      {
        title: 'DOT Physical 검색',
        slug: 'dot-physical-exam/search',
      },
      {
        title: '사전 여행 점검 가이드',
        slug: 'pre-trip-inspection/guide',
      },
      {
        title: '자주 묻는 질문 CDL 도움',
        slug: 'jaju-mudneun-jilmun-cdl-doum',
      },
      {
        title: '도로 표지판 테스트',
        slug: 'road-signs/test',
      },
    ],
    zh: [
      {
        title: '如何成为美国卡车司机',
        slug: 'ruhe-chengwei-meiguo-kache-siji',
      },
      {
        title: 'DOT体检查找',
        slug: 'dot-physical-exam/search',
      },
      {
        title: '行车前检查指南',
        slug: 'pre-trip-inspection/guide',
      },
      {
        title: '常见问题 CDL 帮助',
        slug: 'changjian-wenti-cdl-bangzhu',
      },
      {
        title: '道路标志测试',
        slug: 'road-signs/test',
      },
    ],
    tr: [
      {
        title: 'Nasıl kamyon şoförü olunur',
        slug: 'nasil-kamyon-soforu-olunur',
      },
      {
        title: 'DOT Physical Arama',
        slug: 'dot-physical-exam/search',
      },
      {
        title: 'Yolculuk Öncesi Kontrol Kılavuzu',
        slug: 'pre-trip-inspection/guide',
      },
      {
        title: 'Sıkça Sorulan Sorular CDL Help',
        slug: 'sikca-sorulan-sorular',
      },
      {
        title: 'Yol İşaretleri Testi',
        slug: 'road-signs/test',
      },
    ],
    pt: [
      {
        title: 'Como se tornar um motorista de caminhãoo',
        slug: 'como-se-tornar-motorista-de-caminhaoo',
      },
      {
        title: 'Busca DOT Physical',
        slug: 'dot-physical-exam/search',
      },
      {
        title: 'Guia de Inspeção Pré-Viagem',
        slug: 'pre-trip-inspection/guide',
      },
      {
        title: 'Perguntas Frequentes',
        slug: 'perguntas-frequentes',
      },
      {
        title: 'Teste de Sinais de Trânsito',
        slug: 'road-signs/test',
      },
    ],
  };

  const currentLinks = secondaryLinks[locale] || secondaryLinks['en'];

  // Split links into two rows
  const midPoint = Math.ceil(currentLinks.length / 2);
  const topRowLinks = currentLinks.slice(0, midPoint);
  const bottomRowLinks = currentLinks.slice(midPoint);

  return (
    <div className="secondary-navbar">
      <div className="container">
        <nav className="navbar navbar-expand-md navbar-light">
          <div className="navbar-nav mx-auto">
            {/* Top row */}
            <div className="nav-row top-row">
              {topRowLinks.map((link, index) => (
                <Link key={`top-${index}`} href={`/${link.slug}`} locale={locale}>
                  <a className="nav-link">{link.title}</a>
                </Link>
              ))}
            </div>
            {/* Bottom row */}
            <div className="nav-row bottom-row">
              {bottomRowLinks.map((link, index) => (
                <Link key={`bottom-${index}`} href={`/${link.slug}`} locale={locale}>
                  <a className="nav-link">{link.title}</a>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default SecondaryNavbar;
