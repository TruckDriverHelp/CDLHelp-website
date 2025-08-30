import React from 'react';
import { useTranslation } from 'next-i18next';

export const DOTPhysicalSEOContent = ({ locale }) => {
  const { t } = useTranslation('dot-physical-seo');

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Introduction to DOT Physical */}
      <section style={{ marginBottom: '40px' }}>
        <h2
          style={{
            fontSize: '1.875rem',
            marginBottom: '20px',
            color: '#1a1a1a',
            fontWeight: '600',
          }}
        >
          {t('introTitle', { defaultValue: 'DOT Physical Exam for Commercial Drivers' })}
        </h2>
        <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '16px' }}>
          {t('introContent1', {
            defaultValue: `The Department of Transportation (DOT) physical examination is a mandatory medical assessment required for all commercial motor vehicle (CMV) drivers operating in interstate commerce. This comprehensive health screening ensures drivers meet the physical and mental standards necessary to safely operate commercial vehicles weighing over 10,000 pounds, transporting hazardous materials, or carrying 15 or more passengers. The DOT physical must be performed by a certified medical examiner listed on the Federal Motor Carrier Safety Administration (FMCSA) National Registry.`,
          })}
        </p>
        <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
          {t('introContent2', {
            defaultValue: `Your Medical Examiner's Certificate (MEC), commonly called a DOT medical card, is valid for up to 24 months for drivers in good health. However, certain medical conditions may require more frequent examinations, with certificates issued for shorter periods ranging from 3 months to 1 year. Maintaining a current DOT medical card is essential for CDL compliance, as driving without valid medical certification can result in fines, license suspension, and disqualification from commercial driving.`,
          })}
        </p>
      </section>

      {/* What to Expect During Exam */}
      <section style={{ marginBottom: '40px' }}>
        <h2
          style={{
            fontSize: '1.875rem',
            marginBottom: '20px',
            color: '#1a1a1a',
            fontWeight: '600',
          }}
        >
          {t('examProcessTitle', { defaultValue: 'What to Expect During Your DOT Physical Exam' })}
        </h2>

        <div style={{ marginBottom: '24px' }}>
          <h3
            style={{
              fontSize: '1.25rem',
              marginBottom: '12px',
              color: '#374151',
              fontWeight: '600',
            }}
          >
            {t('medicalHistoryTitle', { defaultValue: 'Medical History Review' })}
          </h3>
          <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
            {t('medicalHistoryContent', {
              defaultValue: `The examination begins with a thorough review of your medical history, including past surgeries, hospitalizations, current medications, and existing health conditions. Be prepared to discuss any history of heart disease, diabetes, sleep disorders, mental health conditions, or substance abuse. Honesty is crucial, as providing false information can result in disqualification and legal consequences. Bring a complete list of medications with dosages and your primary care physician's contact information.`,
            })}
          </p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3
            style={{
              fontSize: '1.25rem',
              marginBottom: '12px',
              color: '#374151',
              fontWeight: '600',
            }}
          >
            {t('vitalSignsTitle', { defaultValue: 'Vital Signs and Basic Tests' })}
          </h3>
          <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
            {t('vitalSignsContent', {
              defaultValue: `The examiner will check your blood pressure (must be below 140/90), pulse rate, height, and weight. Vision testing requires 20/40 acuity in each eye with or without correction, plus a 70-degree field of vision in each eye. You must be able to distinguish colors on traffic signals. Hearing is tested using a forced whisper test at 5 feet or audiometry. A urinalysis screens for protein, blood, and sugar levels indicating potential kidney disease or diabetes.`,
            })}
          </p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3
            style={{
              fontSize: '1.25rem',
              marginBottom: '12px',
              color: '#374151',
              fontWeight: '600',
            }}
          >
            {t('physicalExamTitle', { defaultValue: 'Physical Examination' })}
          </h3>
          <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
            {t('physicalExamContent', {
              defaultValue: `The physical examination evaluates your general appearance, eyes, ears, mouth and throat, heart, lungs, abdomen, vascular system, extremities, spine, and neurological function. The examiner checks for hernias, assesses your range of motion, and evaluates your ability to perform movements required for commercial driving. Any physical limitation that could interfere with safe driving operation, such as limb impairment or grip strength deficiency, will be carefully evaluated.`,
            })}
          </p>
        </div>
      </section>

      {/* Medical Conditions and Qualifications */}
      <section style={{ marginBottom: '40px' }}>
        <h2
          style={{
            fontSize: '1.875rem',
            marginBottom: '20px',
            color: '#1a1a1a',
            fontWeight: '600',
          }}
        >
          {t('medicalConditionsTitle', {
            defaultValue: 'Medical Conditions That May Affect Certification',
          })}
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <h3
            style={{
              fontSize: '1.25rem',
              marginBottom: '12px',
              color: '#374151',
              fontWeight: '600',
            }}
          >
            {t('diabetesTitle', { defaultValue: 'Diabetes Management' })}
          </h3>
          <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
            {t('diabetesContent', {
              defaultValue: `Drivers with diabetes can qualify for DOT certification if their condition is well-controlled. Those using insulin must provide documentation of stable blood sugar control for at least 3 months, including logs showing no severe hypoglycemic episodes. An endocrinologist's evaluation may be required. Drivers with diabetes typically receive 1-year certificates requiring annual recertification. Maintaining consistent blood sugar monitoring and medication compliance is essential for continued qualification.`,
            })}
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3
            style={{
              fontSize: '1.25rem',
              marginBottom: '12px',
              color: '#374151',
              fontWeight: '600',
            }}
          >
            {t('cardiovascularTitle', { defaultValue: 'Cardiovascular Conditions' })}
          </h3>
          <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
            {t('cardiovascularContent', {
              defaultValue: `Heart conditions require careful evaluation. Drivers with a history of heart attack, heart surgery, or cardiac stents may need clearance from a cardiologist. Blood pressure must be controlled below 140/90; readings above 180/110 result in immediate disqualification until controlled. Certain heart medications and conditions like untreated sleep apnea that affect cardiovascular health may impact certification. Regular monitoring and medication compliance are crucial for drivers with cardiac conditions.`,
            })}
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3
            style={{
              fontSize: '1.25rem',
              marginBottom: '12px',
              color: '#374151',
              fontWeight: '600',
            }}
          >
            {t('sleepApneaTitle', { defaultValue: 'Sleep Apnea' })}
          </h3>
          <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
            {t('sleepApneaContent', {
              defaultValue: `Sleep apnea screening is increasingly important in DOT physicals. Drivers with a BMI over 35, neck circumference over 17 inches (men) or 16 inches (women), or other risk factors may require sleep study evaluation. Those diagnosed with sleep apnea must demonstrate compliance with treatment, typically CPAP therapy, with usage data showing at least 4 hours per night for 70% of nights. Annual recertification and compliance reports are typically required for drivers with treated sleep apnea.`,
            })}
          </p>
        </div>
      </section>

      {/* Preparation Tips */}
      <section style={{ marginBottom: '40px' }}>
        <h2
          style={{
            fontSize: '1.875rem',
            marginBottom: '20px',
            color: '#1a1a1a',
            fontWeight: '600',
          }}
        >
          {t('preparationTitle', { defaultValue: 'How to Prepare for Your DOT Physical' })}
        </h2>
        <ul style={{ color: '#4b5563', lineHeight: '1.8', paddingLeft: '24px' }}>
          <li style={{ marginBottom: '12px' }}>
            {t('prep1', {
              defaultValue:
                'Schedule your exam well before your current medical certificate expires to allow time for any follow-up testing if needed',
            })}
          </li>
          <li style={{ marginBottom: '12px' }}>
            {t('prep2', {
              defaultValue:
                'Get adequate sleep the night before and avoid caffeine or nicotine before the exam to ensure accurate blood pressure readings',
            })}
          </li>
          <li style={{ marginBottom: '12px' }}>
            {t('prep3', {
              defaultValue:
                'Bring a complete list of all medications with dosages, prescribing physician information, and reason for use',
            })}
          </li>
          <li style={{ marginBottom: '12px' }}>
            {t('prep4', {
              defaultValue:
                'If you wear glasses, contacts, or hearing aids, bring them to the examination',
            })}
          </li>
          <li style={{ marginBottom: '12px' }}>
            {t('prep5', {
              defaultValue:
                'Bring medical records for any chronic conditions, recent surgeries, or specialist evaluations',
            })}
          </li>
          <li style={{ marginBottom: '12px' }}>
            {t('prep6', {
              defaultValue:
                'For sleep apnea, bring CPAP compliance reports covering at least 30 days',
            })}
          </li>
          <li style={{ marginBottom: '12px' }}>
            {t('prep7', {
              defaultValue:
                'Take prescribed medications as normal unless specifically instructed otherwise by your doctor',
            })}
          </li>
          <li style={{ marginBottom: '12px' }}>
            {t('prep8', {
              defaultValue:
                'Stay hydrated and eat normally before the exam to avoid abnormal test results',
            })}
          </li>
        </ul>
      </section>

      {/* Finding Certified Examiners */}
      <section style={{ marginBottom: '40px' }}>
        <h2
          style={{
            fontSize: '1.875rem',
            marginBottom: '20px',
            color: '#1a1a1a',
            fontWeight: '600',
          }}
        >
          {t('findExaminerTitle', { defaultValue: 'Finding a Certified Medical Examiner' })}
        </h2>
        <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '16px' }}>
          {t('findExaminerContent1', {
            defaultValue: `All DOT physical exams must be conducted by a medical professional listed on the FMCSA National Registry of Certified Medical Examiners. These healthcare providers have completed specialized training in FMCSA regulations and passed a certification exam. The registry includes physicians (MD/DO), physician assistants, advanced practice nurses, and chiropractors who maintain their certification through periodic training and testing.`,
          })}
        </p>
        <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '16px' }}>
          {t('findExaminerContent2', {
            defaultValue: `Use our search tool to find certified examiners near you. Consider factors such as location convenience, appointment availability, cost (typically $75-150), and whether they offer same-day medical cards. Some examiners specialize in helping drivers with specific medical conditions navigate the certification process. Many truck stops, urgent care centers, and occupational health clinics offer walk-in DOT physicals for driver convenience.`,
          })}
        </p>
      </section>

      {/* Cost and Insurance */}
      <section style={{ marginBottom: '40px' }}>
        <h2
          style={{
            fontSize: '1.875rem',
            marginBottom: '20px',
            color: '#1a1a1a',
            fontWeight: '600',
          }}
        >
          {t('costTitle', { defaultValue: 'DOT Physical Exam Costs and Insurance Coverage' })}
        </h2>
        <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '16px' }}>
          {t('costContent1', {
            defaultValue: `DOT physical exam costs typically range from $75 to $150, varying by location and provider type. Most health insurance plans do not cover DOT physicals as they are considered occupational health examinations rather than preventive care. However, many employers reimburse drivers for DOT physical expenses or pay directly. Self-employed drivers can often deduct the cost as a business expense on their taxes.`,
          })}
        </p>
        <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
          {t('costContent2', {
            defaultValue: `Additional costs may arise if follow-up testing is required. Sleep studies for suspected sleep apnea can cost $1,000-3,000, cardiac stress tests range from $200-5,000, and specialist consultations typically cost $200-500. Some conditions require annual or more frequent recertification, increasing long-term costs. Budget for these potential expenses and maintain good health habits to minimize the need for additional testing and frequent recertification.`,
          })}
        </p>
      </section>

      {/* Maintaining Certification */}
      <section style={{ marginBottom: '40px' }}>
        <h2
          style={{
            fontSize: '1.875rem',
            marginBottom: '20px',
            color: '#1a1a1a',
            fontWeight: '600',
          }}
        >
          {t('maintainingTitle', { defaultValue: 'Maintaining Your DOT Medical Certification' })}
        </h2>
        <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '16px' }}>
          {t('maintainingContent1', {
            defaultValue: `After passing your DOT physical, maintain your certification by keeping your medical card with you while driving and ensuring your employer has a copy. Self-certify with your state DMV by providing them with a copy of your medical certificate - requirements vary by state but typically must be done within 30 days. Set reminders for renewal at least 45 days before expiration to allow time for scheduling and any necessary follow-up.`,
          })}
        </p>
        <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
          {t('maintainingContent2', {
            defaultValue: `Between examinations, maintain your health through regular exercise, proper diet, medication compliance, and routine medical care. Report any significant health changes to your employer and consider whether they affect your ability to safely operate a commercial vehicle. Some conditions require immediate medical recertification if they develop between regular exams. Protecting your DOT medical certification protects your livelihood and ensures continued safety on the roads.`,
          })}
        </p>
      </section>
    </div>
  );
};
