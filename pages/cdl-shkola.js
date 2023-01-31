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
											<div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f1f1f1', }}>
												<p>CDL школа в Нью Йорке</p>
												<a href="tel:+19295436611" target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>(929) 543-6611</a>
											</div>
											<div style={{ display: 'flex', justifyContent: 'space-between' }}>
												<p >CDL школа в Чикаго</p>
												<a href="tel:+17739856261" target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>(773) 985-6261</a>
											</div>
											<div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f1f1f1', }}>
												<p >CDL школа в Чикаго #2</p>
												<a href="tel:+18478921566" target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>(847) 892-1566</a>
											</div>
											<div style={{ display: 'flex', justifyContent: 'space-between', }}>
												<p >CDL школа в Пенсильвании</p>
												<a href="tel:+12674934111" target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>(267) 493-4111</a>
											</div>
											<div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f1f1f1', }}>
												<p>CDL школа в Лос Анджелесе</p>
												<a href="tel:+18184644265" target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>(818) 464-4265</a>
											</div>
											<div style={{ display: 'flex', justifyContent: 'space-between' }}>
												<p>CDL школа в Сакраменто</p>
												<a href="tel:+19162993614" target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>(916) 299-3614</a>
											</div>
											<div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f1f1f1', }}>
												<p>CDL школа в Майами</p>
												<a href="tel:+17863645113" target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>(786) 364-5113</a>
											</div>
											<div style={{ display: 'flex', justifyContent: 'space-between' }}>
												<p>CDL школа в Огайо</p>
												<a href="tel:+15136134688" target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>(513) 613-4688</a>
											</div>
											<div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f1f1f1', }}>
												<p>CDL школа в Лас Вегасе</p>
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