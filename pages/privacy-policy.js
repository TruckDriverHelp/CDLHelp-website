import React from 'react';
import Head from 'next/head';
import PageBannerStyle1 from '../components/Common/PageBannerStyle1';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import getMeta from '../lib/getMeta';
import Navbar from '../components/_App/Navbar';
import Footer from '../components/_App/Footer';
import Layout from '../components/_App/Layout';

const PrivacyPolicy = ({ meta }) => {
  const { locale } = useRouter();

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'PrivacyPolicy',
    name: meta.title,
    description: meta.description,
    url: `https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/privacy-policy`,
    inLanguage: locale,
    publisher: {
      '@type': 'Organization',
      name: 'CDL Help',
      url: 'https://www.cdlhelp.com',
    },
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />

        {/* Google / Search Engine Tags */}
        <meta itemProp="name" content={meta.title} />
        <meta itemProp="description" content={meta.description} />
        <meta itemProp="image" content={'/images/truckdriverhelp-og.jpg'} />

        {/* Facebook Meta Tags */}
        <meta property="og:url" content="https://www.cdlhelp.com" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={'/images/truckdriverhelp-og.jpg'} />
        <meta property="og:locale" content={locale} />
        <meta property="og:site_name" content="CDL Help" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={'/images/truckdriverhelp-og.jpg'} />

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
        />
      </Head>

      <Layout>
        <Navbar />
        <PageBannerStyle1
          pageTitle="Privacy Policy"
          homePageUrl="/"
          homePageText="Home"
          activePageText="Privacy Policy"
        />

        <div className="privacy-policy-area ptb-100">
          <div className="container">
            <div className="privacy-policy-content">
              <h1>Privacy Policy</h1>
              <p>Last updated: September 19, 2024</p>
              <p>
                This Privacy Policy describes Our policies and procedures on the collection, use and
                disclosure of Your information when You use the Service and tells You about Your
                privacy rights and how the law protects You.
              </p>
              <p>
                We use Your Personal data to provide and improve the Service. By using the Service,
                You agree to the collection and use of information in accordance with this Privacy
                Policy.
              </p>
              <h2>Interpretation and Definitions</h2>
              <h3>Interpretation</h3>
              <p>
                The words of which the initial letter is capitalized have meanings defined under the
                following conditions. The following definitions shall have the same meaning
                regardless of whether they appear in singular or in plural.
              </p>
              <h3>Definitions</h3>
              <p>For the purposes of this Privacy Policy:</p>
              <ul>
                <li>
                  <p>
                    <strong>Account</strong> means a unique account created for You to access our
                    Service or parts of our Service.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Affiliate</strong> means an entity that controls, is controlled by or is
                    under common control with a party, where &quot;control&quot; means ownership of
                    50% or more of the shares, equity interest or other securities entitled to vote
                    for election of directors or other managing authority.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Application</strong> refers to CDL Help, the software program provided
                    by the Company.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Business</strong>, for the purpose of CCPA/CPRA, refers to the Company
                    as the legal entity that collects Consumers&apos; personal information and
                    determines the purposes and means of the processing of Consumers&apos; personal
                    information, or on behalf of which such information is collected and that alone,
                    or jointly with others, determines the purposes and means of the processing of
                    consumers&apos; personal information, that does business in the State of
                    California.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>CCPA</strong> and/or <strong>CPRA</strong> refers to the California
                    Consumer Privacy Act (the &quot;CCPA&quot;) as amended by the California Privacy
                    Rights Act of 2020 (the &quot;CPRA&quot;).
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Company</strong> (referred to as either &quot;the Company&quot;,
                    &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to
                    TruckDriver.help llc, 4636 Cason Cove Drive.
                  </p>
                  <p>For the purpose of the GDPR, the Company is the Data Controller.</p>
                </li>
                <li>
                  <p>
                    <strong>Consumer</strong>, for the purpose of the CCPA/CPRA, means a natural
                    person who is a California resident. A resident, as defined in the law, includes
                    (1) every individual who is in the USA for other than a temporary or transitory
                    purpose, and (2) every individual who is domiciled in the USA who is outside the
                    USA for a temporary or transitory purpose.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Country</strong> refers to: Florida, United States
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Data Controller</strong>, for the purposes of the GDPR (General Data
                    Protection Regulation), refers to the Company as the legal person which alone or
                    jointly with others determines the purposes and means of the processing of
                    Personal Data.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Device</strong> means any device that can access the Service such as a
                    computer, a cellphone or a digital tablet.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Do Not Track</strong> (DNT) is a concept that has been promoted by US
                    regulatory authorities, in particular the U.S. Federal Trade Commission (FTC),
                    for the Internet industry to develop and implement a mechanism for allowing
                    internet users to control the tracking of their online activities across
                    websites.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>GDPR</strong> refers to EU General Data Protection Regulation.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Personal Data</strong> is any information that relates to an identified
                    or identifiable individual.
                  </p>
                  <p>
                    For the purposes of GDPR, Personal Data means any information relating to You
                    such as a name, an identification number, location data, online identifier or to
                    one or more factors specific to the physical, physiological, genetic, mental,
                    economic, cultural or social identity.
                  </p>
                  <p>
                    For the purposes of the CCPA/CPRA, Personal Data means any information that
                    identifies, relates to, describes or is capable of being associated with, or
                    could reasonably be linked, directly or indirectly, with You.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Service</strong> refers to the Application.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Service Provider</strong> means any natural or legal person who
                    processes the data on behalf of the Company. It refers to third-party companies
                    or individuals employed by the Company to facilitate the Service, to provide the
                    Service on behalf of the Company, to perform services related to the Service or
                    to assist the Company in analyzing how the Service is used. For the purpose of
                    the GDPR, Service Providers are considered Data Processors.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Third-party Social Media Service</strong> refers to any website or any
                    social network website through which a User can log in or create an account to
                    use the Service.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Usage Data</strong> refers to data collected automatically, either
                    generated by the use of the Service or from the Service infrastructure itself
                    (for example, the duration of a page visit).
                  </p>
                </li>
                <li>
                  <p>
                    <strong>You</strong> means the individual accessing or using the Service, or the
                    company, or other legal entity on behalf of which such individual is accessing
                    or using the Service, as applicable.
                  </p>
                  <p>
                    Under GDPR, You can be referred to as the Data Subject or as the User as you are
                    the individual using the Service.
                  </p>
                </li>
              </ul>
              <h2>Collecting and Using Your Personal Data</h2>
              <h3>Types of Data Collected</h3>
              <h4>Personal Data</h4>
              <p>
                While using Our Service, We may ask You to provide Us with certain personally
                identifiable information that can be used to contact or identify You. Personally
                identifiable information may include, but is not limited to:
              </p>
              <ul>
                <li>
                  <p>Email address</p>
                </li>
                <li>
                  <p>First name and last name</p>
                </li>
                <li>
                  <p>Address, State, Province, ZIP/Postal code, City</p>
                </li>
                <li>
                  <p>Usage Data</p>
                </li>
              </ul>
              <h4>Usage Data</h4>
              <p>Usage Data is collected automatically when using the Service.</p>
              <p>
                Usage Data may include information such as Your Device&apos;s Internet Protocol
                address (e.g. IP address), browser type, browser version, the pages of our Service
                that You visit, the time and date of Your visit, the time spent on those pages,
                unique device identifiers and other diagnostic data.
              </p>
              <p>
                When You access the Service by or through a mobile device, We may collect certain
                information automatically, including, but not limited to, the type of mobile device
                You use, Your mobile device unique ID, the IP address of Your mobile device, Your
                mobile operating system, the type of mobile Internet browser You use, unique device
                identifiers and other diagnostic data.
              </p>
              <p>
                We may also collect information that Your browser sends whenever You visit our
                Service or when You access the Service by or through a mobile device.
              </p>
              <h4>Information from Third-Party Social Media Services</h4>
              <p>
                The Company allows You to create an account and log in to use the Service through
                the following Third-party Social Media Services:
              </p>
              <ul>
                <li>Google</li>
                <li>Facebook</li>
                <li>Instagram</li>
                <li>Twitter</li>
                <li>LinkedIn</li>
              </ul>
              <p>
                If You decide to register through or otherwise grant us access to a Third-Party
                Social Media Service, We may collect Personal data that is already associated with
                Your Third-Party Social Media Service&apos;s account, such as Your name, Your email
                address, Your activities or Your contact list associated with that account.
              </p>
              <p>
                You may also have the option of sharing additional information with the Company
                through Your Third-Party Social Media Service&apos;s account. If You choose to
                provide such information and Personal Data, during registration or otherwise, You
                are giving the Company permission to use, share, and store it in a manner consistent
                with this Privacy Policy.
              </p>
              <h4>Information Collected while Using the Application</h4>
              <p>
                While using Our Application, in order to provide features of Our Application, We may
                collect, with Your prior permission:
              </p>
              <ul>
                <li>Information regarding your location</li>
              </ul>
              <p>
                We use this information to provide features of Our Service, to improve and customize
                Our Service. The information may be uploaded to the Company&apos;s servers and/or a
                Service Provider&apos;s server or it may be simply stored on Your device.
              </p>
              <p>
                You can enable or disable access to this information at any time, through Your
                Device settings.
              </p>
              <h3>Use of Your Personal Data</h3>
              <p>The Company may use Personal Data for the following purposes:</p>
              <ul>
                <li>
                  <strong>To provide and maintain our Service</strong>, including to monitor the
                  usage of our Service.
                </li>
                <li>
                  <strong>To manage Your Account:</strong> to manage Your registration as a user of
                  the Service. The Personal Data You provide can give You access to different
                  functionalities of the Service that are available to You as a registered user.
                </li>
                <li>
                  <strong>For the performance of a contract:</strong> the development, compliance
                  and undertaking of the purchase contract for the products, items or services You
                  have purchased or of any other contract with Us through the Service.
                </li>
                <li>
                  <strong>To contact You:</strong> To contact You by email, telephone calls, SMS, or
                  other equivalent forms of electronic communication, such as a mobile
                  application&apos;s push notifications regarding updates or informative
                  communications related to the functionalities, products or contracted services,
                  including the security updates, when necessary or reasonable for their
                  implementation.
                </li>
                <li>
                  <strong>To provide You</strong> with news, special offers and general information
                  about other goods, services and events which we offer that are similar to those
                  that you have already purchased or enquired about unless You have opted not to
                  receive such information.
                </li>
                <li>
                  <strong>To manage Your requests:</strong> To attend and manage Your requests to
                  Us.
                </li>
                <li>
                  <strong>To deliver targeted advertising to You</strong>: We may use Your
                  information to develop and display content and advertising (and work with
                  third-party vendors who do so) tailored to Your interests and/or location and to
                  measure its effectiveness.
                </li>
                <li>
                  <strong>For business transfers:</strong> We may use Your information to evaluate
                  or conduct a merger, divestiture, restructuring, reorganization, dissolution, or
                  other sale or transfer of some or all of Our assets, whether as a going concern or
                  as part of bankruptcy, liquidation, or similar proceeding, in which Personal Data
                  held by Us about our Service users is among the assets transferred.
                </li>
                <li>
                  <strong>For other purposes</strong>: We may use Your information for other
                  purposes, such as data analysis, identifying usage trends, determining the
                  effectiveness of our promotional campaigns and to evaluate and improve our
                  Service, products, services, marketing and your experience.
                </li>
              </ul>
              <p>We may share Your personal information in the following situations:</p>
              <ul>
                <li>
                  <strong>With Service Providers:</strong> We may share Your personal information
                  with Service Providers to monitor and analyze the use of our Service, to advertise
                  on third party websites to You after You visited our Service, for payment
                  processing, to contact You.
                </li>
                <li>
                  <strong>For business transfers:</strong> We may share or transfer Your personal
                  information in connection with, or during negotiations of, any merger, sale of
                  Company assets, financing, or acquisition of all or a portion of Our business to
                  another company.
                </li>
                <li>
                  <strong>With Affiliates:</strong> We may share Your information with Our
                  affiliates, in which case we will require those affiliates to honor this Privacy
                  Policy. Affiliates include Our parent company and any other subsidiaries, joint
                  venture partners or other companies that We control or that are under common
                  control with Us.
                </li>
                <li>
                  <strong>With business partners:</strong> We may share Your information with Our
                  business partners to offer You certain products, services or promotions.
                </li>
                <li>
                  <strong>With other users:</strong> when You share personal information or
                  otherwise interact in the public areas with other users, such information may be
                  viewed by all users and may be publicly distributed outside. If You interact with
                  other users or register through a Third-Party Social Media Service, Your contacts
                  on the Third-Party Social Media Service may see Your name, profile, pictures and
                  description of Your activity. Similarly, other users will be able to view
                  descriptions of Your activity, communicate with You and view Your profile.
                </li>
                <li>
                  <strong>With Your consent</strong>: We may disclose Your personal information for
                  any other purpose with Your consent.
                </li>
              </ul>
              <h3>Retention of Your Personal Data</h3>
              <p>
                The Company will retain Your Personal Data only for as long as is necessary for the
                purposes set out in this Privacy Policy. We will retain and use Your Personal Data
                to the extent necessary to comply with our legal obligations (for example, if we are
                required to retain your data to comply with applicable laws), resolve disputes, and
                enforce our legal agreements and policies.
              </p>
              <p>
                The Company will also retain Usage Data for internal analysis purposes. Usage Data
                is generally retained for a shorter period of time, except when this data is used to
                strengthen the security or to improve the functionality of Our Service, or We are
                legally obligated to retain this data for longer time periods.
              </p>
              <h3>Transfer of Your Personal Data</h3>
              <p>
                Your information, including Personal Data, is processed at the Company&apos;s
                operating offices and in any other places where the parties involved in the
                processing are located. It means that this information may be transferred to — and
                maintained on — computers located outside of Your state, province, country or other
                governmental jurisdiction where the data protection laws may differ than those from
                Your jurisdiction.
              </p>
              <p>
                Your consent to this Privacy Policy followed by Your submission of such information
                represents Your agreement to that transfer.
              </p>
              <p>
                The Company will take all steps reasonably necessary to ensure that Your data is
                treated securely and in accordance with this Privacy Policy and no transfer of Your
                Personal Data will take place to an organization or a country unless there are
                adequate controls in place including the security of Your data and other personal
                information.
              </p>
              <h3>Delete Your Personal Data</h3>
              <p>
                You have the right to delete or request that We assist in deleting the Personal Data
                that We have collected about You.
              </p>
              <p>
                Our Service may give You the ability to delete certain information about You from
                within the Service.
              </p>
              <p>
                You may update, amend, or delete Your information at any time by signing in to Your
                Account, if you have one, and visiting the account settings section that allows you
                to manage Your personal information. You may also contact Us to request access to,
                correct, or delete any personal information that You have provided to Us.
              </p>
              <p>
                Please note, however, that We may need to retain certain information when we have a
                legal obligation or lawful basis to do so.
              </p>
              <h3>Disclosure of Your Personal Data</h3>
              <h4>Business Transactions</h4>
              <p>
                If the Company is involved in a merger, acquisition or asset sale, Your Personal
                Data may be transferred. We will provide notice before Your Personal Data is
                transferred and becomes subject to a different Privacy Policy.
              </p>
              <h4>Law enforcement</h4>
              <p>
                Under certain circumstances, the Company may be required to disclose Your Personal
                Data if required to do so by law or in response to valid requests by public
                authorities (e.g. a court or a government agency).
              </p>
              <h4>Other legal requirements</h4>
              <p>
                The Company may disclose Your Personal Data in the good faith belief that such
                action is necessary to:
              </p>
              <ul>
                <li>Comply with a legal obligation</li>
                <li>Protect and defend the rights or property of the Company</li>
                <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
                <li>Protect the personal safety of Users of the Service or the public</li>
                <li>Protect against legal liability</li>
              </ul>
              <h3>Security of Your Personal Data</h3>
              <p>
                The security of Your Personal Data is important to Us, but remember that no method
                of transmission over the Internet, or method of electronic storage is 100% secure.
                While We strive to use commercially acceptable means to protect Your Personal Data,
                We cannot guarantee its absolute security.
              </p>
              <h2>Detailed Information on the Processing of Your Personal Data</h2>
              <p>
                The Service Providers We use may have access to Your Personal Data. These
                third-party vendors collect, store, use, process and transfer information about Your
                activity on Our Service in accordance with their Privacy Policies.
              </p>
              <h3>Analytics</h3>
              <p>
                We may use third-party Service providers to monitor and analyze the use of our
                Service.
              </p>
              <ul>
                <li>
                  <p>
                    <strong>Google Analytics</strong>
                  </p>
                  <p>
                    Google Analytics is a web analytics service offered by Google that tracks and
                    reports website traffic. Google uses the data collected to track and monitor the
                    use of our Service. This data is shared with other Google services. Google may
                    use the collected data to contextualize and personalize the ads of its own
                    advertising network.
                  </p>
                  <p>
                    You may opt-out of certain Google Analytics features through your mobile device
                    settings, such as your device advertising settings or by following the
                    instructions provided by Google in their Privacy Policy:{' '}
                    <a
                      href="https://policies.google.com/privacy"
                      rel="external nofollow noopener noreferrer"
                      target="_blank"
                    >
                      https://policies.google.com/privacy
                    </a>
                  </p>
                  <p>
                    For more information on the privacy practices of Google, please visit the Google
                    Privacy &amp; Terms web page:{' '}
                    <a
                      href="https://policies.google.com/privacy"
                      rel="external nofollow noopener noreferrer"
                      target="_blank"
                    >
                      https://policies.google.com/privacy
                    </a>
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Firebase</strong>
                  </p>
                  <p>Firebase is an analytics service provided by Google Inc.</p>
                  <p>
                    You may opt-out of certain Firebase features through your mobile device
                    settings, such as your device advertising settings or by following the
                    instructions provided by Google in their Privacy Policy:{' '}
                    <a
                      href="https://policies.google.com/privacy"
                      rel="external nofollow noopener noreferrer"
                      target="_blank"
                    >
                      https://policies.google.com/privacy
                    </a>
                  </p>
                  <p>
                    We also encourage you to review the Google&apos;s policy for safeguarding your
                    data:{' '}
                    <a
                      href="https://support.google.com/analytics/answer/6004245"
                      rel="external nofollow noopener noreferrer"
                      target="_blank"
                    >
                      https://support.google.com/analytics/answer/6004245
                    </a>
                  </p>
                  <p>
                    For more information on what type of information Firebase collects, please visit
                    the How Google uses data when you use our partners&apos; sites or apps webpage:{' '}
                    <a
                      href="https://policies.google.com/technologies/partner-sites"
                      rel="external nofollow noopener noreferrer"
                      target="_blank"
                    >
                      https://policies.google.com/technologies/partner-sites
                    </a>
                  </p>
                </li>
              </ul>
              <h3>Email Marketing</h3>
              <p>
                We may use Your Personal Data to contact You with newsletters, marketing or
                promotional materials and other information that may be of interest to You. You may
                opt-out of receiving any, or all, of these communications from Us by following the
                unsubscribe link or instructions provided in any email We send or by contacting Us.
              </p>
              <p>We may use Email Marketing Service Providers to manage and send emails to You.</p>
              <ul>
                <li>
                  <p>
                    <strong>Mailchimp</strong>
                  </p>
                  <p>
                    Mailchimp is an email marketing sending service provided by The Rocket Science
                    Group LLC.
                  </p>
                  <p>
                    For more information on the privacy practices of Mailchimp, please visit their
                    Privacy policy:{' '}
                    <a
                      href="https://mailchimp.com/legal/privacy/"
                      rel="external nofollow noopener noreferrer"
                      target="_blank"
                    >
                      https://mailchimp.com/legal/privacy/
                    </a>
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Sendgrid</strong>
                  </p>
                  <p>
                    Their Privacy Policy can be viewed at{' '}
                    <a
                      href="https://sendgrid.com/en-us/policies/security"
                      rel="external nofollow noopener noreferrer"
                      target="_blank"
                    >
                      https://sendgrid.com/en-us/policies/security
                    </a>
                  </p>
                </li>
              </ul>
              <h3>Payments</h3>
              <p>
                We may provide paid products and/or services within the Service. In that case, we
                may use third-party services for payment processing (e.g. payment processors).
              </p>
              <p>
                We will not store or collect Your payment card details. That information is provided
                directly to Our third-party payment processors whose use of Your personal
                information is governed by their Privacy Policy. These payment processors adhere to
                the standards set by PCI-DSS as managed by the PCI Security Standards Council, which
                is a joint effort of brands like Visa, Mastercard, American Express and Discover.
                PCI-DSS requirements help ensure the secure handling of payment information.
              </p>
              <ul>
                <li>
                  <p>
                    <strong>Apple Store In-App Payments</strong>
                  </p>
                  <p>
                    Their Privacy Policy can be viewed at{' '}
                    <a
                      href="https://www.apple.com/legal/privacy/en-ww/"
                      rel="external nofollow noopener noreferrer"
                      target="_blank"
                    >
                      https://www.apple.com/legal/privacy/en-ww/
                    </a>
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Google Play In-App Payments</strong>
                  </p>
                  <p>
                    Their Privacy Policy can be viewed at{' '}
                    <a
                      href="https://www.google.com/policies/privacy/"
                      rel="external nofollow noopener noreferrer"
                      target="_blank"
                    >
                      https://www.google.com/policies/privacy/
                    </a>
                  </p>
                </li>
              </ul>
              <h3>Behavioral Remarketing</h3>
              <p>
                The Company uses remarketing services to advertise to You after You accessed or
                visited our Service. We and Our third-party vendors use cookies and non-cookie
                technologies to help Us recognize Your Device and understand how You use our Service
                so that We can improve our Service to reflect Your interests and serve You
                advertisements that are likely to be of more interest to You.
              </p>
              <p>
                These third-party vendors collect, store, use, process and transfer information
                about Your activity on Our Service in accordance with their Privacy Policies and to
                enable Us to:
              </p>
              <ul>
                <li>Measure and analyze traffic and browsing activity on Our Service</li>
                <li>
                  Show advertisements for our products and/or services to You on third-party
                  websites or apps
                </li>
                <li>Measure and analyze the performance of Our advertising campaigns</li>
              </ul>
              <p>
                Some of these third-party vendors may use non-cookie technologies that may not be
                impacted by browser settings that block cookies. Your browser may not permit You to
                block such technologies. You can use the following third-party tools to decline the
                collection and use of information for the purpose of serving You interest-based
                advertising:
              </p>
              <ul>
                <li>
                  The NAI&apos;s opt-out platform:{' '}
                  <a
                    href="http://www.networkadvertising.org/choices/"
                    rel="external nofollow noopener noreferrer"
                    target="_blank"
                  >
                    http://www.networkadvertising.org/choices/
                  </a>
                </li>
                <li>
                  The EDAA&apos;s opt-out platform{' '}
                  <a
                    href="http://www.youronlinechoices.com/"
                    rel="external nofollow noopener noreferrer"
                    target="_blank"
                  >
                    http://www.youronlinechoices.com/
                  </a>
                </li>
                <li>
                  The DAA&apos;s opt-out platform:{' '}
                  <a
                    href="http://optout.aboutads.info/?c=2&amp;lang=EN"
                    rel="external nofollow noopener noreferrer"
                    target="_blank"
                  >
                    http://optout.aboutads.info/?c=2&amp;lang=EN
                  </a>
                </li>
              </ul>
              <p>
                You may opt-out of all personalized advertising by enabling privacy features on Your
                mobile device such as Limit Ad Tracking (iOS) and Opt Out of Ads Personalization
                (Android). See Your mobile device Help system for more information.
              </p>
              <p>
                We may share information, such as hashed email addresses (if available) or other
                online identifiers collected on Our Service with these third-party vendors. This
                allows Our third-party vendors to recognize and deliver You ads across devices and
                browsers. To read more about the technologies used by these third-party vendors and
                their cross-device capabilities please refer to the Privacy Policy of each vendor
                listed below.
              </p>
              <p>The third-party vendors We use are:</p>
              <ul>
                <li>
                  <p>
                    <strong>Google Ads (AdWords)</strong>
                  </p>
                  <p>Google Ads (AdWords) remarketing service is provided by Google Inc.</p>
                  <p>
                    You can opt-out of Google Analytics for Display Advertising and customize the
                    Google Display Network ads by visiting the Google Ads Settings page:{' '}
                    <a
                      href="http://www.google.com/settings/ads"
                      rel="external nofollow noopener noreferrer"
                      target="_blank"
                    >
                      http://www.google.com/settings/ads
                    </a>
                  </p>
                  <p>
                    Google also recommends installing the Google Analytics Opt-out Browser Add-on -{' '}
                    <a
                      href="https://tools.google.com/dlpage/gaoptout"
                      rel="external nofollow noopener noreferrer"
                      target="_blank"
                    >
                      https://tools.google.com/dlpage/gaoptout
                    </a>{' '}
                    - for your web browser. Google Analytics Opt-out Browser Add-on provides
                    visitors with the ability to prevent their data from being collected and used by
                    Google Analytics.
                  </p>
                  <p>
                    For more information on the privacy practices of Google, please visit the Google
                    Privacy &amp; Terms web page:{' '}
                    <a
                      href="https://policies.google.com/privacy"
                      rel="external nofollow noopener noreferrer"
                      target="_blank"
                    >
                      https://policies.google.com/privacy
                    </a>
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Facebook</strong>
                  </p>
                  <p>Facebook remarketing service is provided by Facebook Inc.</p>
                  <p>
                    You can learn more about interest-based advertising from Facebook by visiting
                    this page:{' '}
                    <a
                      href="https://www.facebook.com/help/516147308587266"
                      rel="external nofollow noopener noreferrer"
                      target="_blank"
                    >
                      https://www.facebook.com/help/516147308587266
                    </a>
                  </p>
                  <p>
                    To opt-out from Facebook&apos;s interest-based ads, follow these instructions
                    from Facebook:{' '}
                    <a
                      href="https://www.facebook.com/help/568137493302217"
                      rel="external nofollow noopener noreferrer"
                      target="_blank"
                    >
                      https://www.facebook.com/help/568137493302217
                    </a>
                  </p>
                  <p>
                    Facebook adheres to the Self-Regulatory Principles for Online Behavioural
                    Advertising established by the Digital Advertising Alliance. You can also
                    opt-out from Facebook and other participating companies through the Digital
                    Advertising Alliance in the USA{' '}
                    <a
                      href="http://www.aboutads.info/choices/"
                      rel="external nofollow noopener noreferrer"
                      target="_blank"
                    >
                      http://www.aboutads.info/choices/
                    </a>
                    , the Digital Advertising Alliance of Canada in Canada{' '}
                    <a
                      href="http://youradchoices.ca/"
                      rel="external nofollow noopener noreferrer"
                      target="_blank"
                    >
                      http://youradchoices.ca/
                    </a>{' '}
                    or the European Interactive Digital Advertising Alliance in Europe{' '}
                    <a
                      href="http://www.youronlinechoices.eu/"
                      rel="external nofollow noopener noreferrer"
                      target="_blank"
                    >
                      http://www.youronlinechoices.eu/
                    </a>
                    , or opt-out using your mobile device settings.
                  </p>
                  <p>
                    For more information on the privacy practices of Facebook, please visit
                    Facebook&apos;s Data Policy:{' '}
                    <a
                      href="https://www.facebook.com/privacy/explanation"
                      rel="external nofollow noopener noreferrer"
                      target="_blank"
                    >
                      https://www.facebook.com/privacy/explanation
                    </a>
                  </p>
                </li>
              </ul>
              <h2>GDPR Privacy</h2>
              <h3>Legal Basis for Processing Personal Data under GDPR</h3>
              <p>We may process Personal Data under the following conditions:</p>
              <ul>
                <li>
                  <strong>Consent:</strong> You have given Your consent for processing Personal Data
                  for one or more specific purposes.
                </li>
                <li>
                  <strong>Performance of a contract:</strong> Provision of Personal Data is
                  necessary for the performance of an agreement with You and/or for any
                  pre-contractual obligations thereof.
                </li>
                <li>
                  <strong>Legal obligations:</strong> Processing Personal Data is necessary for
                  compliance with a legal obligation to which the Company is subject.
                </li>
                <li>
                  <strong>Vital interests:</strong> Processing Personal Data is necessary in order
                  to protect Your vital interests or of another natural person.
                </li>
                <li>
                  <strong>Public interests:</strong> Processing Personal Data is related to a task
                  that is carried out in the public interest or in the exercise of official
                  authority vested in the Company.
                </li>
                <li>
                  <strong>Legitimate interests:</strong> Processing Personal Data is necessary for
                  the purposes of the legitimate interests pursued by the Company.
                </li>
              </ul>
              <p>
                In any case, the Company will gladly help to clarify the specific legal basis that
                applies to the processing, and in particular whether the provision of Personal Data
                is a statutory or contractual requirement, or a requirement necessary to enter into
                a contract.
              </p>
              <h3>Your Rights under the GDPR</h3>
              <p>
                The Company undertakes to respect the confidentiality of Your Personal Data and to
                guarantee You can exercise Your rights.
              </p>
              <p>
                You have the right under this Privacy Policy, and by law if You are within the EU,
                to:
              </p>
              <ul>
                <li>
                  <strong>Request access to Your Personal Data.</strong> The right to access, update
                  or delete the information We have on You. Whenever made possible, you can access,
                  update or request deletion of Your Personal Data directly within Your account
                  settings section. If you are unable to perform these actions yourself, please
                  contact Us to assist You. This also enables You to receive a copy of the Personal
                  Data We hold about You.
                </li>
                <li>
                  <strong>Request correction of the Personal Data that We hold about You.</strong>{' '}
                  You have the right to have any incomplete or inaccurate information We hold about
                  You corrected.
                </li>
                <li>
                  <strong>Object to processing of Your Personal Data.</strong> This right exists
                  where We are relying on a legitimate interest as the legal basis for Our
                  processing and there is something about Your particular situation, which makes You
                  want to object to our processing of Your Personal Data on this ground. You also
                  have the right to object where We are processing Your Personal Data for direct
                  marketing purposes.
                </li>
                <li>
                  <strong>Request erasure of Your Personal Data.</strong> You have the right to ask
                  Us to delete or remove Personal Data when there is no good reason for Us to
                  continue processing it.
                </li>
                <li>
                  <strong>Request the transfer of Your Personal Data.</strong> We will provide to
                  You, or to a third-party You have chosen, Your Personal Data in a structured,
                  commonly used, machine-readable format. Please note that this right only applies
                  to automated information which You initially provided consent for Us to use or
                  where We used the information to perform a contract with You.
                </li>
                <li>
                  <strong>Withdraw Your consent.</strong> You have the right to withdraw Your
                  consent on using your Personal Data. If You withdraw Your consent, We may not be
                  able to provide You with access to certain specific functionalities of the
                  Service.
                </li>
              </ul>
              <h3>Exercising of Your GDPR Data Protection Rights</h3>
              <p>
                You may exercise Your rights of access, rectification, cancellation and opposition
                by contacting Us. Please note that we may ask You to verify Your identity before
                responding to such requests. If You make a request, We will try our best to respond
                to You as soon as possible.
              </p>
              <p>
                You have the right to complain to a Data Protection Authority about Our collection
                and use of Your Personal Data. For more information, if You are in the European
                Economic Area (EEA), please contact Your local data protection authority in the EEA.
              </p>
              <h2>CCPA/CPRA Privacy Notice (California Privacy Rights)</h2>
              <p>
                This privacy notice section for California residents supplements the information
                contained in Our Privacy Policy and it applies solely to all visitors, users, and
                others who reside in the State of California.
              </p>
              <h3>Categories of Personal Information Collected</h3>
              <p>
                We collect information that identifies, relates to, describes, references, is
                capable of being associated with, or could reasonably be linked, directly or
                indirectly, with a particular Consumer or Device. The following is a list of
                categories of personal information which we may collect or may have been collected
                from California residents within the last twelve (12) months.
              </p>
              <p>
                Please note that the categories and examples provided in the list below are those
                defined in the CCPA/CPRA. This does not mean that all examples of that category of
                personal information were in fact collected by Us, but reflects our good faith
                belief to the best of Our knowledge that some of that information from the
                applicable category may be and may have been collected. For example, certain
                categories of personal information would only be collected if You provided such
                personal information directly to Us.
              </p>
              <ul>
                <li>
                  <p>
                    <strong>Category A: Identifiers.</strong>
                  </p>
                  <p>
                    Examples: A real name, alias, postal address, unique personal identifier, online
                    identifier, Internet Protocol address, email address, account name,
                    driver&apos;s license number, passport number, or other similar identifiers.
                  </p>
                  <p>Collected: Yes.</p>
                </li>
                <li>
                  <p>
                    <strong>
                      Category B: Personal information categories listed in the California Customer
                      Records statute (Cal. Civ. Code § 1798.80(e)).
                    </strong>
                  </p>
                  <p>
                    Examples: A name, signature, Social Security number, physical characteristics or
                    description, address, telephone number, passport number, driver&apos;s license
                    or state identification card number, insurance policy number, education,
                    employment, employment history, bank account number, credit card number, debit
                    card number, or any other financial information, medical information, or health
                    insurance information. Some personal information included in this category may
                    overlap with other categories.
                  </p>
                  <p>Collected: Yes.</p>
                </li>
                <li>
                  <p>
                    <strong>
                      Category C: Protected classification characteristics under California or
                      federal law.
                    </strong>
                  </p>
                  <p>
                    Examples: Age (40 years or older), race, color, ancestry, national origin,
                    citizenship, religion or creed, marital status, medical condition, physical or
                    mental disability, sex (including gender, gender identity, gender expression,
                    pregnancy or childbirth and related medical conditions), sexual orientation,
                    veteran or military status, genetic information (including familial genetic
                    information).
                  </p>
                  <p>Collected: No.</p>
                </li>
                <li>
                  <p>
                    <strong>Category D: Commercial information.</strong>
                  </p>
                  <p>
                    Examples: Records and history of products or services purchased or considered.
                  </p>
                  <p>Collected: Yes.</p>
                </li>
                <li>
                  <p>
                    <strong>Category E: Biometric information.</strong>
                  </p>
                  <p>
                    Examples: Genetic, physiological, behavioral, and biological characteristics, or
                    activity patterns used to extract a template or other identifier or identifying
                    information, such as, fingerprints, faceprints, and voiceprints, iris or retina
                    scans, keystroke, gait, or other physical patterns, and sleep, health, or
                    exercise data.
                  </p>
                  <p>Collected: No.</p>
                </li>
                <li>
                  <p>
                    <strong>Category F: Internet or other similar network activity.</strong>
                  </p>
                  <p>Examples: Interaction with our Service or advertisement.</p>
                  <p>Collected: Yes.</p>
                </li>
                <li>
                  <p>
                    <strong>Category G: Geolocation data.</strong>
                  </p>
                  <p>Examples: Approximate physical location.</p>
                  <p>Collected: Yes.</p>
                </li>
                <li>
                  <p>
                    <strong>Category H: Sensory data.</strong>
                  </p>
                  <p>
                    Examples: Audio, electronic, visual, thermal, olfactory, or similar information.
                  </p>
                  <p>Collected: No.</p>
                </li>
                <li>
                  <p>
                    <strong>Category I: Professional or employment-related information.</strong>
                  </p>
                  <p>Examples: Current or past job history or performance evaluations.</p>
                  <p>Collected: No.</p>
                </li>
                <li>
                  <p>
                    <strong>
                      Category J: Non-public education information (per the Family Educational
                      Rights and Privacy Act (20 U.S.C. Section 1232g, 34 C.F.R. Part 99)).
                    </strong>
                  </p>
                  <p>
                    Examples: Education records directly related to a student maintained by an
                    educational institution or party acting on its behalf, such as grades,
                    transcripts, class lists, student schedules, student identification codes,
                    student financial information, or student disciplinary records.
                  </p>
                  <p>Collected: No.</p>
                </li>
                <li>
                  <p>
                    <strong>Category K: Inferences drawn from other personal information.</strong>
                  </p>
                  <p>
                    Examples: Profile reflecting a person&apos;s preferences, characteristics,
                    psychological trends, predispositions, behavior, attitudes, intelligence,
                    abilities, and aptitudes.
                  </p>
                  <p>Collected: No.</p>
                </li>
                <li>
                  <p>
                    <strong>Category L: Sensitive personal information.</strong>
                  </p>
                  <p>Examples: Account login and password information, geolocation data.</p>
                  <p>Collected: Yes.</p>
                </li>
              </ul>
              <p>Under CCPA/CPRA, personal information does not include:</p>
              <ul>
                <li>Publicly available information from government records</li>
                <li>Deidentified or aggregated consumer information</li>
                <li>
                  Information excluded from the CCPA/CPRA&apos;s scope, such as:
                  <ul>
                    <li>
                      Health or medical information covered by the Health Insurance Portability and
                      Accountability Act of 1996 (HIPAA) and the California Confidentiality of
                      Medical Information Act (CMIA) or clinical trial data
                    </li>
                    <li>
                      Personal Information covered by certain sector-specific privacy laws,
                      including the Fair Credit Reporting Act (FRCA), the Gramm-Leach-Bliley Act
                      (GLBA) or California Financial Information Privacy Act (FIPA), and the
                      Driver&apos;s Privacy Protection Act of 1994
                    </li>
                  </ul>
                </li>
              </ul>
              <h3>Sources of Personal Information</h3>
              <p>
                We obtain the categories of personal information listed above from the following
                categories of sources:
              </p>
              <ul>
                <li>
                  <strong>Directly from You</strong>. For example, from the forms You complete on
                  our Service, preferences You express or provide through our Service, or from Your
                  purchases on our Service.
                </li>
                <li>
                  <strong>Indirectly from You</strong>. For example, from observing Your activity on
                  our Service.
                </li>
                <li>
                  <strong>Automatically from You</strong>. For example, through cookies We or our
                  Service Providers set on Your Device as You navigate through our Service.
                </li>
                <li>
                  <strong>From Service Providers</strong>. For example, third-party vendors to
                  monitor and analyze the use of our Service, third-party vendors to deliver
                  targeted advertising to You, third-party vendors for payment processing, or other
                  third-party vendors that We use to provide the Service to You.
                </li>
              </ul>
              <h3>Use of Personal Information</h3>
              <p>
                We may use or disclose personal information We collect for &quot;business
                purposes&quot; or &quot;commercial purposes&quot; (as defined under the CCPA/CPRA),
                which may include the following examples:
              </p>
              <ul>
                <li>To operate our Service and provide You with Our Service.</li>
                <li>
                  To provide You with support and to respond to Your inquiries, including to
                  investigate and address Your concerns and monitor and improve our Service.
                </li>
                <li>
                  To fulfill or meet the reason You provided the information. For example, if You
                  share Your contact information to ask a question about our Service, We will use
                  that personal information to respond to Your inquiry. If You provide Your personal
                  information to purchase a product or service, We will use that information to
                  process Your payment and facilitate delivery.
                </li>
                <li>
                  To respond to law enforcement requests and as required by applicable law, court
                  order, or governmental regulations.
                </li>
                <li>
                  As described to You when collecting Your personal information or as otherwise set
                  forth in the CCPA/CPRA.
                </li>
                <li>For internal administrative and auditing purposes.</li>
                <li>
                  To detect security incidents and protect against malicious, deceptive, fraudulent
                  or illegal activity, including, when necessary, to prosecute those responsible for
                  such activities.
                </li>
                <li>Other one-time uses.</li>
              </ul>
              <p>
                Please note that the examples provided above are illustrative and not intended to be
                exhaustive. For more details on how we use this information, please refer to the
                &quot;Use of Your Personal Data&quot; section.
              </p>
              <p>
                If We decide to collect additional categories of personal information or use the
                personal information We collected for materially different, unrelated, or
                incompatible purposes, We will update this Privacy Policy.
              </p>
              <h3>Disclosure of Personal Information</h3>
              <p>
                We may use or disclose and may have used or disclosed in the last twelve (12) months
                the following categories of personal information for business or commercial
                purposes:
              </p>
              <ul>
                <li>Category A: Identifiers</li>
                <li>
                  Category B: Personal information categories listed in the California Customer
                  Records statute (Cal. Civ. Code § 1798.80(e))
                </li>
                <li>Category D: Commercial information</li>
                <li>Category F: Internet or other similar network activity</li>
                <li>Category G: Geolocation data</li>
                <li>Category L: Sensitive personal information</li>
              </ul>
              <p>
                Please note that the categories listed above are those defined in the CCPA/CPRA.
                This does not mean that all examples of that category of personal information were
                in fact disclosed, but reflects our good faith belief to the best of our knowledge
                that some of that information from the applicable category may be and may have been
                disclosed.
              </p>
              <p>
                When We disclose personal information for a business purpose or a commercial
                purpose, We enter a contract that describes the purpose and requires the recipient
                to both keep that personal information confidential and not use it for any purpose
                except performing the contract.
              </p>
              <h3>Share of Personal Information</h3>
              <p>
                We may share, and have shared in the last twelve (12) months, Your personal
                information identified in the above categories with the following categories of
                third parties:
              </p>
              <ul>
                <li>Service Providers</li>
                <li>Payment processors</li>
                <li>Our affiliates</li>
                <li>Our business partners</li>
                <li>
                  Third party vendors to whom You or Your agents authorize Us to disclose Your
                  personal information in connection with products or services We provide to You
                </li>
              </ul>
              <h3>Sale of Personal Information</h3>
              <p>
                As defined in the CCPA/CPRA, &quot;sell&quot; and &quot;sale&quot; mean selling,
                renting, releasing, disclosing, disseminating, making available, transferring, or
                otherwise communicating orally, in writing, or by electronic or other means, a
                Consumer&apos;s personal information by the Business to a third party for valuable
                consideration. This means that We may have received some kind of benefit in return
                for sharing personal information, but not necessarily a monetary benefit.
              </p>
              <p>
                We do not sell personal information as the term sell is commonly understood. We do
                allow Service Providers to use Your personal information for the business purposes
                described in Our Privacy Policy, for activities such as advertising, marketing, and
                analytics, and these may be deemed a sale under CCPA/CPRA.
              </p>
              <p>
                We may sell and may have sold in the last twelve (12) months the following
                categories of personal information:
              </p>
              <ul>
                <li>Category A: Identifiers</li>
                <li>
                  Category B: Personal information categories listed in the California Customer
                  Records statute (Cal. Civ. Code § 1798.80(e))
                </li>
                <li>Category D: Commercial information</li>
                <li>Category F: Internet or other similar network activity</li>
                <li>Category G: Geolocation data</li>
                <li>Category L: Sensitive personal information</li>
              </ul>
              <p>
                Please note that the categories listed above are those defined in the CCPA/CPRA.
                This does not mean that all examples of that category of personal information were
                in fact sold, but reflects our good faith belief to the best of Our knowledge that
                some of that information from the applicable category may be and may have been
                shared for value in return.
              </p>
              <h3>Sale of Personal Information of Minors Under 16 Years of Age</h3>
              <p>
                We do not knowingly collect personal information from minors under the age of 16
                through our Service, although certain third party websites that we link to may do
                so. These third-party websites have their own terms of use and privacy policies and
                We encourage parents and legal guardians to monitor their children&apos;s Internet
                usage and instruct their children to never provide information on other websites
                without their permission.
              </p>
              <p>
                We do not sell the personal information of Consumers We actually know are less than
                16 years of age, unless We receive affirmative authorization (the &quot;right to
                opt-in&quot;) from either the Consumer who is between 13 and 16 years of age, or the
                parent or guardian of a Consumer less than 13 years of age. Consumers who opt-in to
                the sale of personal information may opt-out of future sales at any time. To
                exercise the right to opt-out, You (or Your authorized representative) may submit a
                request to Us by contacting Us.
              </p>
              <p>
                If You have reason to believe that a child under the age of 13 (or 16) has provided
                Us with personal information, please contact Us with sufficient detail to enable Us
                to delete that information.
              </p>
              <h3>Your Rights under the CCPA/CPRA</h3>
              <p>
                The CCPA/CPRA provides California residents with specific rights regarding their
                personal information. If You are a resident of California, You have the following
                rights:
              </p>
              <ul>
                <li>
                  <strong>The right to notice.</strong> You have the right to be notified which
                  categories of Personal Data are being collected and the purposes for which the
                  Personal Data is being used.
                </li>
                <li>
                  <strong>The right to know/access.</strong> Under CCPA/CPRA, You have the right to
                  request that We disclose information to You about Our collection, use, sale,
                  disclosure for business purposes and share of personal information. Once We
                  receive and confirm Your request, We will disclose to You:
                  <ul>
                    <li>The categories of personal information We collected about You</li>
                    <li>
                      The categories of sources for the personal information We collected about You
                    </li>
                    <li>
                      Our business or commercial purposes for collecting or selling that personal
                      information
                    </li>
                    <li>
                      The categories of third parties with whom We share that personal information
                    </li>
                    <li>The specific pieces of personal information We collected about You</li>
                    <li>
                      If we sold Your personal information or disclosed Your personal information
                      for a business purpose, We will disclose to You:
                      <ul>
                        <li>The categories of personal information categories sold</li>
                        <li>The categories of personal information categories disclosed</li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>
                    The right to say no to the sale or sharing of Personal Data (opt-out).
                  </strong>{' '}
                  You have the right to direct Us to not sell Your personal information. To submit
                  an opt-out request, please see the &quot;Do Not Sell My Personal Information&quot;
                  section or contact Us.
                </li>
                <li>
                  <strong>The right to correct Personal Data.</strong> You have the right to correct
                  or rectify any inaccurate personal information about You that We collected. Once
                  We receive and confirm Your request, We will use commercially reasonable efforts
                  to correct (and direct our Service Providers to correct) Your personal
                  information, unless an exception applies.
                </li>
                <li>
                  <strong>The right to limit use and disclosure of sensitive Personal Data.</strong>{' '}
                  You have the right to request to limit the use or disclosure of certain sensitive
                  personal information We collected about You, unless an exception applies. To
                  submit, please see the &quot;Limit the Use or Disclosure of My Sensitive Personal
                  Information&quot; section or contact Us.
                </li>
                <li>
                  <strong>The right to delete Personal Data.</strong> You have the right to request
                  the deletion of Your Personal Data under certain circumstances, subject to certain
                  exceptions. Once We receive and confirm Your request, We will delete (and direct
                  Our Service Providers to delete) Your personal information from our records,
                  unless an exception applies. We may deny Your deletion request if retaining the
                  information is necessary for Us or Our Service Providers to:
                  <ul>
                    <li>
                      Complete the transaction for which We collected the personal information,
                      provide a good or service that You requested, take actions reasonably
                      anticipated within the context of our ongoing business relationship with You,
                      or otherwise perform our contract with You.
                    </li>
                    <li>
                      Detect security incidents, protect against malicious, deceptive, fraudulent,
                      or illegal activity, or prosecute those responsible for such activities.
                    </li>
                    <li>
                      Debug products to identify and repair errors that impair existing intended
                      functionality.
                    </li>
                    <li>
                      Exercise free speech, ensure the right of another consumer to exercise their
                      free speech rights, or exercise another right provided for by law.
                    </li>
                    <li>
                      Comply with the California Electronic Communications Privacy Act (Cal. Penal
                      Code § 1546 et. seq.).
                    </li>
                    <li>
                      Engage in public or peer-reviewed scientific, historical, or statistical
                      research in the public interest that adheres to all other applicable ethics
                      and privacy laws, when the information&apos;s deletion may likely render
                      impossible or seriously impair the research&apos;s achievement, if You
                      previously provided informed consent.
                    </li>
                    <li>
                      Enable solely internal uses that are reasonably aligned with consumer
                      expectations based on Your relationship with Us.
                    </li>
                    <li>Comply with a legal obligation.</li>
                    <li>
                      Make other internal and lawful uses of that information that are compatible
                      with the context in which You provided it.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>The right not to be discriminated against.</strong> You have the right not
                  to be discriminated against for exercising any of Your consumer&apos;s rights,
                  including by:
                  <ul>
                    <li>Denying goods or services to You</li>
                    <li>
                      Charging different prices or rates for goods or services, including the use of
                      discounts or other benefits or imposing penalties
                    </li>
                    <li>Providing a different level or quality of goods or services to You</li>
                    <li>
                      Suggesting that You will receive a different price or rate for goods or
                      services or a different level or quality of goods or services
                    </li>
                  </ul>
                </li>
              </ul>
              <h3>Exercising Your CCPA/CPRA Data Protection Rights</h3>
              <p>
                Please see the &quot;Do Not Sell My Personal Information&quot; section and
                &quot;Limit the Use or Disclosure of My Sensitive Personal Information&quot; section
                for more information on how to opt out and limit the use of sensitive information
                collected.
              </p>
              <p>
                Additionally, in order to exercise any of Your rights under the CCPA/CPRA, and if
                You are a California resident, You can contact Us:
              </p>
              <ul>
                <li>
                  By email: <a href="mailto:contact@cdlhelp.com">contact@cdlhelp.com</a>
                </li>
              </ul>
              <p>
                Only You, or a person registered with the California Secretary of State that You
                authorize to act on Your behalf, may make a verifiable request related to Your
                personal information.
              </p>
              <p>Your request to Us must:</p>
              <ul>
                <li>
                  Provide sufficient information that allows Us to reasonably verify You are the
                  person about whom We collected personal information or an authorized
                  representative
                </li>
                <li>
                  Describe Your request with sufficient detail that allows Us to properly
                  understand, evaluate, and respond to it
                </li>
              </ul>
              <p>
                We cannot respond to Your request or provide You with the required information if We
                cannot:
              </p>
              <ul>
                <li>Verify Your identity or authority to make the request</li>
                <li>And confirm that the personal information relates to You</li>
              </ul>
              <p>
                We will disclose and deliver the required information free of charge within 45 days
                of receiving Your verifiable request. The time period to provide the required
                information may be extended once by an additional 45 days when reasonably necessary
                and with prior notice.
              </p>
              <p>
                Any disclosures We provide will only cover the 12-month period preceding the
                verifiable request&apos;s receipt.
              </p>
              <p>
                For data portability requests, We will select a format to provide Your personal
                information that is readily usable and should allow You to transmit the information
                from one entity to another entity without hindrance.
              </p>
              <h3>Do Not Sell My Personal Information</h3>
              <p>
                As defined in the CCPA/CPRA, &quot;sell&quot; and &quot;sale&quot; mean selling,
                renting, releasing, disclosing, disseminating, making available, transferring, or
                otherwise communicating orally, in writing, or by electronic or other means, a
                Consumer&apos;s personal information by the Business to a third party for valuable
                consideration. This means that We may have received some kind of benefit in return
                for sharing personal information, but not necessarily a monetary benefit.
              </p>
              <p>
                We do not sell personal information as the term sell is commonly understood. We do
                allow Service Providers to use Your personal information for the business purposes
                described in Our Privacy Policy, for activities such as advertising, marketing, and
                analytics, and these may be deemed a sale under CCPA/CPRA.
              </p>
              <p>
                You have the right to opt-out of the sale of Your personal information. Once We
                receive and confirm a verifiable consumer request from You, we will stop selling
                Your personal information. To exercise Your right to opt-out, please contact Us.
              </p>
              <p>
                The Service Providers we partner with (for example, our analytics or advertising
                partners) may use technology on the Service that sells personal information as
                defined by the CCPA/CPRA law. If you wish to opt out of the use of Your personal
                information for interest-based advertising purposes and these potential sales as
                defined under CCPA/CPRA law, you may do so by following the instructions below.
              </p>
              <p>
                Please note that any opt out is specific to the browser You use. You may need to opt
                out on every browser that You use.
              </p>
              <h4>Website</h4>
              <p>
                If applicable, click &quot;Privacy Preferences&quot;, &quot;Update Privacy
                Preferences&quot; or &quot;Do Not Sell My Personal Information&quot; buttons listed
                on the Service to review Your privacy preferences and opt out of cookies and other
                technologies that We may use. Please note that You will need to opt out from each
                browser that You use to access the Service.
              </p>
              <p>
                Additionally, You can opt out of receiving ads that are personalized as served by
                our Service Providers by following our instructions presented on the Service:
              </p>
              <ul>
                <li>
                  The NAI&apos;s opt-out platform:{' '}
                  <a
                    href="http://www.networkadvertising.org/choices/"
                    rel="external nofollow noopener noreferrer"
                    target="_blank"
                  >
                    http://www.networkadvertising.org/choices/
                  </a>
                </li>
                <li>
                  The EDAA&apos;s opt-out platform{' '}
                  <a
                    href="http://www.youronlinechoices.com/"
                    rel="external nofollow noopener noreferrer"
                    target="_blank"
                  >
                    http://www.youronlinechoices.com/
                  </a>
                </li>
                <li>
                  The DAA&apos;s opt-out platform:{' '}
                  <a
                    href="http://optout.aboutads.info/?c=2&amp;lang=EN"
                    rel="external nofollow noopener noreferrer"
                    target="_blank"
                  >
                    http://optout.aboutads.info/?c=2&amp;lang=EN
                  </a>
                </li>
              </ul>
              <p>
                The opt out will place a cookie on Your computer that is unique to the browser You
                use to opt out. If you change browsers or delete the cookies saved by Your browser,
                You will need to opt out again.
              </p>
              <h4>Mobile Devices</h4>
              <p>
                Your mobile device may give You the ability to opt out of the use of information
                about the apps You use in order to serve You ads that are targeted to Your
                interests:
              </p>
              <ul>
                <li>
                  &quot;Opt out of Interest-Based Ads&quot; or &quot;Opt out of Ads
                  Personalization&quot; on Android devices
                </li>
                <li>&quot;Limit Ad Tracking&quot; on iOS devices</li>
              </ul>
              <p>
                You can also stop the collection of location information from Your mobile device by
                changing the preferences on Your mobile device.
              </p>
              <h3>Limit the Use or Disclosure of My Sensitive Personal Information</h3>
              <p>
                If You are a California resident, You have the right to limit the use and disclosure
                of Your sensitive personal information to that use which is necessary to perform the
                services or provide the goods reasonably expected by an average consumer who
                requests such services or goods.
              </p>
              <p>
                We collect, use and disclose sensitive personal information in ways that are
                necessary to provide the Service. For more information on how We use Your personal
                information, please see the &quot;Use of Your Personal Data&quot; section or contact
                us.
              </p>
              <h2>
                &quot;Do Not Track&quot; Policy as Required by California Online Privacy Protection
                Act (CalOPPA)
              </h2>
              <p>Our Service does not respond to Do Not Track signals.</p>
              <p>
                However, some third party websites do keep track of Your browsing activities. If You
                are visiting such websites, You can set Your preferences in Your web browser to
                inform websites that You do not want to be tracked. You can enable or disable DNT by
                visiting the preferences or settings page of Your web browser.
              </p>
              <h2>Your California Privacy Rights (California&apos;s Shine the Light law)</h2>
              <p>
                Under California Civil Code Section 1798 (California&apos;s Shine the Light law),
                California residents with an established business relationship with us can request
                information once a year about sharing their Personal Data with third parties for the
                third parties&apos; direct marketing purposes.
              </p>
              <p>
                If you&apos;d like to request more information under the California Shine the Light
                law, and if You are a California resident, You can contact Us using the contact
                information provided below.
              </p>
              <h2>
                California Privacy Rights for Minor Users (California Business and Professions Code
                Section 22581)
              </h2>
              <p>
                California Business and Professions Code Section 22581 allows California residents
                under the age of 18 who are registered users of online sites, services or
                applications to request and obtain removal of content or information they have
                publicly posted.
              </p>
              <p>
                To request removal of such data, and if You are a California resident, You can
                contact Us using the contact information provided below, and include the email
                address associated with Your account.
              </p>
              <p>
                Be aware that Your request does not guarantee complete or comprehensive removal of
                content or information posted online and that the law may not permit or require
                removal in certain circumstances.
              </p>
              <h2>Children&apos;s Privacy</h2>
              <p>
                Our Service does not address anyone under the age of 13. We do not knowingly collect
                personally identifiable information from anyone under the age of 13. If You are a
                parent or guardian and You are aware that Your child has provided Us with Personal
                Data, please contact Us. If We become aware that We have collected Personal Data
                from anyone under the age of 13 without verification of parental consent, We take
                steps to remove that information from Our servers.
              </p>
              <p>
                If We need to rely on consent as a legal basis for processing Your information and
                Your country requires consent from a parent, We may require Your parent&apos;s
                consent before We collect and use that information.
              </p>
              <h2>Links to Other Websites</h2>
              <p>
                Our Service may contain links to other websites that are not operated by Us. If You
                click on a third party link, You will be directed to that third party&apos;s site.
                We strongly advise You to review the Privacy Policy of every site You visit.
              </p>
              <p>
                We have no control over and assume no responsibility for the content, privacy
                policies or practices of any third party sites or services.
              </p>
              <h2>Changes to this Privacy Policy</h2>
              <p>
                We may update Our Privacy Policy from time to time. We will notify You of any
                changes by posting the new Privacy Policy on this page.
              </p>
              <p>
                We will let You know via email and/or a prominent notice on Our Service, prior to
                the change becoming effective and update the &quot;Last updated&quot; date at the
                top of this Privacy Policy.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for any changes. Changes
                to this Privacy Policy are effective when they are posted on this page.
              </p>
              <h2>Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, You can contact us:</p>
              <ul>
                <li>
                  By email: <a href="mailto:contact@cdlhelp.com">contact@cdlhelp.com</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Footer />
      </Layout>
    </>
  );
};

export default PrivacyPolicy;

export async function getStaticProps({ locale }) {
  const meta = await getMeta(locale, 'privacy-policy');

  return {
    props: {
      meta: meta,
      ...(await serverSideTranslations(locale ?? 'en', ['navbar', 'footer', 'cookie'])),
    },
  };
}
