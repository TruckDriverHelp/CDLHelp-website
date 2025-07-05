import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
const FaqSection = () => {
  const { t } = useTranslation('index');
  const { locale } = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    if (!userInteracted) {
      intervalRef.current = setInterval(() => {
        setActiveIndex(current => (current + 1) % 4);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [userInteracted]);

  const toggleAccordion = index => {
    setUserInteracted(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqSlugs = {
    en: 'frequently-asked-questions/',
    ar: 'alas-ila-alshaeia-musaedat-cdl',
    ru: 'chasto-zadavaemye-voprosy',
    uk: 'chasti-zapytannya',
    zh: 'changjian-wenti-cdl-bangzhu',
    ko: 'jaju-mudneun-jilmun-cdl-doum',
    tr: 'sikca-sorulan-sorular',
    pt: 'perguntas-frequentes',
  };

  return (
    <>
      <div className="pt-100 pb-75">
        <div className="container text-center">
          <div style={{ marginBottom: 20 }}>
            <h2>{t('faq.title')}</h2>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="accordion">
                {[
                  // {
                  //     question: t('faq.costQuestion'),
                  //     answer: (
                  //         <>
                  //             <span>{t('faq.costAnswer')}</span>
                  //             <div className='faq-link' style={{margin: "15px 0"}}>
                  //                 <a href="#">{t('faq.readMore')}</a>
                  //             </div>
                  //         </>
                  //     )
                  // },
                  // {
                  //     question: "Can I take the CDL exam in Russian?",
                  //     answer: (
                  //         <>
                  //             <span>In some states, the DMV officially indicates that the written test can be taken in Russian. For example:</span>
                  //             <div>
                  //                 <ul>
                  //                     <li>- New York (NY)</li>
                  //                     <li>- California (CA)</li>
                  //                     <li>- Wisconsin (WI)</li>
                  //                     <li>- Pennsylvania (PA)</li>
                  //                     <li>- Washington (WA)</li>
                  //                 </ul>
                  //             </div>
                  //             <div className='faq-link' style={{margin: "15px 0"}}>
                  //                 <a href="#">Read more...</a>
                  //             </div>
                  //         </>
                  //     )
                  // },
                  {
                    question: t('faq.questionsCountQuestion'),
                    answer: (
                      <>
                        <span>{t('faq.questionsCountAnswer')}</span>
                        <div className="faq-link" style={{ margin: '15px 0' }}>
                          <Link href={`/${locale}/${faqSlugs[locale]}`}>
                            <a>{t('faq.readMore')}</a>
                          </Link>
                        </div>
                      </>
                    ),
                  },
                  {
                    question: t('faq.mistakesQuestion'),
                    answer: (
                      <>
                        <div>
                          <span>{t('faq.mistakesAnswer')}</span>
                        </div>
                        <div className="faq-link" style={{ margin: '15px 0' }}>
                          <Link href={`/${locale}/${faqSlugs[locale]}`}>
                            <a>{t('faq.readMore')}</a>
                          </Link>
                        </div>
                      </>
                    ),
                  },
                ].map((faq, index) => (
                  <div key={index} className="faq-item">
                    <div
                      className={`faq-link ${activeIndex === index ? 'active' : ''}`}
                      onClick={() => toggleAccordion(index)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span>{faq.question}</span>
                      <svg
                        className={`arrow-icon ${activeIndex === index ? 'active' : ''}`}
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 10L12 15L17 10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      className={`faq-answer ${activeIndex === index ? 'show' : ''}`}
                      style={{
                        maxHeight: activeIndex === index ? '2000px' : '0',
                        overflow: 'hidden',
                        transition:
                          activeIndex === index
                            ? 'max-height 0.6s ease-in-out'
                            : 'max-height 0.3s cubic-bezier(0, 1, 0, 1)',
                      }}
                    >
                      {faq.answer}
                    </div>
                  </div>
                ))}

                <div
                  style={{
                    border: 'none',
                    background: 'none',
                    color: '#5a5886',
                    padding: '12px 25px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    textDecoration: 'underline',
                  }}
                >
                  <Link href={`/${locale}/${faqSlugs[locale]}`}>
                    <a>{t('faq.title')}</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FaqSection;
