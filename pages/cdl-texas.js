import React from 'react';
import PageBannerStyle1 from '../components/Common/PageBannerStyle1';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CVOCard from '../components/Article/texasCVOcard';
import fetchCVOCards from '../lib/TexasCVO/fetchCVOCards';
import Layout from '../components/_App/Layout';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import fetchText from '../lib/TexasCVO/fetchText';
import Navbar from '../components/_App/Navbar';
import Footer from '../components/_App/Footer';
import getMeta from '../lib/getMeta';
import { SEOHead } from '../src/shared/ui/SEO';
import { SchemaBuilder } from '../src/shared/ui/SEO/schemas';
import { StructuredData } from '../src/shared/ui/SEO/StructuredData';

const CDLtexas = ({ text, cards, locale, alternateLinks, meta }) => {
  // Build comprehensive schemas for Texas CDL page
  const schemas = new SchemaBuilder(locale)
    .addOrganization({
      description: 'CDL Help - Free CDL practice tests and Texas CDL resources',
    })
    .addWebsite({
      description: 'Texas CDL information and CVO knowledge test preparation',
    })
    .addBreadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Texas CDL', url: '/cdl-texas' },
    ])
    .addArticle({
      title: meta.title || 'Texas CDL CVO Knowledge Test',
      description:
        meta.description ||
        'Complete guide to Texas Commercial Vehicle Operation (CVO) knowledge test preparation',
      content: text,
      author: 'CDL Help Editorial Team',
      datePublished: '2023-01-01',
      dateModified: new Date().toISOString(),
      image: 'http://localhost:3001/images/texas-cdl-og.jpg',
      url: `https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/cdl-texas`,
      keywords: [
        'Texas CDL',
        'CVO test',
        'Commercial Vehicle Operation',
        'Texas trucking',
        'CDL exam',
      ],
      articleSection: 'State CDL Guides',
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.article-content', 'h1', 'h2', '.cvo-card'],
        xpath: ['/html/head/title', '/html/head/meta[@name="description"]/@content'],
      },
      inLanguage: locale,
    })
    .addFAQ({
      questions: cards.slice(0, 10).map(card => ({
        question: card.questionEn || card.questionLang || 'Question',
        answer: card.answerEn || card.answerLang || 'Answer',
      })),
    })
    .addCourse({
      name: 'Texas CVO Knowledge Test Preparation',
      description:
        'Comprehensive preparation for Texas Commercial Vehicle Operation knowledge test',
      teaches: [
        'Texas CDL regulations',
        'Commercial vehicle operation',
        'Texas traffic laws',
        'Safety regulations',
        'Weight and size limits',
        'Hazardous materials',
      ],
      educationalLevel: 'Professional Certification',
      educationalCredentialAwarded: 'Texas CDL License',
    })
    .build();

  return (
    <>
      <SEOHead
        title={meta.title}
        description={meta.description}
        alternateLinks={alternateLinks}
        url={`https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/cdl-texas`}
      />

      {/* Structured Data Schemas */}
      <StructuredData data={schemas} />

      <Layout>
        <Navbar alternateLinks={alternateLinks} />

        <PageBannerStyle1
          pageTitle={meta.title}
          homePageUrl="/"
          homePageText="Main Page"
          activePageText="Texas CVO Knowledge"
        />

        <div className="blog-details-area ptb-75">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-md-12">
                <div className="blog-details-desc">
                  <div id="texas-cvo-text" className="article-content">
                    <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>

                    {cards.map((card, index) => (
                      <CVOCard
                        key={index}
                        locale={locale}
                        questionEn={card.questionEn}
                        answerEn={card.answerEn}
                        questionLang={card.questionLang}
                        answerLang={card.answerLang}
                      />
                    ))}
                  </div>

                  {/* <div className="article-footer">
										<div className="post-author-meta">
											<div className="d-flex align-items-center">
												<img src="/images/logo-adaptive.png" alt="user" />
												<div className="title">
													<span className="name">Автор TruckDirver.help</span>
													<span className="date">10 Ноябрь, 2023</span>
												</div>
											</div>
										</div>
									</div> */}
                </div>
              </div>

              {/* <div className="col-lg-4 col-md-12">
								<div className="right-sidebar">
									<BlogSidebar />
								</div>
							</div> */}
            </div>
          </div>
        </div>
        <Footer />
      </Layout>
    </>
  );
};

export default CDLtexas;

export async function getStaticProps({ locale }) {
  const cards = (await fetchCVOCards(locale)) || [];
  const text = (await fetchText(locale)) || '';

  const alternateLinks = {
    en: '/cdl-texas',
    ar: '/ar/cdl-texas',
    ru: '/ru/cdl-texas',
    uk: '/uk/cdl-texas',
    zh: '/zh/cdl-texas',
    ko: '/ko/cdl-texas',
    tr: '/tr/cdl-texas',
    pt: '/pt/cdl-texas',
  };

  const meta = await getMeta(locale, 'texas');

  return {
    props: {
      text,
      cards,
      locale: locale,
      alternateLinks: alternateLinks,
      meta: meta,
      ...(await serverSideTranslations(locale ?? 'en', ['navbar', 'footer', 'cookie'])),
    },
  };
}
