import React from 'react'
import Navbar from '@/components/_App/Navbar'
import PageBannerStyle1 from '@/components/Common/PageBannerStyle1'
import BlogSidebar from '@/components/Blog/BlogSidebar'
import RelatedPost from '@/components/Blog/RelatedPost'
import Footer from '@/components/_App/Footer'
import Link from 'next/link'
import Head from 'next/head'

const CdlShkola = () => {
	return (
		<>
			<Head>
				<title>CDL школы на русском - CDL Help</title>
				<meta name="description" content="Приложение CDL Help - справочник со школами CDL в различных штатах. "/>

				{/* Google / Search Engine Tags */}
				<meta itemprop="name" content="Приложение CDL Help - Тесты CDL на русском языке"/>
				<meta itemprop="description" content="Приложение CDL Help - справочник со школами CDL в различных штатах. "/>
				<meta itemprop="image" content="https://cdlhelp.app/images/cdlhelp-tag.jpg"/>

				{/* Facebook Meta Tags */}
				<meta property="og:url" content="https://www.cdlhelp.app"/>
				<meta property="og:type" content="website"/>
				<meta property="og:title" content="Приложение CDL Help - Тесты CDL на русском языке"/>
				<meta property="og:description" content="Приложение CDL Help - справочник со школами CDL в различных штатах. "/>
				<meta property="og:image" content="https://cdlhelp.app/images/cdlhelp-tag.jpg"/>

				{/* Twitter Meta Tags */}
				<meta name="twitter:card" content="summary_large_image"/>
				<meta name="twitter:title" content="Приложение CDL Help - Тесты CDL на русском языке"/>
				<meta name="twitter:description" content="Приложение CDL Help - справочник со школами CDL в различных штатах. "/>
				<meta name="twitter:image" content="https://cdlhelp.app/images/cdlhelp-tag.jpg"/>
			</Head>
			<Navbar />

			<PageBannerStyle1
				pageTitle="CDL Школы в США"
				homePageUrl="/"
				homePageText="Главная Страница"
				activePageText="CDL Школы в США"
			/>

			<div className="blog-details-area pb-100">
				<div className="container">
					<div className="row">
						<div className="col-lg-8 col-md-12">
							<div className="blog-details-desc">
								{/* <div className="article-image">
									<Link href="/blog-grid">
                                        <a className="tag">Branding</a>
                                    </Link>
									<img src="/images/blog/cdl-shkoly-v-usa.jpg" alt="blog-details" />
								</div> */}

								<div className="article-content">
									{/* <div className="entry-meta">
										<ul>
											<li>
												<i className="ri-calendar-2-line"></i>
												14 Декабря, 2022
											</li>
										</ul>
									</div> */}

									<h4>Справочник CDL Школ в США</h4>
									<div>
										<p>Для того чтобы получить CDL, необходимо пройти обучение в CDL школе. После обучения, необходимо устно сдать Pre-Trip Inspection, а также тест на вождение. В нашем списке вы найдете CDL школы с русскоязычными инструкторами в различных штатах. В то время как обучение можно пройти на русском, экзамен необходимо сдавать на английском.</p>
										<div style={{ maxWidth: 500 }}>
											<div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 10}}>
												<div>
													<p style={{marginBottom: 0}}>CDL школа в Нью-Йорке (CDL Auto Club)</p>
													<p style={{marginBottom: 0, fontSize: '0.7rem', color: '#262A37'}}>4176 Victory Blvd, Staten Island, NY 10314</p>
												</div>
												<a href="tel:+19295436611" target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>(718) 304-0236</a>
											</div>
											<div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f1f1f1', paddingTop: 10, paddingBottom: 10}}>
												<div>
													<p style={{marginBottom: 0}}>CDL школа в Нью-Йорке (US Mule CDL)</p>
													<p style={{marginBottom: 0, fontSize: '0.7rem', color: '#262A37'}}>277 Brighton Beach Ave, Brooklyn, NY 11235</p>
													<p style={{fontSize: '0.7rem', color: '#262A37'}}>1 Atlantic Highlands - Pier 11, Brooklyn, NY 11231</p>
												</div>
												<a href="tel:+19295436611" target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>(929) 543-6611</a>
											</div>
											<div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 10}}>
												<div>
													<p style={{marginBottom: 0}}>CDL школа в Нью-Джерси</p>
													<p style={{marginBottom: 0, fontSize: '0.7rem', color: '#262A37'}}>719 Mt Holly Rd, Beverly, NJ 08010</p>
												</div>
												<a href="tel:+19295436611" target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>(848) 400-4217</a>
											</div>
											<div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f1f1f1', paddingTop: 10, paddingBottom: 10 }}>
												<div>
													<p style={{marginBottom: 0}}>CDL школа в Сакраменто</p>
													<p style={{fontSize: '0.7rem', color: '#262A37'}}>3555 Cincinnati Ave Suite 104, Rocklin, CA 95765</p>
												</div>
												<a href="tel:+19162993614" target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>(916) 299-3614</a>
											</div>
											<div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 10 }}>
												<div>
													<p style={{marginBottom: 0}}>CDL школа в Лос Анджелесе (Red Zone CDL)</p>
													<p style={{fontSize: '0.7rem', color: '#262A37'}}>12087 Lopez Canyon Rd, Sylmar, CA 91342</p>
												</div>
												<a href="tel:+18184084678" target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>(818) 408-4678</a>
											</div>
											<div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, backgroundColor: '#f1f1f1', paddingBottom: 10 }}>
												<div>
													<p style={{marginBottom: 0}}>CDL школа в Лос Анджелесе (Easy CDL)</p>
													<p style={{fontSize: '0.7rem', color: '#262A37'}}>12087 Lopez Canyon Rd #113, Sylmar, CA 91342</p>
												</div>
												<a href="tel:+18184644265" target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>(818) 464-4265</a>
											</div>
											<div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 10 }}>
												<div>
													<p style={{marginBottom: 0}}>CDL школа в Чикаго</p>
													<p style={{fontSize: '0.7rem', color: '#262A37'}}>35 Old Skokie Rd, Park City, IL 60085</p>
												</div>
												<a href="tel:+18478921566" target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>(847) 892-1566</a>
											</div>
											<div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f1f1f1', paddingTop: 10, paddingBottom: 10 }}>
												<div>
													<p style={{marginBottom: 0}}>CDL школа в Северной Каролине</p>
													<p style={{fontSize: '0.7rem', color: '#262A37'}}>2379 Smokey Park Hwy, Candler, NC 28715</p>
												</div>
												<a href="tel:+12674934111" target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>(828) 882-2396</a>
											</div>
											{/*<div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 10 }}>
												<div>
													<p style={{marginBottom: 0}}>CDL школа в Огайо</p>
													<p style={{fontSize: '0.7rem', color: '#262A37'}}>1602 Valley St, Dayton, OH 45404</p>
												</div>
												<a href="tel:+15136134688" target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>(513) 613-4688</a>
											</div>*/}
											<div style={{ display: 'flex', justifyContent: 'space-between',  paddingTop: 10, paddingBottom: 10 }}>
												<div>
													<p style={{marginBottom: 0}}>CDL школа в Пенсильвании</p>
													<p style={{fontSize: '0.7rem', color: '#262A37'}}>10075 Sandmeyer Ln, Philadelphia, PA 191162</p>
												</div>
												<a href="tel:+12674934111" target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>(267) 493-4111</a>
											</div>
											<div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f1f1f1', paddingTop: 10, paddingBottom: 10 }}>
												<div>
													<p style={{marginBottom: 0}}>CDL школа в Вашингтоне</p>
													<p style={{fontSize: '0.7rem', color: '#262A37'}}>1302 26th St NW, Auburn, WA 98001</p>
												</div>
												<a href="tel:+12534870644" target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>(253) 487-0644</a>
											</div>
											<div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 10 }}>
												<div>
													<p style={{marginBottom: 0}}>CDL школа в Майами</p>
													<p style={{fontSize: '0.7rem', color: '#262A37'}}>14420 NW 107th Ave Hialeah, FL  33018</p>
												</div>
												<a href="tel:+17863645113" target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>(786) 364-5113</a>
											</div>
											<div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f1f1f1', paddingTop: 10, paddingBottom: 10 }}>
												<div>
													<p style={{marginBottom: 0}}>CDL школа в Лас Вегасе</p>
													<p style={{fontSize: '0.7rem', color: '#262A37'}}>6149 S Rainbow Blvd, Las Vegas, NV 89118</p>
												</div>
												<a href="tel:+17252277275" target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>(725) 227-7275</a>
											</div>
										</div>
									</div>
									<p style={{ fontSize: 12, margin: 0 }}><em>Хотите добавить свою школу CDL в наш список? Несколько методов связи:</em></p>
									<ul style={{ marginTop: 0 }}>
										<li style={{ margin: 0 }}><p style={{ fontSize: 12 }}><em>Напишите email - <strong><a href="mailto:contact@truckdriver.help" target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>contact{`<собака>`}truckdriver.help</a></strong> с заголовком <strong>"Добавить CDL школу в список CDL Help"</strong></em></p></li>
										<li style={{ margin: 0 }}><p style={{ fontSize: 12, fontWeight: 'bold', textDecoration: 'underline' }}><a href="https://www.t.me/tdhsupport">Связаться через Телеграм</a></p></li>
										<li style={{ margin: 0 }}><p style={{ fontSize: 12, fontWeight: 'bold', textDecoration: 'underline' }}><a href="https://www.facebook.com/truckdriverhelp">Связаться на странице Facebook</a></p></li>
									</ul>

									<p>Подробнее о школах CDL можно прочитать в статье <Link href="/o-shkolax"><a style={{ fontWeight: 'bold', textDecoration: 'underline' }}>пройдя по ссылке.</a></Link></p>
								</div>

								<div className="article-footer">
									<div className="post-author-meta">
										<div className="d-flex align-items-center">
											<img src="/images/logo-adaptive.png" alt="user" />
											<div className="title">
												<span className="name">
													Автор <Link href="/blog-grid"><a>TruckDirver.help</a></Link>
												</span>
												<span className="date">17 января, 2023</span>
											</div>
										</div>
									</div>
									{/* <div className="article-share">
										<ul className="social">
											<li><span>Share:</span></li>
											<li>
												<a href="https://www.facebook.com/" className="facebook" target="_blank">
													<i className="ri-facebook-fill"></i>
												</a>
											</li>
											<li>
												<a href="https://www.linkedin.com/" className="twitter" target="_blank">
													<i className="ri-linkedin-fill"></i>
												</a>
											</li>
											<li>
												<a href="https://twitter.com/" className="linkedin" target="_blank">
													<i className="ri-twitter-fill"></i>
												</a>
											</li>
											<li>
												<a href="https://www.instagram.com/" className="instagram" target="_blank">
													<i className="ri-instagram-line"></i>
												</a>
											</li>
										</ul>
									</div> */}
								</div>

								{/* Related Blog Post */}
								{/* <RelatedPost /> */}


							</div>
						</div>

						<div className="col-lg-4 col-md-12">
							<div className="right-sidebar">
								<BlogSidebar />
							</div>
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</>
	)
}

export default CdlShkola;