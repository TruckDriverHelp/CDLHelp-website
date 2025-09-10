import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '../../components/_App/Layout';
import Navbar from '../../components/_App/Navbar';
import Footer from '../../components/_App/Footer';
import RelatedLinks from '../../components/Common/RelatedLinks';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SEOHead } from '../../src/shared/ui/SEO';
import { SchemaBuilder } from '../../src/shared/ui/SEO/schemas';
import { StructuredData } from '../../src/shared/ui/SEO/StructuredData';
import { useSEO } from '../../src/shared/lib/hooks/useSEO';
// import { Grid } from "react-loader-spinner";

const SignsTest = () => {
  const [signs, setSigns] = useState([]);
  const { locale } = useRouter();
  const { t } = useTranslation(['common', 'navbar', 'footer']);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [options, setOptions] = useState([]);
  const [showTranslated, setShowTranslated] = useState(false);
  const [optionPairs, setOptionPairs] = useState([]);

  // Helper function to get the Strapi host URL
  const getStrapiHost = () => {
    // In production, we use the internal IP directly
    return 'http://146.190.47.164:1337';
  };

  const seoData = useSEO({
    meta: {
      title: t('roadSignsTestTitle', 'CDL Road Signs Practice Test - Free Online Quiz | CDL Help'),
      description: t(
        'roadSignsTestDescription',
        'Practice CDL road signs test online. Master traffic signs, warning signs, and regulatory signs required for your Commercial Driver License exam.'
      ),
    },
    customUrl: `https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/road-signs/test`,
    type: 'website',
  });

  // Build comprehensive schemas for quiz page
  const schemas = new SchemaBuilder(locale)
    .addOrganization({
      description: 'CDL Help - Free CDL practice tests and road signs quiz',
    })
    .addWebsite({
      description: 'Practice CDL road signs test online',
    })
    .addBreadcrumb([
      { name: t('common:home', 'Home'), url: '/' },
      { name: t('roadSigns', 'Road Signs'), url: '/road-signs' },
      { name: t('roadSignsQuiz', 'Road Signs Test'), url: '/road-signs/test' },
    ])
    .addQuiz({
      name: t('roadSignsQuiz', 'CDL Road Signs Practice Test'),
      description: t(
        'roadSignsQuizDescription',
        'Test your knowledge of road signs required for the CDL exam. Practice identifying and understanding traffic signs, warning signs, and regulatory signs.'
      ),
      url: `https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/road-signs/test`,
      questionCount: signs.length || 50,
      quizType: 'Road Signs',
      educationalLevel: 'Beginner',
      timeRequired: 'PT30M',
      passingScore: 80,
      questions: signs.slice(0, 3).map(sign => ({
        question: `What does this road sign mean?`,
        correctAnswer: sign?.attributes?.original_name || '',
        options: [
          sign?.attributes?.original_name || '',
          'Other option 1',
          'Other option 2',
          'Other option 3',
        ],
      })),
    })
    .addCourse({
      name: 'CDL Road Signs Training',
      description: 'Complete road signs training for CDL exam preparation',
      teaches: [
        'Warning Signs',
        'Regulatory Signs',
        'Guide Signs',
        'Construction Signs',
        'Railroad Signs',
        'School Zone Signs',
      ],
      educationalLevel: 'Professional Certification',
    })
    .build();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use our API route that handles authentication server-side
        const response = await fetch(`/api/road-signs?locale=${locale}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.data && Array.isArray(result.data)) {
          // Transform Strapi v5 flat structure to match expected format
          const transformedSigns = result.data.map(sign => ({
            id: sign.documentId,
            attributes: {
              original_name: sign.original_name,
              translated_name: sign.translated_name || sign.original_name, // Fallback to original if no translation
              Sign: {
                data: sign.Sign
                  ? {
                      attributes: {
                        url: sign.Sign.url,
                        alternativeText: sign.Sign.alternativeText,
                      },
                    }
                  : null,
              },
            },
          }));

          setSigns(transformedSigns);
        } else {
          setSigns([]);
        }
      } catch (error) {
        setSigns([]);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchData();
  }, [locale]);

  // Seeded pseudo-random number generator for consistent shuffling
  const seededRandom = seed => {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const generateOptions = useCallback(() => {
    if (!signs || signs.length === 0) return;

    const currentSign = signs[currentQuestionIndex];
    if (!currentSign || !currentSign.attributes) return;

    // Use question index as seed for consistent shuffling
    const seed = currentQuestionIndex + 12345;

    // Get 3 random wrong answers with both original and translated versions
    const wrongAnswers = signs
      .filter(sign => sign.id !== currentSign.id)
      .sort((a, b) => {
        const seedA = parseInt(a.id?.replace(/\D/g, '') || '0') + seed;
        const seedB = parseInt(b.id?.replace(/\D/g, '') || '0') + seed;
        return seededRandom(seedA) - seededRandom(seedB);
      })
      .slice(0, 3)
      .map(sign => ({
        original: sign.attributes.original_name,
        translated: sign.attributes.translated_name,
      }));

    // Add the correct answer
    const correctAnswer = {
      original: currentSign.attributes.original_name,
      translated: currentSign.attributes.translated_name,
    };

    // Combine and shuffle all options ONCE per question using seeded random
    const allOptionPairs = [...wrongAnswers, correctAnswer].sort((a, b) => {
      const seedA = (a.original?.charCodeAt(0) || 0) + seed;
      const seedB = (b.original?.charCodeAt(0) || 0) + seed;
      return seededRandom(seedA) - seededRandom(seedB);
    });

    setOptionPairs(allOptionPairs);
    // Set initial options based on current translation state
    setOptions(allOptionPairs.map(pair => (showTranslated ? pair.translated : pair.original)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signs, currentQuestionIndex]);

  useEffect(() => {
    if (signs && signs.length > 0) {
      generateOptions();
    }
  }, [currentQuestionIndex, signs, generateOptions]);

  // Update options when translation is toggled, without reshuffling
  useEffect(() => {
    if (optionPairs.length > 0) {
      setOptions(optionPairs.map(pair => (showTranslated ? pair.translated : pair.original)));
    }
  }, [showTranslated, optionPairs]);

  const handleAnswer = selectedAnswer => {
    const currentSign = signs[currentQuestionIndex];
    const correctAnswer = showTranslated
      ? currentSign.attributes.translated_name
      : currentSign.attributes.original_name;

    const isAnswerCorrect = selectedAnswer === correctAnswer;

    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    if (isAnswerCorrect) {
      setScore(prev => prev + 1);
    }

    // Move to next question after 1.5 seconds
    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestionIndex < signs.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 1500);
  };

  const toggleTranslation = () => {
    setShowTranslated(!showTranslated);
    // Options will be updated automatically by the useEffect
  };

  // if (!isLoaded) {
  //   return (
  //     <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
  //       <Grid color="#4d2bac82" height={80} width={80} />
  //     </div>
  //   );
  // }

  if (!isLoaded) {
    return (
      <Layout>
        <SEOHead {...seoData} />
        <Navbar />
        <div className="features-area ptb-100 bg-F7F7FF">
          <div className="container">
            <div className="text-center">
              <h1 style={{ fontSize: '2rem' }}>
                {t('roadSignsQuiz', { defaultValue: 'Road Signs Quiz' })}
              </h1>
              <h2>{t('loading', { defaultValue: 'Loading...' })}</h2>
            </div>
          </div>
        </div>
        <Footer />
      </Layout>
    );
  }

  if (!signs || signs.length === 0) {
    return (
      <Layout>
        <SEOHead {...seoData} />
        <Navbar />
        <div className="features-area ptb-100 bg-F7F7FF">
          <div className="container">
            <div className="text-center">
              <h1 style={{ fontSize: '2rem' }}>
                {t('roadSignsQuiz', { defaultValue: 'Road Signs Quiz' })}
              </h1>
              <h2>{t('noSignsAvailable', { defaultValue: 'No signs available' })}</h2>
            </div>
          </div>
        </div>
        <Footer />
      </Layout>
    );
  }

  const currentSign = signs[currentQuestionIndex];
  if (!currentSign) {
    return (
      <Layout>
        <SEOHead {...seoData} />
        <Navbar />
        <div className="features-area ptb-100 bg-F7F7FF">
          <div className="container">
            <div className="text-center">
              <h1 style={{ fontSize: '2rem' }}>
                {t('roadSignsQuiz', { defaultValue: 'Road Signs Quiz' })}
              </h1>
              <h2>
                {t('errorLoadingCurrentSign', { defaultValue: 'Error loading current sign' })}
              </h2>
            </div>
          </div>
        </div>
        <Footer />
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead {...seoData} />

      {/* Structured Data Schemas */}
      <StructuredData data={schemas} />

      <Navbar />

      {/* Quiz Section */}
      <div className="features-area ptb-100 bg-F7F7FF">
        <div className="container">
          <div className="text-center mb-4">
            <h1 style={{ fontSize: '2rem' }}>
              {t('roadSignsQuiz', { defaultValue: 'Road Signs Quiz' })}
            </h1>
            <p>
              {t('score', { defaultValue: 'Score' })}: {score} / {currentQuestionIndex + 1}
            </p>
            {locale !== 'en' && (
              <button onClick={toggleTranslation} className="btn btn-primary mb-4">
                {showTranslated
                  ? t('showEnglish', { defaultValue: 'Show English' })
                  : t('showTranslation', { defaultValue: 'Show Translation' })}
              </button>
            )}
          </div>

          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-8">
              <div
                className="quiz-features-item text-center"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  className="quiz-sign-image-container mb-4"
                  style={{
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '10px',
                    padding: '20px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  {currentSign.attributes.Sign.data?.attributes.url && (
                    <Image
                      src={
                        currentSign.attributes.Sign.data.attributes.url.startsWith('http')
                          ? currentSign.attributes.Sign.data.attributes.url
                          : `${getStrapiHost()}${currentSign.attributes.Sign.data.attributes.url}`
                      }
                      alt={currentSign.attributes.original_name}
                      width={200}
                      height={200}
                      style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
                    />
                  )}
                </div>

                <div
                  className="quiz-options-container"
                  style={{
                    marginTop: '20px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  {options.map((option, index) => (
                    <button
                      key={index}
                      className={`quiz-option-btn btn btn-lg btn-outline-primary m-2 ${showFeedback ? 'disabled' : ''}`}
                      onClick={() => handleAnswer(option)}
                      style={{
                        width: '80%',
                        marginBottom: '10px',
                        padding: '15px 20px',
                        backgroundColor:
                          showFeedback &&
                          option ===
                            (showTranslated
                              ? currentSign.attributes.translated_name
                              : currentSign.attributes.original_name)
                            ? '#28a745'
                            : showFeedback &&
                                option !==
                                  (showTranslated
                                    ? currentSign.attributes.translated_name
                                    : currentSign.attributes.original_name)
                              ? '#dc3545'
                              : '',
                        border: '2px solid #4d2bac82',
                        transition: 'all 0.3s ease',
                        alignSelf: 'center',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        textAlign: 'center',
                        minHeight: 'auto',
                        height: 'auto',
                        lineHeight: '1.5',
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {showFeedback && (
                  <div
                    className={`quiz-feedback mt-3 ${isCorrect ? 'text-success' : 'text-danger'}`}
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      padding: '15px 20px',
                      borderRadius: '5px',
                      backgroundColor: isCorrect
                        ? 'rgba(40, 167, 69, 0.1)'
                        : 'rgba(220, 53, 69, 0.1)',
                      wordWrap: 'break-word',
                      textAlign: 'center',
                      width: '80%',
                    }}
                  >
                    {isCorrect
                      ? t('correct', 'Correct!')
                      : `${t('wrong', 'Wrong!')} ${t('correctAnswerIs', 'The correct answer is')}: ${showTranslated ? currentSign.attributes.translated_name : currentSign.attributes.original_name}`}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Content Section */}
      <div className="road-signs-info-area ptb-50 bg-white">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="info-content text-center mb-4">
                <h2 className="mb-4">
                  {t(
                    'masterCDLRoadSigns',
                    "Master CDL Road Signs for Your Commercial Driver's License"
                  )}
                </h2>
                <p className="lead mb-4">
                  {t(
                    'understandingRoadSigns',
                    "Understanding road signs is crucial for CDL drivers. Our interactive road signs quiz helps you learn and memorize the traffic signs you'll encounter on your CDL permit test and during your commercial driving career."
                  )}
                </p>
              </div>

              <div className="row">
                <div className="col-md-4 mb-4">
                  <div
                    className="info-card text-center p-4"
                    style={{
                      minHeight: '280px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      className="icon"
                      style={{
                        marginBottom: '1rem',
                        width: '100%',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <i
                        className="ri-road-map-line"
                        style={{
                          fontSize: '3rem',
                          color: '#007bff',
                          margin: '0 auto',
                          display: 'block',
                          textAlign: 'center',
                        }}
                      ></i>
                    </div>
                    <h4
                      style={{
                        marginTop: '0',
                        marginBottom: '1rem',
                        width: '100%',
                        textAlign: 'center',
                      }}
                    >
                      {t('warningSigns', 'Warning Signs')}
                    </h4>
                    <p style={{ marginTop: '0', width: '100%', textAlign: 'center' }}>
                      {t(
                        'warningSignsDesc',
                        'Learn to identify construction zones, curves, intersections, and hazardous conditions ahead.'
                      )}
                    </p>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div
                    className="info-card text-center p-4"
                    style={{
                      minHeight: '280px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      className="icon"
                      style={{
                        marginBottom: '1rem',
                        width: '100%',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <i
                        className="ri-stop-circle-line"
                        style={{
                          fontSize: '3rem',
                          color: '#dc3545',
                          margin: '0 auto',
                          display: 'block',
                          textAlign: 'center',
                        }}
                      ></i>
                    </div>
                    <h4
                      style={{
                        marginTop: '0',
                        marginBottom: '1rem',
                        width: '100%',
                        textAlign: 'center',
                      }}
                    >
                      {t('regulatorySigns', 'Regulatory Signs')}
                    </h4>
                    <p style={{ marginTop: '0', width: '100%', textAlign: 'center' }}>
                      {t(
                        'regulatorySignsDesc',
                        'Master stop signs, yield signs, speed limits, and traffic control regulations.'
                      )}
                    </p>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div
                    className="info-card text-center p-4"
                    style={{
                      minHeight: '280px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      className="icon"
                      style={{
                        marginBottom: '1rem',
                        width: '100%',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <i
                        className="ri-direction-line"
                        style={{
                          fontSize: '3rem',
                          color: '#28a745',
                          margin: '0 auto',
                          display: 'block',
                          textAlign: 'center',
                        }}
                      ></i>
                    </div>
                    <h4
                      style={{
                        marginTop: '0',
                        marginBottom: '1rem',
                        width: '100%',
                        textAlign: 'center',
                      }}
                    >
                      {t('guideSigns', 'Guide Signs')}
                    </h4>
                    <p style={{ marginTop: '0', width: '100%', textAlign: 'center' }}>
                      {t(
                        'guideSignsDesc',
                        'Navigate with highway markers, exit signs, and directional information.'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="study-tips mb-4">
                <h3 className="text-center mb-3">
                  {t('roadSignsStudyTips', 'Road Signs Study Tips for CDL Drivers')}
                </h3>
                <div className="row">
                  <div className="col-md-6">
                    <ul className="tips-list">
                      <li>
                        <strong>{t('shapeRecognition', 'Shape Recognition')}:</strong>{' '}
                        {t(
                          'shapeRecognitionDesc',
                          'Learn sign shapes - octagons mean stop, triangles mean yield, diamonds warn of hazards'
                        )}
                      </li>
                      <li>
                        <strong>{t('colorMeanings', 'Color Meanings')}:</strong>{' '}
                        {t(
                          'colorMeaningsDesc',
                          'Red for prohibition, yellow for caution, green for guidance, blue for services'
                        )}
                      </li>
                      <li>
                        <strong>{t('symbolUnderstanding', 'Symbol Understanding')}:</strong>{' '}
                        {t(
                          'symbolUnderstandingDesc',
                          'Many signs use universal symbols that transcend language barriers'
                        )}
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="tips-list">
                      <li>
                        <strong>{t('commercialSpecific', 'Commercial Specific')}:</strong>{' '}
                        {t(
                          'commercialSpecificDesc',
                          'Pay special attention to weight limits, height restrictions, and truck route signs'
                        )}
                      </li>
                      <li>
                        <strong>{t('constructionZones', 'Construction Zones')}:</strong>{' '}
                        {t(
                          'constructionZonesDesc',
                          'Orange signs indicate temporary conditions and reduced speed zones'
                        )}
                      </li>
                      <li>
                        <strong>{t('regularPractice', 'Regular Practice')}:</strong>{' '}
                        {t(
                          'regularPracticeDesc',
                          'Take our quiz regularly to reinforce your knowledge and improve recognition speed'
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="importance-section mb-4">
                <h3 className="text-center mb-3">
                  {t('whyRoadSignsMatter', 'Why Road Signs Matter for CDL Drivers')}
                </h3>
                <p className="text-center mb-3">
                  {t(
                    'whyRoadSignsMatterDesc',
                    "As a commercial driver, you'll encounter thousands of road signs during your career. Understanding these signs is essential for:"
                  )}
                </p>
                <div className="row">
                  <div className="col-md-6">
                    <div className="importance-item mb-3">
                      <h5>{t('safetyCompliance', 'Safety Compliance')}</h5>
                      <p>
                        {t(
                          'safetyComplianceDesc',
                          'Following sign instructions prevents accidents and keeps you and other motorists safe on the road.'
                        )}
                      </p>
                    </div>
                    <div className="importance-item mb-3">
                      <h5>{t('legalRequirements', 'Legal Requirements')}</h5>
                      <p>
                        {t(
                          'legalRequirementsDesc',
                          'Ignoring traffic signs can result in citations, fines, and points on your CDL.'
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="importance-item mb-3">
                      <h5>{t('routePlanning', 'Route Planning')}</h5>
                      <p>
                        {t(
                          'routePlanningDesc',
                          'Signs help you navigate efficiently and avoid restricted areas for commercial vehicles.'
                        )}
                      </p>
                    </div>
                    <div className="importance-item mb-3">
                      <h5>{t('cdlTesting', 'CDL Testing')}</h5>
                      <p>
                        {t(
                          'cdlTestingDesc',
                          'Road signs questions are a significant portion of the CDL general knowledge test.'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="test-info text-center">
                <h3 className="mb-3">{t('howThisQuizWorks', 'How This Quiz Works')}</h3>
                <p className="mb-3">
                  {t(
                    'howThisQuizWorksDesc1',
                    'Our interactive road signs quiz presents you with actual road sign images and multiple-choice answers. Each question is designed to test your knowledge of sign meanings, appropriate responses, and safety implications.'
                  )}
                </p>
                <p className="mb-4">
                  {t(
                    'howThisQuizWorksDesc2',
                    'The quiz adapts to your language preference and provides immediate feedback to help you learn from any mistakes. Use this tool to supplement your CDL manual study and improve your chances of passing the permit test on your first attempt.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RelatedLinks currentPage="road-signs" />
      <Footer />

      <style jsx>{`
        .info-card {
          background: #f8f9fa;
          border-radius: 10px;
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
          border: 1px solid #e9ecef;
        }
        .info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        .tips-list {
          list-style: none;
          padding-left: 0;
        }
        .tips-list li {
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .tips-list li:last-child {
          border-bottom: none;
        }
        .importance-item h5 {
          color: #333;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .importance-item p {
          color: #666;
          line-height: 1.6;
        }
        .road-signs-info-area {
          border-bottom: 1px solid #e9ecef;
        }
        .lead {
          font-size: 1.25rem;
          font-weight: 300;
          line-height: 1.6;
          color: #666;
        }
      `}</style>
    </Layout>
  );
};

export async function getStaticProps({ locale }) {
  try {
    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'en', ['common', 'navbar', 'footer', 'cookie'])),
      },
      revalidate: 7200, // Revalidate every 2 hours for quiz pages
    };
  } catch (error) {
    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'en', ['common', 'navbar', 'footer', 'cookie'])),
      },
      revalidate: 300, // Try again after 5 minutes on error
    };
  }
}

export default SignsTest;
