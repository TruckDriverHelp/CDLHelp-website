import React from 'react'
import Navbar from '@/components/_App/Navbar'
import PageBannerStyle1 from '@/components/Common/PageBannerStyle1'
import BlogSidebar from '@/components/Blog/BlogSidebar'
import RelatedPost from '@/components/Blog/RelatedPost'
import Footer from '@/components/_App/Footer'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image';
import dynamic from 'next/dynamic';

const ModalVideo = dynamic(() => import('react-modal-video'), {
	ssr: false
});


const Dalnoboishik = () => {
	const [isOpen, setIsOpen] = React.useState(true);
	const openModal = () => {
		setIsOpen(!isOpen);
	}

	const title = "Инструкция как стать дальнобойщиком в США: 5 шагов - CDL Help"
	const description = "Получите CDL с нашей пошаговой инструкцией. Начните свой путь к успеху с CDL Help!"
	return (
		<>

			<Head>
				<title>{title}</title>
				<meta name="description" content={description} />
				<link rel="canonical" href="https://cdlhelp.com/dalnoboishik"/>

				{/* Google / Search Engine Tags */}
				<meta itemProp="name" content={title} />
				<meta itemProp="description" content={description} />
				<meta itemProp="image" content="https://cdlhelp.com/images/cdlhelp-tag.jpg" />

				{/* Facebook Meta Tags */}
				<meta property="og:url" content="https://www.cdlhelp.com" />
				<meta property="og:type" content="article" />
				<meta property="og:title" content={title} />
				<meta property="og:description" content={description} />
				<meta property="og:image" content="https://cdlhelp.com/images/cdlhelp-tag.jpg" />

				{/* Twitter Meta Tags */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={title} />
				<meta name="twitter:description" content={description} />
				<meta name="twitter:image" content="https://cdlhelp.com/images/cdlhelp-tag.jpg" />
			</Head>
			<Navbar />

			<PageBannerStyle1
				pageTitle="Как стать дальнобойщиком в США"
				homePageUrl="/"
				homePageText="Главная Страница"
				activePageText="Как стать дальнобойщиком в США"
			/>

			<div className="blog-details-area pb-75">
				<div className="container">
					<div className="row">
						<div className="col-lg-8 col-md-12">
							<div className="blog-details-desc">
								<div className="article-image">
									{/* <Link href="/blog-grid">
										<a className="tag">Branding</a>
									</Link> */}
									{/* <img  src="/images/blog/dalnoboishik.jpg" alt="blog-details" /> */}
								</div>

								<div className="article-content">

									<div className="how-it-works-area pb-100">
										<div className="container">
											<div className="pb-75">
												<p>На этой странице мы поделимся с вами процессом получения CDL, организовав информацию в удобные для вас разделы. Рассматривайте эту страницу как ваш личный пошаговый гид по пути к получению CDL. Здесь вы найдёте полезные ссылки на информационные статьи и множество других ресурсов, которые будут поддерживать вас на каждом этапе этого пути. Приступим!</p>
											</div>
											<div className="how-it-works-content">
												<div className="number">1</div>

												<div className="row m-0">
													<div className="col-lg-3 col-md-12 p-0">
														<div className="box">
															<h3>Шаг 1</h3>
															<span>Пошаговая Инструкция</span>
														</div>
													</div>

													<div className="col-lg-9 col-md-12 p-0">
														<div className="content">
															<p>Для начала мы настоятельно рекомендуем вам тщательно ознакомиться с процессом получения CDL. Для этого у вас есть два варианта: вы можете посмотреть обучающее видео или <Link href="/kak-poluchit-cdl"><a style={{ fontWeight: 'bold', textDecoration: 'underline' }}>изучить статью, которая детально описывает весь процесс</a></Link>. В видео или статье вы найдете информацию о том, как пройти медицинский осмотр DOT у сертифицированного специалиста, успешно сдать теоретические тесты в DMV для получения ученического разрешения (Commercial Learner&apos; Permit), а также как пройти обучение в школе CDL и сдать экзамен по вождению. </p>
															<div className="col-lg-12 col-md-12">
																<div className="app-intro-video-box">
																	<img 
																		src="/images/video/video-2.jpg"
																		alt="video-Image"
																		width={635}
																		height={420}
																	/><div
																		onClick={e => { e.preventDefault(); openModal() }}
																		className="video-btn popup-youtube"
																	>
																		<i className="ri-play-line"></i>
																	</div>
																</div>
															</div>
															{/* <img  src="/images/how-it-works/create-account.jpg" alt="create-account" /> */}
														</div>
													</div>
												</div>
											</div>

											<div className="how-it-works-content">
												<div className="number">2</div>
												<div className="row m-0">
													<div className="col-lg-3 col-md-12 p-0">
														<div className="box">
															<h3>Шаг 2</h3>
															<span>Как получить CDL Пермит</span>
														</div>
													</div>
													<div className="col-lg-9 col-md-12 p-0">
														<div className="content">
															<p>Далее, мы настоятельно рекомендуем вам внимательно изучить процесс подготовки и сдачи теоретических тестов для получения ученического разрешения (Пермита). После успешной сдачи теоретического экзамена и получения CLP, вы сможете начать обучение в школе CDL.</p>
															<p><Link href="/permit"><a style={{ fontWeight: 'bold', textDecoration: 'underline' }}>В нашей статье вы найдете необходимые требования и ресурсы, которые помогут вам в подготовке к экзаменам.</a></Link></p>
															{/* <img  src="/images/how-it-works/select-coin.jpg" alt="select-coin" /> */}
														</div>
													</div>
												</div>
											</div>
											<div className="how-it-works-content">
												<div className="number">3</div>
												<div className="row m-0">
													<div className="col-lg-3 col-md-12 p-0">
														<div className="box">
															<h3>Шаг 3</h3>
															<span>Как пользоваться приложением CDL Help</span>
														</div>
													</div>
													<div className="col-lg-9 col-md-12 p-0">
														<div className="content">
															<p>Приложение CDL Help - одно из самых надежных и эффективных инструментов для подготовки к CDL тестам в DMV для иммигрантов. Это приложение разработано с учетом потребностей всех пользователей, предлагающее не только всеобъемлющий контент для подготовки к тестам, но и дающий дополнительные возможности для практики английского языка, что является незаменимым навыком для успешной карьеры в сфере коммерческого вождения в США.</p>
															<p><Link href="/kak-ispolzovat-cdl-help/"><a style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Пройдя по ссылке, вы найдете подробное описание содержания тестов в приложении CDL Help, его функциональных особенностей, а также полезные советы и рекомендации по эффективному использованию приложения.</a></Link></p>
															{/* <img  src="/images/how-it-works/select-coin.jpg" alt="select-coin" /> */}
														</div>
													</div>
												</div>
											</div>
											<div className="how-it-works-content">
												<div className="number">4</div>
												<div className="row m-0">
													<div className="col-lg-3 col-md-12 p-0">
														<div className="box">
															<h3>Шаг 4</h3>
															<span>Чему обучают в школах CDL</span>
														</div>
													</div>
													<div className="col-lg-9 col-md-12 p-0">
														<div className="content">
															<p>После успешной сдачи тестов на теоретические знания и получения пермита, вы получите возможность начать обучение в автошколе для подготовки к вождению. Школа CDL - это тип программы обучения, которая помогает людям подготовиться к экзамену CDL и стать профессиональными водителями грузового транспорта. В школе CDL вы получаете ряд навыков и знаний, необходимых для безопасной и эффективной эксплуатации коммерческого грузового транспорта.</p>
															<p><Link href="/o-shkolax"><a style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Прочитать подробнее о том чему обучают в школах</a></Link></p>
															{/* <img  src="/images/how-it-works/select-coin.jpg" alt="select-coin" /> */}
														</div>
													</div>
												</div>
											</div>
											<div className="how-it-works-content">
												<div className="number">5</div>
												<div className="row m-0">
													<div className="col-lg-3 col-md-12 p-0">
														<div className="box">
															<h3>Шаг 5</h3>
															<span>Список CDL школ</span>
														</div>
													</div>
													<div className="col-lg-9 col-md-12 p-0">
														<div className="content">
															<p>После завершения курса обучения вождению в школе, вам предстоит сдать экзамен. Одним из этапов экзамена является устный тест, включающий в себя пересказ pre-trip inspection, который необходимо изучить и представить на английском языке. Несмотря на необходимость сдачи устного экзамена на английском, многие выбирают обучение с русскоязычными инструкторами.</p>
															<p><Link href="/cdl-shkola"><a style={{ fontWeight: 'bold', textDecoration: 'underline' }}>На нашем сайте вы можете найти список школ, где предоставляются услуги русскоязычных инструкторов.</a></Link></p>
															{/* <img  src="/images/how-it-works/select-coin.jpg" alt="select-coin" /> */}
														</div>
													</div>
												</div>
											</div>
											<div className='pt-75'>
												<p><strong>Не нашли ответа на свой вопрос?</strong></p>
												<p><strong>Рекомендуем:</strong></p>
												<ol>
													<li><strong><Link href="/faq"><a style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Почитать ответы на странице “Часто Задаваемые Вопросы”</a></Link></strong></li>
													<li><strong><a href="https://www.t.me/truckdrivergroup" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Спросить у пользователей в нашем Телеграм чате</a></strong></li>
												</ol>
											</div>
										</div>
									</div>
								</div>

								<div className="article-footer">
									{/* <div className="post-author-meta">
										<div className="d-flex align-items-center">
											<img  src="/images/logo-adaptive.png" alt="user" />
											<div className="title">
												<span className="name">
													Автор TruckDirver.help
												</span>
												<span className="date">24 Ноября, 2022</span>
											</div>
										</div>
									</div> */}
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
			<ModalVideo
				channel='youtube'
				isOpen={!isOpen}
				videoId='Ll4yVz7yBlQ'
				onClose={() => setIsOpen(!isOpen)}
			/>

			<Footer />
		</>
	)
}

export default Dalnoboishik;