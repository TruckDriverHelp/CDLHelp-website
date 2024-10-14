import React from "react";
import PageBannerStyle1 from "@/components/Common/PageBannerStyle1";
import BlogSidebar from "@/components/Blog/BlogSidebar";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CVOCard from "@/components/Article/texasCVOcard";
import fetchCVOCards from "../lib/TexasCVO/fetchCVOCards";
import Layout from "@/components/_App/Layout";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import fetchText from "../lib/TexasCVO/fetchText";
import Navbar from "@/components/_App/Navbar";
import Footer from "@/components/_App/Footer";

const CDLtexas = ({ text, cards, locale, alternateLinks }) => {
	return (
		<>
			<Head>
				<title>CDL Тесты - Техас CVO Knowledge тест</title>
				<meta name="description" content="CDL Тесты - Техас CVO Knowledge тест" />
				{/* Google / Search Engine Tags */}
				<meta itemProp="name" content="Приложение CDL Help - Тесты CDL на русском языке" />
				<meta itemProp="description" content="CDL Help - Инструкция по применению приложения CDL Help." />
				<meta itemProp="image" content="/images/cdlhelp-tag.jpg" />
				{/* Facebook Meta Tags */}
				<meta property="og:url" content="https://cdlhelp.com/cdl-texas" />
				<meta property="og:type" content="article" />
				<meta property="og:title" content="Техас CVO Knowledge" />
				<meta property="og:description" content="CDL Help - Инструкция по применению приложения CDL Help." />
				<meta property="og:image" content="/images/cdlhelp-tag.jpg" />
				<meta property="og:site_name" content="CDL Help" />
				{/* Twitter Meta Tags */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Приложение CDL Help - Тесты CDL на русском языке" />
				<meta name="twitter:description" content="CDL Help - Инструкция по применению приложения CDL Help." />
				<meta name="twitter:image" content="/images/cdlhelp-tag.jpg" />
			</Head>
			<Layout >
				<Navbar alternateLinks={alternateLinks}/>

				<PageBannerStyle1
					pageTitle="Texas CVO Knowledge"
					homePageUrl="/"
					homePageText="Main Page"
					activePageText="Texas CVO Knowledge"
				/>

				<div className="blog-details-area ptb-75">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 col-md-12">
								<div className="blog-details-desc">
									<div id="texas-cvo-text" className="article-content">
										<Markdown children={text} remarkPlugins={[remarkGfm]} />

										{cards.map((card, index) => (
											<CVOCard
												key={index}
												locale={locale}
												questionEn={card.questionEn}
												answerEn={card.answerEn}
												questionLang={card.questionLang}
												answerLang={card.answerLang}
											/>
										))}
									</div>

									{/* <div className="article-footer">
										<div className="post-author-meta">
											<div className="d-flex align-items-center">
												<img src="/images/logo-adaptive.png" alt="user" />
												<div className="title">
													<span className="name">Автор TruckDirver.help</span>
													<span className="date">10 Ноябрь, 2023</span>
												</div>
											</div>
										</div>
									</div> */}
								</div>
							</div>

							{/* <div className="col-lg-4 col-md-12">
								<div className="right-sidebar">
									<BlogSidebar />
								</div>
							</div> */}
						</div>
					</div>
				</div>
				<Footer />
			</Layout>

		</>
	);
};

export default CDLtexas;

export async function getStaticProps({ locale }) {
	const cards = await fetchCVOCards(locale);
	const text = await fetchText(locale);

	const alternateLinks = [
		{ href: '/cdl-texas', hrefLang: 'en' },
		{ href: '/ar/cdl-texas', hrefLang: 'ar' },
		{ href: '/ru/cdl-texas', hrefLang: 'ru' },
		{ href: '/uk/cdl-texas', hrefLang: 'uk' },
		{ href: '/zh/cdl-texas', hrefLang: 'zh' },
		{ href: '/ko/cdl-texas', hrefLang: 'ko' },
		{ href: '/tr/cdl-texas', hrefLang: 'tr' },
	];

	return {
		props: {
			text: text,
			cards: cards,
			locale: locale,
			alternateLinks: alternateLinks,
			...(await serverSideTranslations(locale ?? 'en', [
				'navbar',
				'footer',
				'cookie'
			])),
		},
	};
}
