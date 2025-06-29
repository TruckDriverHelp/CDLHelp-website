import React from 'react'
import Head from 'next/head'
import PageBannerStyle1 from '../components/Common/PageBannerStyle1'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import getMeta from "../lib/getMeta";
import { useRouter } from "next/router";
import Navbar from '../components/_App/Navbar';
import Footer from '../components/_App/Footer';
import Layout from '../components/_App/Layout';

const CookiesPolicy = ({ meta }) => {
    const { locale } = useRouter();

    return (
        <>
            <Head>
                <title>{meta.title}</title>
                <meta name="description" content={meta.description} />

                {/* Google / Search Engine Tags */}
                <meta itemProp="name" content={meta.title} />
                <meta itemProp="description" content={meta.description} />
                <meta itemProp="image" content={"/images/truckdriverhelp-og.jpg"} />

                {/* Facebook Meta Tags */}
                <meta property="og:url" content="https://www.cdlhelp.com" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={meta.title} />
                <meta property="og:description" content={meta.description} />
                <meta property="og:image" content={"/images/truckdriverhelp-og.jpg"} />
                <meta property="og:locale" content={locale} />
                <meta property="og:site_name" content="CDL Help" />

                {/* Twitter Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={meta.title} />
                <meta name="twitter:description" content={meta.description} />
                <meta name="twitter:image" content={"/images/truckdriverhelp-og.jpg"} />
            </Head>
            <Layout>
                <Navbar />
                <PageBannerStyle1
                    pageTitle="Cookie policy"
                    homePageUrl="/"
                    homePageText="Home"
                    activePageText="Cookie policy"
                />



                <div className="privacy-policy-area ptb-100">
                    <div className="container">
                        <div className="privacy-policy-content">
                            <h1>Cookies Policy</h1>
                            <p>Last updated: September 19, 2024</p>
                            <p>This Cookies Policy explains what Cookies are and how We use them. You should read this policy so You can understand what type of cookies We use, or the information We collect using Cookies and how that information is used.</p>
                            <p>Cookies do not typically contain any information that personally identifies a user, but personal information that we store about You may be linked to the information stored in and obtained from Cookies. For further information on how We use, store and keep your personal data secure, see our Privacy Policy.</p>
                            <p>We do not store sensitive personal information, such as mailing addresses, account passwords, etc. in the Cookies We use.</p>
                            <h2>Interpretation and Definitions</h2>
                            <h3>Interpretation</h3>
                            <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
                            <h3>Definitions</h3>
                            <p>For the purposes of this Cookies Policy:</p>
                            <ul>
                                <li><strong>Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Cookies Policy) refers to TruckDriver.help llc, 4636 Cason Cove Dr.</li>
                                <li><strong>Cookies</strong> means small files that are placed on Your computer, mobile device or any other device by a website, containing details of your browsing history on that website among its many uses.</li>
                                <li><strong>Website</strong> refers to CDL Help, accessible from <a href="www.cdhelp.com" rel="external nofollow noopener" target="_blank">www.cdhelp.com</a></li>
                                <li><strong>You</strong> means the individual accessing or using the Website, or a company, or any legal entity on behalf of which such individual is accessing or using the Website, as applicable.</li>
                            </ul>
                            <h2>The use of the Cookies</h2>
                            <h3>Type of Cookies We Use</h3>
                            <p>Cookies can be &quot;Persistent&quot; or &quot;Session&quot; Cookies. Persistent Cookies remain on your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close your web browser.</p>
                            <p>We use both session and persistent Cookies for the purposes set out below:</p>
                            <ul>
                                <li>
                                    <p><strong>Necessary / Essential Cookies</strong></p>
                                    <p>Type: Session Cookies</p>
                                    <p>Administered by: Us</p>
                                    <p>Purpose: These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.</p>
                                </li>
                                <li>
                                    <p><strong>Cookies Policy / Notice Acceptance Cookies</strong></p>
                                    <p>Type: Persistent Cookies</p>
                                    <p>Administered by: Us</p>
                                    <p>Purpose: These Cookies identify if users have accepted the use of cookies on the Website.</p>
                                </li>
                                <li>
                                    <p><strong>Functionality Cookies</strong></p>
                                    <p>Type: Persistent Cookies</p>
                                    <p>Administered by: Us</p>
                                    <p>Purpose: These Cookies allow us to remember choices You make when You use the Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website.</p>
                                </li>
                                <li>
                                    <p><strong>Tracking and Performance Cookies</strong></p>
                                    <p>Type: Persistent Cookies</p>
                                    <p>Administered by: Third-Parties</p>
                                    <p>Purpose: These Cookies are used to track information about traffic to the Website and how users use the Website. The information gathered via these Cookies may directly or indirectly identify you as an individual visitor. This is because the information collected is typically linked to a pseudonymous identifier associated with the device you use to access the Website. We may also use these Cookies to test new pages, features or new functionality of the Website to see how our users react to them.</p>
                                </li>
                                <li>
                                    <p><strong>Targeting and Advertising Cookies</strong></p>
                                    <p>Type: Persistent Cookies</p>
                                    <p>Administered by: Third-Parties</p>
                                    <p>Purpose: These Cookies track your browsing habits to enable Us to show advertising which is more likely to be of interest to You. These Cookies use information about your browsing history to group You with other users who have similar interests. Based on that information, and with Our permission, third party advertisers can place Cookies to enable them to show adverts which We think will be relevant to your interests while You are on third party websites.</p>
                                </li>
                                <li>
                                    <p><strong>Social Media Cookies</strong></p>
                                    <p>Type: Persistent Cookies</p>
                                    <p>Administered by: Third-Parties</p>
                                    <p>Purpose: In addition to Our own Cookies, We may also use various third party plug-ins from social media networking websites such as Facebook, Instagram, Twitter or Google+ to report usage statistics of the Website and to provide social media features. These third party plug-ins may store Cookies. We do not control these Social Media Cookies. Please refer to the relevant social media networking's website privacy policies for information about their cookies.</p>
                                </li>
                            </ul>
                            <h3>Your Choices Regarding Cookies</h3>
                            <p>If You prefer to avoid the use of Cookies on the Website, first You must disable the use of Cookies in your browser and then delete the Cookies saved in your browser associated with this website. You may use this option for preventing the use of Cookies at any time.</p>
                            <p>If You do not accept Our Cookies, You may experience some inconvenience in your use of the Website and some features may not function properly.</p>
                            <p>If You'd like to delete Cookies or instruct your web browser to delete or refuse Cookies, please visit the help pages of your web browser.</p>
                            <ul>
                                <li>
                                    <p>For the Chrome web browser, please visit this page from Google: <a href="https://support.google.com/accounts/answer/32050" rel="external nofollow noopener" target="_blank">https://support.google.com/accounts/answer/32050</a></p>
                                </li>
                                <li>
                                    <p>For the Internet Explorer web browser, please visit this page from Microsoft: <a href="http://support.microsoft.com/kb/278835" rel="external nofollow noopener" target="_blank">http://support.microsoft.com/kb/278835</a></p>
                                </li>
                                <li>
                                    <p>For the Firefox web browser, please visit this page from Mozilla: <a href="https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored" rel="external nofollow noopener" target="_blank">https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored</a></p>
                                </li>
                                <li>
                                    <p>For the Safari web browser, please visit this page from Apple: <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" rel="external nofollow noopener" target="_blank">https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac</a></p>
                                </li>
                            </ul>
                            <p>For any other web browser, please visit your web browser's official web pages.</p>
                            <h3>More Information about Cookies</h3>
                            <p>You can learn more about cookies here: <a href="https://www.termsfeed.com/blog/cookies/" target="_blank">All About Cookies by TermsFeed</a>.</p>
                            <h3>Contact Us</h3>
                            <p>If you have any questions about this Cookies Policy, You can contact us:</p>
                            <ul>
                                <li>By email: <a href="mailto:contact@cdlhelp.com">contact@cdlhelp.com</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <Footer />
            </Layout>

        </>
    )
}

export default CookiesPolicy;

export async function getStaticProps({ locale }) {
    const meta = await getMeta(locale, "general");

    return {
        props: {
            meta: meta,
            ...(await serverSideTranslations(locale ?? 'en', [
                'navbar',
                'footer',
                'cookie'
            ])),
        },
    };
}