import React from 'react';
import { useTranslation } from 'next-i18next';

// SEO-optimized content sections for school pages
export const SchoolPageSEOContent = ({ type, state, city, locale }) => {
  const { t } = useTranslation('school-seo-content');

  const stateFormatted = state?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const cityFormatted = city?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  if (type === 'state') {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* State-specific CDL information */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.875rem', marginBottom: '20px', color: '#1a1a1a' }}>
            {t('cdlRequirementsTitle', {
              state: stateFormatted,
              defaultValue: `CDL Requirements in ${stateFormatted}`,
            })}
          </h2>
          <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '16px' }}>
            {t('cdlRequirementsContent', {
              state: stateFormatted,
              defaultValue: `Getting your Commercial Driver's License (CDL) in ${stateFormatted} requires meeting federal and state-specific requirements. All CDL applicants must be at least 18 years old for intrastate driving or 21 years old for interstate commerce. You'll need to pass a Department of Transportation (DOT) physical examination, obtain a Commercial Learner's Permit (CLP), and complete Entry-Level Driver Training (ELDT) from a registered provider.`,
            })}
          </p>
          <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '16px' }}>
            {t('cdlTestingProcess', {
              state: stateFormatted,
              defaultValue: `The ${stateFormatted} CDL testing process includes three main components: the General Knowledge test, combination vehicles test (for Class A), and air brakes test if your vehicle is equipped with air brakes. Additionally, you may need endorsement tests for specific vehicle types including Passenger (P), School Bus (S), Tanker (N), Hazmat (H), or Doubles/Triples (T). Each endorsement requires passing a specialized knowledge test, and some require additional skills demonstrations.`,
            })}
          </p>
        </section>

        {/* CDL Classes Information */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.875rem', marginBottom: '20px', color: '#1a1a1a' }}>
            {t('cdlClassesTitle', { defaultValue: 'CDL License Classes Available' })}
          </h2>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: '#374151' }}>
              {t('classATitle', { defaultValue: 'Class A CDL' })}
            </h3>
            <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
              {t('classAContent', {
                defaultValue: `A Class A CDL allows you to operate combination vehicles with a Gross Combination Weight Rating (GCWR) of 26,001 pounds or more, provided the vehicle being towed weighs more than 10,000 pounds. This includes tractor-trailers, truck and trailer combinations, tanker vehicles, livestock carriers, and flatbeds. Class A drivers can also operate Class B and Class C vehicles.`,
              })}
            </p>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: '#374151' }}>
              {t('classBTitle', { defaultValue: 'Class B CDL' })}
            </h3>
            <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
              {t('classBContent', {
                defaultValue: `A Class B CDL permits operation of single vehicles with a GVWR of 26,001 pounds or more, or towing a vehicle not heavier than 10,000 pounds. Common Class B vehicles include straight trucks, large buses, segmented buses, box trucks, dump trucks with small trailers, and tractor-trailers where the trailer weighs less than 10,000 pounds.`,
              })}
            </p>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: '#374151' }}>
              {t('classCTitle', { defaultValue: 'Class C CDL' })}
            </h3>
            <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
              {t('classCContent', {
                defaultValue: `A Class C CDL is required for vehicles that don't meet Class A or B requirements but are designed to transport 16 or more passengers (including the driver) or carry hazardous materials requiring placards. This includes passenger vans, small hazmat vehicles, and combination vehicles not covered by Classes A or B.`,
              })}
            </p>
          </div>
        </section>

        {/* Training Duration and Costs */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.875rem', marginBottom: '20px', color: '#1a1a1a' }}>
            {t('trainingCostsTitle', {
              state: stateFormatted,
              defaultValue: `CDL Training Duration and Costs in ${stateFormatted}`,
            })}
          </h2>
          <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '16px' }}>
            {t('trainingDuration', {
              state: stateFormatted,
              defaultValue: `CDL training programs in ${stateFormatted} typically range from 3 to 8 weeks for full-time students, or 12 to 24 weeks for part-time programs. The duration depends on the license class, endorsements sought, and individual learning pace. Most schools offer flexible scheduling options including weekend and evening classes to accommodate working students.`,
            })}
          </p>
          <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
            {t('trainingCosts', {
              state: stateFormatted,
              defaultValue: `Training costs in ${stateFormatted} vary widely, typically ranging from $3,000 to $7,000 for comprehensive programs. Community colleges often offer more affordable options starting around $1,800, while private truck driving schools may charge up to $10,000 for accelerated programs with job placement assistance. Many schools offer financing options, payment plans, and some trucking companies provide paid CDL training programs where you commit to driving for them after graduation.`,
            })}
          </p>
        </section>

        {/* Career Opportunities */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.875rem', marginBottom: '20px', color: '#1a1a1a' }}>
            {t('careerTitle', {
              state: stateFormatted,
              defaultValue: `Truck Driving Career Opportunities in ${stateFormatted}`,
            })}
          </h2>
          <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '16px' }}>
            {t('careerContent', {
              state: stateFormatted,
              defaultValue: `${stateFormatted} offers diverse opportunities for CDL holders across multiple industries. Long-haul trucking positions offer the highest earning potential, with experienced drivers earning $70,000 to $100,000 annually. Regional and local delivery drivers enjoy better work-life balance with competitive salaries ranging from $50,000 to $75,000. Specialized positions such as hazmat transport, oversized load hauling, and tanker operations command premium wages due to additional skill requirements.`,
            })}
          </p>
          <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
            {t('industryDemand', {
              state: stateFormatted,
              defaultValue: `The trucking industry in ${stateFormatted} continues to experience strong demand for qualified drivers. Major sectors hiring CDL drivers include freight and logistics companies, construction firms, agricultural operations, retail distribution centers, and government agencies. Many companies offer signing bonuses, comprehensive benefits packages, and career advancement opportunities into roles such as driver trainers, safety managers, or fleet supervisors.`,
            })}
          </p>
        </section>
      </div>
    );
  }

  if (type === 'city') {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* City-specific CDL training information */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.875rem', marginBottom: '20px', color: '#1a1a1a' }}>
            {t('cityTrainingTitle', {
              city: cityFormatted,
              state: stateFormatted,
              defaultValue: `CDL Training in ${cityFormatted}, ${stateFormatted}`,
            })}
          </h2>
          <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '16px' }}>
            {t('cityTrainingContent', {
              city: cityFormatted,
              state: stateFormatted,
              defaultValue: `${cityFormatted} is home to several accredited CDL training schools that offer comprehensive programs designed to prepare students for successful careers in commercial driving. These schools provide hands-on training with modern equipment, experienced instructors certified by the state, and curricula that meet or exceed Federal Motor Carrier Safety Administration (FMCSA) Entry-Level Driver Training requirements.`,
            })}
          </p>
          <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
            {t('localAdvantages', {
              city: cityFormatted,
              defaultValue: `Training in ${cityFormatted} offers unique advantages including diverse road conditions for comprehensive driving experience, access to major highways and interstate routes, and proximity to industrial areas for real-world backing and maneuvering practice. Many schools maintain partnerships with local trucking companies, providing direct pathways to employment upon graduation.`,
            })}
          </p>
        </section>

        {/* What to Expect in CDL School */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.875rem', marginBottom: '20px', color: '#1a1a1a' }}>
            {t('whatToExpectTitle', { defaultValue: 'What to Expect in CDL School' })}
          </h2>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: '#374151' }}>
              {t('week1Title', { defaultValue: 'Week 1-2: Classroom Foundation' })}
            </h3>
            <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
              {t('week1Content', {
                defaultValue: `Your CDL training begins with intensive classroom instruction covering federal regulations, hours of service rules, trip planning, cargo handling, and safety procedures. You'll study for the CDL permit test, learning about vehicle systems, pre-trip inspections, and basic control maneuvers. This foundation is critical for both passing your exams and ensuring safe operation throughout your career.`,
              })}
            </p>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: '#374151' }}>
              {t('week2Title', { defaultValue: 'Week 3-4: Yard Skills Development' })}
            </h3>
            <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
              {t('week2Content', {
                defaultValue: `Training moves to the practice yard where you'll master essential maneuvers including straight-line backing, offset backing, parallel parking, and alley docking. Instructors guide you through coupling and uncoupling procedures, teaching proper techniques for connecting air lines, electrical cables, and fifth wheel operations. You'll practice pre-trip inspections until they become second nature.`,
              })}
            </p>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: '#374151' }}>
              {t('week3Title', { defaultValue: 'Week 5-6: Road Driving Experience' })}
            </h3>
            <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
              {t('week3Content', {
                defaultValue: `The final phase focuses on over-the-road driving experience. You'll navigate city streets, highways, and rural roads while learning proper shifting techniques, space management, and defensive driving strategies. Instructors help you develop skills in merging, lane changes, turns, and managing various traffic conditions. This real-world experience prepares you for the CDL road test and your future driving career.`,
              })}
            </p>
          </div>
        </section>

        {/* Job Market Information */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.875rem', marginBottom: '20px', color: '#1a1a1a' }}>
            {t('jobMarketTitle', {
              city: cityFormatted,
              defaultValue: `CDL Job Market in ${cityFormatted}`,
            })}
          </h2>
          <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '16px' }}>
            {t('jobMarketContent', {
              city: cityFormatted,
              defaultValue: `The commercial driving job market in ${cityFormatted} remains robust with consistent demand across multiple sectors. Entry-level CDL drivers can expect starting salaries between $45,000 and $60,000 annually, with experienced drivers earning significantly more. Local delivery positions offer predictable schedules and home-daily arrangements, while regional and OTR positions provide higher earning potential and travel opportunities.`,
            })}
          </p>
          <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
            {t('topEmployers', {
              city: cityFormatted,
              defaultValue: `Major employers in the ${cityFormatted} area include national freight carriers, regional trucking companies, construction firms, waste management services, and food distribution companies. Many offer comprehensive benefits including health insurance, retirement plans, paid time off, and performance bonuses. The growing e-commerce sector has created additional opportunities in last-mile delivery and dedicated route positions.`,
            })}
          </p>
        </section>

        {/* Tips for Choosing a School */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.875rem', marginBottom: '20px', color: '#1a1a1a' }}>
            {t('choosingSchoolTitle', { defaultValue: 'How to Choose the Right CDL School' })}
          </h2>
          <ul style={{ color: '#4b5563', lineHeight: '1.8', paddingLeft: '24px' }}>
            <li style={{ marginBottom: '12px' }}>
              {t('tip1', {
                defaultValue:
                  'Verify the school is listed on the FMCSA Training Provider Registry (TPR) to ensure ELDT compliance',
              })}
            </li>
            <li style={{ marginBottom: '12px' }}>
              {t('tip2', {
                defaultValue:
                  'Compare program duration, cost, and financing options including grants, loans, and company-sponsored training',
              })}
            </li>
            <li style={{ marginBottom: '12px' }}>
              {t('tip3', {
                defaultValue:
                  'Check student-to-instructor ratios and hands-on driving time to ensure adequate individual attention',
              })}
            </li>
            <li style={{ marginBottom: '12px' }}>
              {t('tip4', {
                defaultValue:
                  'Review job placement rates and partnerships with trucking companies for post-graduation employment',
              })}
            </li>
            <li style={{ marginBottom: '12px' }}>
              {t('tip5', {
                defaultValue:
                  'Ask about equipment condition and variety to ensure training on modern, well-maintained vehicles',
              })}
            </li>
            <li style={{ marginBottom: '12px' }}>
              {t('tip6', {
                defaultValue:
                  'Inquire about refresher training and additional endorsement programs for future skill development',
              })}
            </li>
          </ul>
        </section>
      </div>
    );
  }

  return null;
};

