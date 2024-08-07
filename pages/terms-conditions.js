import React from 'react'
import Head from 'next/head'
import Navbar from '@/components/_App/Navbar'
import PageBannerStyle1 from '@/components/Common/PageBannerStyle1'
import Footer from '@/components/_App/Footer'

const TermsConditions = () => {
	const title = "Условия пользования – CDL Help"
	const description = "Список номеров CDL школ с русскими инструкторами в США"
	return (
		<>
			 <Head>
				<title>{title}</title>
				<meta name="description" content={description}/>
				<link rel="canonical" href="https://cdlhelp.com/terms-conditions"/>

				{/* Google / Search Engine Tags */}
				<meta itemProp="name" content={title}/>
				<meta itemProp="description" content={description}/>
				<meta itemProp="image" content="https://cdlhelp.com/images/cdlhelp-tag.jpg"/>

				{/* Facebook Meta Tags */}
				<meta property="og:url" content="https://www.cdlhelp.com"/>
				<meta property="og:type" content="website"/>
				<meta property="og:title" content={title}/>
				<meta property="og:description" content={description}/>
				<meta property="og:image" content="https://cdlhelp.com/images/cdlhelp-tag.jpg"/>

				{/* Twitter Meta Tags */}
				<meta name="twitter:card" content="summary_large_image"/>
				<meta name="twitter:title" content={title}/>
				<meta name="twitter:description" content={description}/>
				<meta name="twitter:image" content="https://cdlhelp.com/images/cdlhelp-tag.jpg"/>
			</Head>
			<Navbar />

			<PageBannerStyle1
				pageTitle="Terms & Conditions"
				homePageUrl="/"
				homePageText="Home"
				activePageText="Terms & Conditions"
			/>
			<div className="terms-conditions-area ptb-100">
				<div className="container">
					<div className="terms-conditions-content">
						<p>
							TruckDriver.help llc built the CDL Help app as
							a Free to download app with paid subscription to restricted content. This SERVICE is provided by
							TruckDriver.help llc.</p> <p>
							This page is used to inform visitors regarding our
							policies with the collection, use, and disclosure of Personal
							Information if anyone decided to use our Service.
						</p> <p>
							If you choose to use our Service, then you agree to
							the collection and use of information in relation to this
							policy. The Personal Information that we collect is
							used for providing and improving the Service. We will not use or share your information with
							anyone except as described in this Privacy Policy.
						</p> <p>
							The terms used in this Privacy Policy have the same meanings
							as in our Terms and Conditions, which are accessible at
							CDL Help unless otherwise defined in this Privacy Policy.
						</p> <p><strong>Information Collection and Use</strong></p> <p>
							For a better experience, while using our Service, we
							may require you to provide us with certain personally
							identifiable information. The information that
							we request will be retained by us and used as described in this privacy policy.
						</p> <div><p>
							The app does use third-party services that may collect
							information used to identify you.
						</p> <p>
								Link to the privacy policy of third-party service providers used
								by the app
							</p> <ul><li><a href="https://www.google.com/policies/privacy/" target="_blank" rel="noopener noreferrer">Google Play Services</a></li><li><a href="https://www.revenuecat.com/privacy" target="_blank" rel="noopener noreferrer">RevenueCat</a></li></ul></div> <p><strong>Log Data</strong></p> <p>
							We want to inform you that whenever you
							use our Service, in a case of an error in the app
							we collect data and information (through third-party
							products) on your phone called Log Data. This Log Data may
							include information such as your device Internet Protocol
							(“IP”) address, device name, operating system version, the
							configuration of the app when utilizing our Service,
							the time and date of your use of the Service, and other
							statistics.
						</p> <p><strong>Cookies</strong></p> <p>
							Cookies are files with a small amount of data that are
							commonly used as anonymous unique identifiers. These are sent
							to your browser from the websites that you visit and are
							stored on your device&apos; internal memory.
						</p> <p>
							This Service does not use these “cookies” explicitly. However,
							the app may use third-party code and libraries that use
							“cookies” to collect information and improve their services.
							You have the option to either accept or refuse these cookies
							and know when a cookie is being sent to your device. If you
							choose to refuse our cookies, you may not be able to use some
							portions of this Service.
							<p><strong>Subscription services</strong></p> <p>
								Monthly Subscription: By purchasing a Monthly Subscription, you agree to an initial and recurring Monthly Subscription Fee at the then-current Monthy Subscription rate, and you accept responsibility for all recurring charges until you cancel your subscription. You may cancel your Monthly Subscription at any time, subject to the terms of our cancellation policy.
							</p>
							<p>Automatic Monthly Renewal Terms: Once you subscribe, you will be charge the then-current Monthly Subscription fee. You will be continuesly charged on monthly basis at the then-current Monthly Subscription rate, until you cancel your subscription.</p>
							<p>
								3 Month Subscription: By purchasing a 3 Month Subscription, you agree to an initial and recurring 3 Month Subscription Fee at the then-current Monthy Subscription rate, and you accept responsibility for all recurring charges until you cancel your subscription. You may cancel your 3 Month Subscription at any time, subject to the terms of our cancellation policy.
							</p>
							<p>Automatic 3 Month Renewal Terms: Once you subscribe, you will be charge the then-current 3 Month Subscription fee. You will be continuesly charged on 3 Month basis at the then-current 3 Month Subscription rate, until you cancel your subscription.</p>
							<p>
								6 Month Subscription: By purchasing a 6 Month Subscription, you agree to an initial and recurring 6 Month Subscription Fee at the then-current Monthy Subscription rate, and you accept responsibility for all recurring charges until you cancel your subscription. You may cancel your 6 Month Subscription at any time, subject to the terms of our cancellation policy.
							</p>
							<p>Automatic 6 Month Renewal Terms: Once you subscribe, you will be charge the then-current 6 Month Subscription fee. You will be continuesly charged on 6 Month basis at the then-current 6 Month Subscription rate, until you cancel your subscription.</p>
							<p>
								Annual Subscription: By purchasing a Annual Subscription, you agree to an initial and recurring Annual Subscription Fee at the then-current Monthy Subscription rate, and you accept responsibility for all recurring charges until you cancel your subscription. You may cancel your Annual Subscription at any time, subject to the terms of our cancellation policy.
							</p>
							<p>Automatic Annual Renewal Terms: Once you subscribe, you will be charge the then-current Annual Subscription fee. You will be continuesly charged on Annual basis at the then-current Annual Subscription rate, until you cancel your subscription.</p>
						</p> <p><strong>Service Providers</strong></p> <p>
							We may employ third-party companies and
							individuals due to the following reasons:
						</p> <ul><li>To facilitate our Service;</li> <li>To provide the Service on our behalf;</li> <li>To perform Service-related services; or</li> <li>To assist us in analyzing how our Service is used.</li></ul> <p>
							We want to inform users of this Service
							that these third parties have access to their Personal
							Information. The reason is to perform the tasks assigned to
							them on our behalf. However, they are obligated not to
							disclose or use the information for any other purpose.
						</p> <p><strong>Security</strong></p> <p>
							We value your trust in providing us your
							Personal Information, thus we are striving to use commercially
							acceptable means of protecting it. But remember that no method
							of transmission over the internet, or method of electronic
							storage is 100% secure and reliable, and we cannot
							guarantee its absolute security.
						</p> <p><strong>Links to Other Sites</strong></p> <p>
							This Service may contain links to other sites. If you click on
							a third-party link, you will be directed to that site. Note
							that these external sites are not operated by us.
							Therefore, we strongly advise you to review the
							Privacy Policy of these websites. We have
							no control over and assume no responsibility for the content,
							privacy policies, or practices of any third-party sites or
							services.
						</p> <p><strong>Children’s Privacy</strong></p> <div><p>
							These Services do not address anyone under the age of 13.
							We do not knowingly collect personally
							identifiable information from children under 13 years of age. In the case
							we discover that a child under 13 has provided
							us with personal information, we immediately
							delete this from our servers. If you are a parent or guardian
							and you are aware that your child has provided us with
							personal information, please contact us so that
							we will be able to do the necessary actions.
						</p></div>  <p><strong>Changes to This Privacy Policy</strong></p> <p>
							We may update our Privacy Policy from
							time to time. Thus, you are advised to review this page
							periodically for any changes. We will
							notify you of any changes by posting the new Privacy Policy on
							this page.
						</p> <p>This policy is effective as of 2022-11-22</p> <p><strong>Contact Us</strong></p> <p>
							If you have any questions or suggestions about our
							Privacy Policy, do not hesitate to contact us at contact@truckdriver.help.
						</p> 

					</div>
				</div>
			</div>

			<Footer />
		</>
	)
}

export default TermsConditions;