import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '../../components/_App/Layout';
import Navbar from '../../components/_App/Navbar';
import Footer from '../../components/_App/Footer';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SEOHead } from '../../src/shared/ui/SEO';
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
    customUrl: 'https://www.cdlhelp.com/road-signs/test',
    type: 'website',
  });

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

  const generateOptions = useCallback(() => {
    if (!signs || signs.length === 0) return;

    const currentSign = signs[currentQuestionIndex];
    if (!currentSign || !currentSign.attributes) return;

    // Get 3 random wrong answers with both original and translated versions
    const wrongAnswers = signs
      .filter(sign => sign.id !== currentSign.id)
      .sort(() => 0.5 - Math.random())
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

    // Combine and shuffle all options ONCE per question
    const allOptionPairs = [...wrongAnswers, correctAnswer].sort(() => 0.5 - Math.random());

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
      <Navbar />
      <div className="features-area ptb-100 bg-F7F7FF">
        <div className="container">
          <div className="text-center mb-4">
            <h2>{t('roadSignsQuiz', { defaultValue: 'Road Signs Quiz' })}</h2>
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
                      ? 'Correct!'
                      : `Wrong! The correct answer is: ${showTranslated ? currentSign.attributes.translated_name : currentSign.attributes.original_name}`}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export async function getStaticProps({ locale }) {
  try {
    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'en', ['common', 'navbar', 'footer'])),
      },
    };
  } catch (error) {
    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'en', ['common', 'navbar', 'footer'])),
      },
    };
  }
}

export default SignsTest;