// Main schools list page SEO content
export const SchoolsMainPageSEOContent = ({ locale }) => {
  const { t } = useTranslation('school-seo-content');

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Introduction to CDL Schools */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.875rem', marginBottom: '20px', color: '#1a1a1a' }}>
          {t('mainIntroTitle', { defaultValue: 'Find the Best CDL Training Schools Near You' })}
        </h2>
        <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '16px' }}>
          {t('mainIntroContent', {
            defaultValue: `Starting your career as a professional truck driver begins with choosing the right CDL training school. Our comprehensive directory connects you with accredited truck driving schools across the United States, helping you find programs that match your schedule, budget, and career goals. Whether you're seeking a Class A, Class B, or Class C license, we provide detailed information about schools offering Entry-Level Driver Training (ELDT) compliant programs.`,
          })}
        </p>
        <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
          {t('mainIntroContent2', {
            defaultValue: `The trucking industry offers stable, well-paying careers with opportunities for growth and independence. With the ongoing driver shortage, qualified CDL holders are in high demand, enjoying competitive salaries, comprehensive benefits, and diverse career paths. From local delivery routes to cross-country freight hauling, your CDL opens doors to numerous opportunities in transportation, logistics, and specialized driving positions.`,
          })}
        </p>
      </section>

      {/* Types of CDL Training Programs */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.875rem', marginBottom: '20px', color: '#1a1a1a' }}>
          {t('programTypesTitle', { defaultValue: 'Types of CDL Training Programs' })}
        </h2>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: '#374151' }}>
            {t('companyProgramTitle', { defaultValue: 'Company-Sponsored Training' })}
          </h3>
          <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
            {t('companyProgramContent', {
              defaultValue: `Many trucking companies offer paid CDL training programs where you earn while you learn. These programs typically last 3-4 weeks and require a commitment to work for the company for a specified period (usually 12-24 months) after obtaining your CDL. Company-sponsored training often includes no upfront costs, guaranteed employment, and mentorship programs for new drivers.`,
            })}
          </p>
        </div>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: '#374151' }}>
            {t('communityCollegeTitle', { defaultValue: 'Community College Programs' })}
          </h3>
          <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
            {t('communityCollegeContent', {
              defaultValue: `Community colleges offer comprehensive CDL programs at affordable rates, often with financial aid options available. These programs typically run 8-12 weeks and provide thorough training without employment obligations. Students benefit from established educational infrastructure, certified instructors, and often have access to career services for job placement assistance.`,
            })}
          </p>
        </div>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: '#374151' }}>
            {t('privateSchoolTitle', { defaultValue: 'Private Truck Driving Schools' })}
          </h3>
          <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
            {t('privateSchoolContent', {
              defaultValue: `Private CDL schools offer flexible scheduling and accelerated programs designed to get you licensed quickly. While typically more expensive than other options, these schools often provide one-on-one instruction, modern equipment, and high pass rates. Many offer weekend and evening classes, making them ideal for students who need to maintain employment while training.`,
            })}
          </p>
        </div>
      </section>

      {/* ELDT Requirements */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.875rem', marginBottom: '20px', color: '#1a1a1a' }}>
          {t('eldtTitle', { defaultValue: 'Understanding ELDT Requirements' })}
        </h2>
        <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '16px' }}>
          {t('eldtContent', {
            defaultValue: `As of February 7, 2022, all new CDL applicants must complete Entry-Level Driver Training (ELDT) from a registered training provider listed on the FMCSA's Training Provider Registry. This federal mandate ensures all new drivers receive standardized, comprehensive training covering both theory and behind-the-wheel instruction. ELDT applies to those seeking a Class A or Class B CDL for the first time, upgrading from Class B to Class A, or obtaining hazmat, passenger, or school bus endorsements.`,
          })}
        </p>
        <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
          {t('eldtComponents', {
            defaultValue: `ELDT consists of theory and behind-the-wheel training components with no minimum hour requirements. Theory instruction covers basic operation, safe operating procedures, advanced operations, vehicle systems, and non-driving activities. Behind-the-wheel training includes vehicle inspection pre-trip/enroute/post-trip, basic vehicle control skills, and on-road driving. Training providers must verify proficiency in all required topics before certifying completion.`,
          })}
        </p>
      </section>

      {/* Financial Assistance */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.875rem', marginBottom: '20px', color: '#1a1a1a' }}>
          {t('financialTitle', { defaultValue: 'Financing Your CDL Training' })}
        </h2>
        <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '16px' }}>
          {t('financialContent', {
            defaultValue: `CDL training is an investment in your future, and various financing options make it accessible regardless of your current financial situation. Federal financial aid through FAFSA may be available for programs at accredited institutions. Workforce Innovation and Opportunity Act (WIOA) grants provide funding for eligible individuals seeking career training. Veterans can use GI Bill benefits for approved CDL programs, often covering full tuition and providing housing allowances.`,
          })}
        </p>
        <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
          {t('financialOptions', {
            defaultValue: `Additional financing options include private student loans, payment plans offered directly by schools, and employer tuition reimbursement programs. Some states offer specific grants or scholarships for CDL training to address driver shortages. Research all available options and compare terms carefully. Remember that company-sponsored training programs eliminate upfront costs in exchange for a driving commitment, making them an excellent option for those unable to secure traditional financing.`,
          })}
        </p>
      </section>
    </div>
  );
};
