import React from 'react';
import { useTranslation } from 'next-i18next';

export const RoadSignsSEOContent = ({ locale }) => {
  const { t } = useTranslation('road-signs-seo');

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Introduction to Road Signs Test */}
      <section style={{ marginBottom: '40px' }}>
        <h2
          style={{
            fontSize: '1.875rem',
            marginBottom: '20px',
            color: '#1a1a1a',
            fontWeight: '600',
          }}
        >
          {t('introTitle', {
            defaultValue: 'Master CDL Road Signs for Your Commercial Driver License',
          })}
        </h2>
        <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '16px' }}>
          {t('introContent1', {
            defaultValue: `Understanding road signs is a critical component of the CDL knowledge test and essential for safe commercial vehicle operation. This comprehensive road signs practice test covers all types of signage you'll encounter on highways, construction zones, and urban areas. Professional truck drivers must instantly recognize and respond to regulatory signs, warning signs, guide signs, and specialized trucking-related signage to maintain safety and compliance with federal regulations.`,
          })}
        </p>
        <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
          {t('introContent2', {
            defaultValue: `Our interactive road signs quiz simulates the actual CDL exam format, presenting you with high-quality images of real road signs along with multiple-choice questions. Each sign is carefully selected from the Federal Highway Administration's Manual on Uniform Traffic Control Devices (MUTCD), ensuring you're studying the exact signs that appear on official CDL tests. Practice identifying signs quickly and accurately to build the confidence needed for both your CDL exam and real-world driving situations.`,
          })}
        </p>
      </section>

      {/* Types of Road Signs */}
      <section style={{ marginBottom: '40px' }}>
        <h2
          style={{
            fontSize: '1.875rem',
            marginBottom: '20px',
            color: '#1a1a1a',
            fontWeight: '600',
          }}
        >
          {t('signTypesTitle', { defaultValue: 'Types of Road Signs on the CDL Test' })}
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
            {t('regulatoryTitle', { defaultValue: 'Regulatory Signs (Red, White, Black)' })}
          </h3>
          <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
            {t('regulatoryContent', {
              defaultValue: `Regulatory signs inform drivers of traffic laws and regulations that must be obeyed. These include speed limit signs, stop signs, yield signs, do not enter signs, one-way signs, and no parking zones. Commercial drivers face severe penalties for violating regulatory signs, including CSA points, fines, and potential license suspension. Understanding weight limit signs, height restrictions, and truck route designations is especially crucial for CDL holders operating large commercial vehicles.`,
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
            {t('warningTitle', { defaultValue: 'Warning Signs (Yellow, Orange)' })}
          </h3>
          <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
            {t('warningContent', {
              defaultValue: `Warning signs alert drivers to potential hazards ahead and are typically diamond-shaped with black symbols on yellow backgrounds. For truck drivers, critical warning signs include steep grade warnings, sharp curve advisories, low clearance notifications, and narrow bridge alerts. Construction zone signs (orange) require special attention as work zones present increased risks for large vehicles. Speed advisory signs on curves and ramps are particularly important for preventing rollovers in high-center-of-gravity commercial vehicles.`,
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
            {t('guideTitle', { defaultValue: 'Guide Signs (Green, Blue, Brown)' })}
          </h3>
          <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
            {t('guideContent', {
              defaultValue: `Guide signs provide directional and informational guidance to drivers. Green signs indicate highways, exits, and distances to cities. Blue signs mark services like rest areas, fuel stations, and hospitals - critical information for long-haul truckers planning mandatory breaks. Brown signs indicate recreational and cultural points of interest. Mile markers and exit numbers are essential for trip planning, emergency location reporting, and compliance with hours-of-service regulations.`,
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
            {t('railroadTitle', { defaultValue: 'Railroad Crossing Signs' })}
          </h3>
          <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
            {t('railroadContent', {
              defaultValue: `Railroad crossing signs are critical for commercial drivers, as trucks require significantly more time to clear tracks than passenger vehicles. The round yellow advance warning sign, crossbuck sign at the crossing, and pavement markings all require specific actions. CDL drivers must know when to stop (carrying passengers or hazmat), required stopping distances (15-50 feet from nearest rail), and proper crossing procedures. Violations at railroad crossings result in severe penalties and immediate disqualification from commercial driving.`,
            })}
          </p>
        </div>
      </section>

      {/* Special Considerations for CDL Drivers */}
      <section style={{ marginBottom: '40px' }}>
        <h2
          style={{
            fontSize: '1.875rem',
            marginBottom: '20px',
            color: '#1a1a1a',
            fontWeight: '600',
          }}
        >
          {t('specialConsiderationsTitle', {
            defaultValue: 'Special Sign Considerations for Commercial Drivers',
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
            {t('hazmatTitle', { defaultValue: 'Hazmat Route Signs' })}
          </h3>
          <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
            {t('hazmatContent', {
              defaultValue: `Drivers with hazmat endorsements must recognize and comply with hazardous materials route signs. These include designated hazmat routes, prohibited routes through tunnels or populated areas, and required stops at inspection stations. Understanding placard requirements and restrictions is essential for legal compliance and public safety. Violations can result in substantial fines, license revocation, and criminal charges.`,
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
            {t('weighStationTitle', { defaultValue: 'Weigh Station and Inspection Signs' })}
          </h3>
          <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
            {t('weighStationContent', {
              defaultValue: `Commercial vehicles must stop at open weigh stations unless they have bypass authorization through programs like PrePass or Drivewyze. Signs indicating "All Trucks Must Exit" or "Commercial Vehicles Next Right" are mandatory. Failing to stop at required inspection points results in significant fines and CSA violations. Understanding advance warning signs helps drivers prepare for safe lane changes in heavy traffic.`,
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
            {t('gradeSteepnessTitle', { defaultValue: 'Grade and Speed Signs' })}
          </h3>
          <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
            {t('gradeSteepnessContent', {
              defaultValue: `Steep grade warning signs are crucial for truck safety, indicating the percentage of grade and often the length of the descent. A 6% grade means the road drops 6 feet for every 100 feet of travel. Commercial drivers must understand how to interpret these signs and adjust their speed and gear selection accordingly. Runaway truck ramps signs indicate emergency escape routes for vehicles experiencing brake failure on steep descents.`,
            })}
          </p>
        </div>
      </section>

      {/* Test Preparation Tips */}
      <section style={{ marginBottom: '40px' }}>
        <h2
          style={{
            fontSize: '1.875rem',
            marginBottom: '20px',
            color: '#1a1a1a',
            fontWeight: '600',
          }}
        >
          {t('testPrepTitle', { defaultValue: 'CDL Road Signs Test Preparation Tips' })}
        </h2>
        <ul style={{ color: '#4b5563', lineHeight: '1.8', paddingLeft: '24px' }}>
          <li style={{ marginBottom: '12px' }}>
            {t('tip1', {
              defaultValue:
                'Study sign shapes and colors first - they convey meaning even when text is obscured by weather or distance',
            })}
          </li>
          <li style={{ marginBottom: '12px' }}>
            {t('tip2', {
              defaultValue:
                'Focus on signs specific to commercial vehicles including weight limits, height restrictions, and truck routes',
            })}
          </li>
          <li style={{ marginBottom: '12px' }}>
            {t('tip3', {
              defaultValue:
                'Practice identifying signs quickly - on the actual CDL test, you have limited time per question',
            })}
          </li>
          <li style={{ marginBottom: '12px' }}>
            {t('tip4', {
              defaultValue:
                'Learn the difference between warning signs (yellow) and temporary construction signs (orange)',
            })}
          </li>
          <li style={{ marginBottom: '12px' }}>
            {t('tip5', {
              defaultValue:
                'Memorize railroad crossing procedures and which vehicles must always stop at tracks',
            })}
          </li>
          <li style={{ marginBottom: '12px' }}>
            {t('tip6', {
              defaultValue:
                'Understand international symbols used on signs as they are becoming more common',
            })}
          </li>
          <li style={{ marginBottom: '12px' }}>
            {t('tip7', {
              defaultValue: 'Review state-specific signs that may appear on your local CDL exam',
            })}
          </li>
        </ul>
      </section>

      {/* Common Mistakes to Avoid */}
      <section style={{ marginBottom: '40px' }}>
        <h2
          style={{
            fontSize: '1.875rem',
            marginBottom: '20px',
            color: '#1a1a1a',
            fontWeight: '600',
          }}
        >
          {t('mistakesTitle', { defaultValue: 'Common Mistakes to Avoid' })}
        </h2>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '12px' }}>
            <strong>{t('mistake1Title', { defaultValue: 'Confusing Similar Signs:' })}</strong>{' '}
            {t('mistake1Content', {
              defaultValue:
                'Many drivers confuse "No Passing Zone" with "Do Not Pass" signs, or mix up "Yield" and "Stop" sign requirements. Each has distinct legal meanings and required actions.',
            })}
          </p>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '12px' }}>
            <strong>{t('mistake2Title', { defaultValue: 'Ignoring Advisory Speeds:' })}</strong>{' '}
            {t('mistake2Content', {
              defaultValue:
                'Yellow speed signs on curves and ramps are recommendations for ideal conditions. Commercial vehicles often need to travel below these speeds, especially when loaded or in adverse weather.',
            })}
          </p>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '12px' }}>
            <strong>
              {t('mistake3Title', { defaultValue: 'Misunderstanding Clearance Signs:' })}
            </strong>{' '}
            {t('mistake3Content', {
              defaultValue:
                'Height clearance signs show the lowest point, but drivers must account for load shift, tire pressure, and road crown. Always maintain at least 3 inches of clearance.',
            })}
          </p>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
            <strong>{t('mistake4Title', { defaultValue: 'Missing Combination Signs:' })}</strong>{' '}
            {t('mistake4Content', {
              defaultValue:
                'Some signs work in combination, like advance warning signs followed by the actual hazard. Understanding the relationship between signs is crucial for proper response.',
            })}
          </p>
        </div>
      </section>

      {/* Benefits of Practice */}
      <section style={{ marginBottom: '40px' }}>
        <h2
          style={{
            fontSize: '1.875rem',
            marginBottom: '20px',
            color: '#1a1a1a',
            fontWeight: '600',
          }}
        >
          {t('benefitsTitle', { defaultValue: 'Benefits of Regular Road Signs Practice' })}
        </h2>
        <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '16px' }}>
          {t('benefitsContent1', {
            defaultValue: `Regular practice with road signs tests improves recognition speed and accuracy, essential skills for both passing the CDL exam and safe commercial driving. Studies show that drivers who complete multiple practice tests score 23% higher on average than those who only study manuals. Interactive testing reinforces visual memory, making sign recognition automatic rather than requiring conscious thought while driving.`,
          })}
        </p>
        <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
          {t('benefitsContent2', {
            defaultValue: `Beyond test preparation, mastering road signs enhances overall driving safety and professionalism. Quick, accurate sign recognition allows drivers to make timely decisions, maintain smooth traffic flow, and avoid last-minute maneuvers that could endanger other motorists. For commercial drivers, this expertise translates to fewer violations, lower insurance costs, better CSA scores, and increased employment opportunities with safety-conscious carriers.`,
          })}
        </p>
      </section>
    </div>
  );
};
