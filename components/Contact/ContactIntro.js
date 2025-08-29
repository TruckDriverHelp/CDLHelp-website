import React from 'react';
import { useTranslation } from 'next-i18next';

const ContactIntro = () => {
  const { t } = useTranslation('contact');

  return (
    <div className="contact-intro-area pt-100 pb-50">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="contact-intro-content">
              <h2 className="mb-4">{t('intro.title', 'Get Help with Your CDL Journey')}</h2>

              <p className="mb-3">
                {t(
                  'intro.paragraph1',
                  "At CDL Help, we understand that preparing for your Commercial Driver's License exam can be challenging. That's why our dedicated support team is here to assist you every step of the way. Whether you have questions about our practice tests, need technical support with our mobile app, or want guidance on CDL requirements in your state, we're ready to help."
                )}
              </p>

              <p className="mb-3">
                {t(
                  'intro.paragraph2',
                  "Our support team consists of experienced professionals who are knowledgeable about CDL regulations, testing procedures, and the trucking industry. We're committed to providing you with accurate, timely, and helpful responses to ensure your success in obtaining your CDL."
                )}
              </p>

              <div className="support-hours mb-4">
                <h3 className="mb-3">
                  {t('intro.supportHours', 'Support Hours & Response Times')}
                </h3>
                <p className="mb-2">
                  {t(
                    'intro.responseTime',
                    'We typically respond to all inquiries within 24-48 hours during business days. For urgent technical issues, we strive to provide same-day responses when possible.'
                  )}
                </p>
                <ul className="support-features">
                  <li>{t('intro.feature1', '✓ Email support available 24/7')}</li>
                  <li>{t('intro.feature2', '✓ Multi-language support in 8 languages')}</li>
                  <li>{t('intro.feature3', '✓ Technical assistance for app and website')}</li>
                  <li>{t('intro.feature4', '✓ CDL exam guidance and study tips')}</li>
                </ul>
              </div>

              <div className="common-questions mb-4">
                <h3 className="mb-3">{t('intro.commonQuestions', 'Common Support Topics')}</h3>
                <p className="mb-3">
                  {t(
                    'intro.questionsIntro',
                    'Here are some of the most common topics our support team can help you with:'
                  )}
                </p>
                <div className="row">
                  <div className="col-md-6">
                    <ul className="question-list">
                      <li>{t('intro.topic1', '• Account and subscription management')}</li>
                      <li>{t('intro.topic2', '• Technical issues with the mobile app')}</li>
                      <li>{t('intro.topic3', '• Practice test questions and explanations')}</li>
                      <li>{t('intro.topic4', '• CDL endorsement requirements')}</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="question-list">
                      <li>{t('intro.topic5', '• State-specific CDL regulations')}</li>
                      <li>{t('intro.topic6', '• Study tips and test strategies')}</li>
                      <li>{t('intro.topic7', '• School and company recommendations')}</li>
                      <li>{t('intro.topic8', '• DOT physical exam information')}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="before-contact mb-4">
                <h3 className="mb-3">{t('intro.beforeContact', 'Before You Contact Us')}</h3>
                <p className="mb-3">
                  {t(
                    'intro.beforeContactText',
                    'To help us assist you more efficiently, please check our frequently asked questions and help resources first. Many common questions can be answered instantly through our comprehensive help documentation.'
                  )}
                </p>
                <p className="mb-3">
                  {t(
                    'intro.prepareInfo',
                    "When contacting support, please include relevant information such as your device type, app version (if applicable), and a detailed description of any issues you're experiencing. Screenshots can be particularly helpful for technical problems."
                  )}
                </p>
              </div>

              <div className="privacy-notice">
                <p className="text-muted">
                  {t(
                    'intro.privacyNotice',
                    'Your privacy is important to us. All communications are handled confidentially and in accordance with our privacy policy. We will never share your personal information with third parties without your consent.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactIntro;
