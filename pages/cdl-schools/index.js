import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from 'next-i18next';

import Layout from "../../components/_App/Layout";
import Navbar from "../../components/_App/Navbar";
import Footer from "../../components/_App/Footer";
import PageBannerStyle1 from "../../components/Common/PageBannerStyle1";
import { StateSelector } from "../../src/widgets/StateSelector";
import { SEOHead } from "../../src/shared/ui/SEO";
import { useSEO } from "../../src/shared/lib/hooks/useSEO";
import getMeta from "../../lib/getMeta";

const SchoolsPage = ({ meta, states }) => {
  const { t } = useTranslation(['city-schools', 'common']);
  const seoData = useSEO({ 
    meta, 
    customUrl: "https://www.cdlhelp.com/cdl-schools",
    type: "article" 
  });

  return (
    <>
      <SEOHead {...seoData} />

      <Layout alternateLinks={{}} dir="ltr">
        <Navbar alternateLinks={{}} />

        <PageBannerStyle1
          pageTitle={t('homePageText')}
          homePageUrl="/"
          homePageText={t('common:home')}
          activePageText={t('homePageText')}
        />

        <div style={{ 
          backgroundColor: '#f8fafc', 
          minHeight: 'calc(100vh - 200px)',
          paddingBottom: '100px'
        }}>
          <div className="container">

            {/* States Section */}
            <div style={{ marginTop: '60px' }}>
              <StateSelector states={states} />
            </div>  
          </div>
        </div>

        <Footer />
      </Layout>
    </>
  );
};

export async function getStaticProps({ locale }) {
  try {
    // Импортируем функцию динамически для server-side
    const { fetchStatesWithSchoolCounts } = await import("../../src/entities/School/api/schoolApi");
    
    const [meta, states] = await Promise.all([
      getMeta(locale || 'en', "general"),
      fetchStatesWithSchoolCounts()
    ]);

    return {
      props: {
        meta,
        states,
        ...(await serverSideTranslations(locale ?? 'en', [
          'navbar',
          'footer',
          'common',
          'city-schools'
        ])),
      },
      revalidate: 300, // Revalidate every 5 minutes
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    
    // Fallback к моковым данным в случае ошибки
    const meta = await getMeta(locale || 'en', "general");
    
    return {
      props: {
        meta,
        states: [],
        ...(await serverSideTranslations(locale ?? 'en', [
          'navbar',
          'footer',
          'common',
          'city-schools'
        ])),
      },
      revalidate: 300,
    };
  }
}

export default SchoolsPage; 