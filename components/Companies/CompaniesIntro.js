import React from 'react';
import { useTranslation } from 'next-i18next';

const CompaniesIntro = () => {
  const { t } = useTranslation('companies');

  return (
    <div className="companies-intro-section ptb-50">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="intro-content">
              <h2 className="mb-4">
                {t('intro.mainTitle', 'Find Your Next Trucking Career Opportunity')}
              </h2>

              <div className="overview-section mb-4">
                <p>
                  {t(
                    'intro.overview1',
                    "Welcome to CDL Help's comprehensive trucking company directory. We've partnered with leading trucking companies across the United States to bring you the most current job opportunities for CDL drivers. Whether you're a newly licensed driver looking for your first position or an experienced professional seeking better opportunities, our directory connects you with companies that are actively hiring."
                  )}
                </p>
                <p>
                  {t(
                    'intro.overview2',
                    'The trucking industry offers diverse career paths with competitive pay, comprehensive benefits, and opportunities for growth. Our directory features companies of all sizes, from large national carriers to regional and local operations, each offering unique advantages for drivers at different stages of their careers.'
                  )}
                </p>
              </div>

              <div className="benefits-section mb-4">
                <h3 className="mb-3">
                  {t('intro.benefitsTitle', 'Why Choose a Career in Trucking')}
                </h3>
                <div className="row">
                  <div className="col-md-6">
                    <div className="benefit-item mb-3">
                      <h4>{t('intro.benefit1Title', 'Competitive Compensation')}</h4>
                      <p>
                        {t(
                          'intro.benefit1Text',
                          'CDL drivers earn competitive wages with opportunities for bonuses, overtime, and performance incentives. Many companies offer sign-on bonuses and referral programs.'
                        )}
                      </p>
                    </div>
                    <div className="benefit-item mb-3">
                      <h4>{t('intro.benefit2Title', 'Job Security')}</h4>
                      <p>
                        {t(
                          'intro.benefit2Text',
                          'The demand for qualified CDL drivers continues to grow. The trucking industry is essential to the economy, providing stable employment opportunities nationwide.'
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="benefit-item mb-3">
                      <h4>{t('intro.benefit3Title', 'Comprehensive Benefits')}</h4>
                      <p>
                        {t(
                          'intro.benefit3Text',
                          'Most trucking companies offer full benefits packages including health insurance, retirement plans, paid time off, and life insurance for their drivers.'
                        )}
                      </p>
                    </div>
                    <div className="benefit-item mb-3">
                      <h4>{t('intro.benefit4Title', 'Career Advancement')}</h4>
                      <p>
                        {t(
                          'intro.benefit4Text',
                          'Start as a company driver and advance to owner-operator, trainer, dispatcher, or management positions. The trucking industry rewards experience and dedication.'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="company-types mb-4">
                <h3 className="mb-3">{t('intro.typesTitle', 'Types of Trucking Companies')}</h3>
                <p className="mb-3">
                  {t(
                    'intro.typesIntro',
                    'Our directory includes various types of trucking companies to match your preferences and lifestyle:'
                  )}
                </p>
                <ul className="company-types-list">
                  <li>
                    <strong>{t('intro.type1', 'Long-Haul/OTR Companies')}</strong>:{' '}
                    {t(
                      'intro.type1Desc',
                      'Cross-country routes with higher pay rates and extended time on the road.'
                    )}
                  </li>
                  <li>
                    <strong>{t('intro.type2', 'Regional Carriers')}</strong>:{' '}
                    {t(
                      'intro.type2Desc',
                      'Routes within specific regions, offering better work-life balance with weekly home time.'
                    )}
                  </li>
                  <li>
                    <strong>{t('intro.type3', 'Local Delivery')}</strong>:{' '}
                    {t(
                      'intro.type3Desc',
                      'Daily routes with home time every night, perfect for drivers with families.'
                    )}
                  </li>
                  <li>
                    <strong>{t('intro.type4', 'Specialized Transport')}</strong>:{' '}
                    {t(
                      'intro.type4Desc',
                      'Hazmat, tanker, flatbed, and other specialized freight requiring additional endorsements.'
                    )}
                  </li>
                  <li>
                    <strong>{t('intro.type5', 'Owner-Operator Programs')}</strong>:{' '}
                    {t(
                      'intro.type5Desc',
                      'Opportunities for drivers who own their trucks to contract with established companies.'
                    )}
                  </li>
                </ul>
              </div>

              <div className="hiring-process mb-4">
                <h3 className="mb-3">
                  {t('intro.hiringTitle', 'What to Expect in the Hiring Process')}
                </h3>
                <p className="mb-3">
                  {t(
                    'intro.hiringIntro',
                    'Understanding the typical hiring process helps you prepare for success:'
                  )}
                </p>
                <ol className="hiring-steps">
                  <li>
                    {t(
                      'intro.step1',
                      'Submit your application online or by phone with basic information and CDL details'
                    )}
                  </li>
                  <li>
                    {t(
                      'intro.step2',
                      'Complete a phone screening to discuss your experience and expectations'
                    )}
                  </li>
                  <li>
                    {t('intro.step3', 'Provide employment history and undergo background checks')}
                  </li>
                  <li>{t('intro.step4', 'Pass DOT physical examination and drug screening')}</li>
                  <li>{t('intro.step5', 'Complete company orientation and safety training')}</li>
                  <li>
                    {t('intro.step6', 'Begin driving with a trainer or mentor for initial period')}
                  </li>
                </ol>
              </div>

              <div className="requirements-section mb-4">
                <h3 className="mb-3">
                  {t('intro.requirementsTitle', 'Common Requirements for CDL Positions')}
                </h3>
                <p className="mb-3">
                  {t(
                    'intro.requirementsIntro',
                    'While specific requirements vary by company, most trucking companies look for:'
                  )}
                </p>
                <div className="row">
                  <div className="col-md-6">
                    <ul className="requirements-list">
                      <li>{t('intro.req1', 'Valid CDL Class A license')}</li>
                      <li>{t('intro.req2', 'Clean driving record (no major violations)')}</li>
                      <li>{t('intro.req3', 'DOT medical certificate')}</li>
                      <li>{t('intro.req4', 'Minimum age of 21 (18 for intrastate)')}</li>
                      <li>{t('intro.req5', 'Pass drug and alcohol screening')}</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="requirements-list">
                      <li>{t('intro.req6', 'Verifiable work history')}</li>
                      <li>{t('intro.req7', 'No serious criminal convictions')}</li>
                      <li>{t('intro.req8', 'Ability to lift 50+ pounds')}</li>
                      <li>{t('intro.req9', 'Good communication skills')}</li>
                      <li>{t('intro.req10', 'Professional attitude and appearance')}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="tips-section">
                <h3 className="mb-3">
                  {t('intro.tipsTitle', 'Tips for Choosing the Right Company')}
                </h3>
                <p className="mb-3">
                  {t(
                    'intro.tipsIntro',
                    'Consider these factors when evaluating trucking companies:'
                  )}
                </p>
                <ul className="tips-list">
                  <li>
                    {t(
                      'intro.tip1',
                      'Compare pay structures: per mile, hourly, percentage, or salary'
                    )}
                  </li>
                  <li>{t('intro.tip2', 'Evaluate home time policies and route assignments')}</li>
                  <li>{t('intro.tip3', 'Review equipment quality and maintenance practices')}</li>
                  <li>
                    {t('intro.tip4', 'Ask about training programs and advancement opportunities')}
                  </li>
                  <li>
                    {t(
                      'intro.tip5',
                      'Check company safety ratings and driver satisfaction reviews'
                    )}
                  </li>
                  <li>{t('intro.tip6', 'Understand benefit packages and retirement options')}</li>
                  <li>{t('intro.tip7', 'Consider company culture and driver support services')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .companies-intro-section {
          background: #f8f9fa;
          margin-bottom: 30px;
        }
        .intro-content h2 {
          color: #333;
          font-size: 32px;
        }
        .intro-content h3 {
          color: #444;
          font-size: 24px;
          margin-top: 30px;
        }
        .intro-content h4 {
          color: #555;
          font-size: 18px;
          font-weight: 600;
        }
        .intro-content p {
          color: #666;
          line-height: 1.8;
          margin-bottom: 15px;
        }
        .benefit-item {
          padding: 15px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .company-types-list,
        .requirements-list,
        .tips-list {
          list-style: none;
          padding-left: 0;
        }
        .company-types-list li,
        .tips-list li {
          padding: 10px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .requirements-list li {
          padding: 5px 0;
        }
        .hiring-steps {
          counter-reset: step-counter;
          list-style: none;
          padding-left: 0;
        }
        .hiring-steps li {
          counter-increment: step-counter;
          padding: 10px 0 10px 40px;
          position: relative;
        }
        .hiring-steps li::before {
          content: counter(step-counter);
          position: absolute;
          left: 0;
          top: 10px;
          width: 30px;
          height: 30px;
          background: #007bff;
          color: white;
          border-radius: 50%;
          text-align: center;
          line-height: 30px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default CompaniesIntro;
