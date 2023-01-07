import React from 'react'
import Navbar from '@/components/_App/Navbar'
import PageBannerStyle1 from '@/components/Common/PageBannerStyle1'
import BlogSidebar from '@/components/Blog/BlogSidebar'
import RelatedPost from '@/components/Blog/RelatedPost'
import Footer from '@/components/_App/Footer'
import Link from 'next/link'
import Head from 'next/head'

const Dalnoboishik = () => {
	return (
		<>
		
			<Head>
				<title>Как стать дальнобойщиком в США - CDL Help</title>
			</Head>
			<Navbar />

			<PageBannerStyle1
				pageTitle="Как стать дальнобойщиком в США"
				homePageUrl="/"
				homePageText="Главная Страница"
				activePageText="Как стать дальнобойщиком в США"
			/>

			<div className="blog-details-area ptb-100">
				<div className="container">
					<div className="row">
						<div className="col-lg-8 col-md-12">
							<div className="blog-details-desc">
								<div className="article-image">
									{/* <Link href="/blog-grid">
                                        <a className="tag">Branding</a>
                                    </Link> */}
									<img src="/images/blog/dalnoboishik.jpg" alt="blog-details" />
								</div>

								<div className="article-content">
									<div className="entry-meta">
										<ul>
											<li>
												<i className="ri-calendar-2-line"></i>
												18 Декабря, 2022
											</li>
										</ul>
									</div>
									<h4>Карьера дальнабойщика в США</h4>
									<p>Логистическая отросль является одной из самых важных отраслей, которая поддерживает многие предприятия и повседневную деятельность. Начиная от еды, одежды, автомобилей, скота, топлива, мебели и многого другого, траки перевозят предметы, которые потребители используют. Почти 70 процентов всего тоннажа грузов, транспортируемых в США, перевозится на траках. Дальнобойщики ежегодно перевозят 9,2 миллиарда тонн грузов, <a href="https://www.ttnews.com/articles/americas-35-million-truck-drivers-be-recognized-salutes-gifts" alt="Дальнобойщики ежегодно перевозят 9,2 миллиарда тонн грузов" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>по данным Американской ассоциации грузоперевозок.</a></p>
									<h4>Как получить CDL - пошаговая инструкция</h4>
									<p>В этой серии статей мы рассмотрим карьеру водителя дальнобойщика в США, а также подробно разберём как получить CDL:</p>
									<ol>
										<li><a href="#medical" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Пройти медицинский осмотр DOT у сертифицированного специалиста</a></li>
										<li><a href="#permit" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Сдать тесты на теоретические знания в DMV и получить разрешение (Commercial Learner's Permit)</a></li>
										<li><a href="#schools" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Пройти учебу в CDL школе и сдать экзамен по вождению</a></li>
									</ol>
									<h4 id="medical">1. Пройти медицинский осмотр DOT у сертифицированного специалиста</h4>
									<p>Федеральное управление по безопасности автомобильных перевозчиков (FMCSA) требует для всех желающих получить CDL пройти медицинский осмотр. Найти квалифицированную медицинскую организацию <a href="https://nationalregistry.fmcsa.dot.gov/home" alt="Найти квалифицированную медицинскую организацию на сайте FMCSA" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>можно на официальном сайте FMCSA.</a></p>
									<p>Цель медицинского осмотра DOT — убедиться, что коммерческие водители физически пригодны для безопасного управления коммерческим автомобилем (CMV). Обследование включает в себя обзор истории болезни водителя и медицинский осмотр для проверки любых состояний, которые могут повлиять на способность водителя безопасно управлять коммерческим автомобилем, таких как проблемы со зрением и слухом, диабет, сердечно-сосудистые заболевания и другие заболевания.</p>
									<p>Медицинский осмотр DOT должен проводиться лицензированным судмедэкспертом, внесенным в Национальный реестр сертифицированных медицинских экспертов. Судебно-медицинский эксперт заполнит справку судмедэксперта (MEC), которую водитель должен постоянно иметь при себе во время управления коммереским автомобилем. В справке MEC будет укажазано, имеет ли водитель физическую квалификацию для управления коммерческим автомобилем или применяются какие-либо ограничения или особые условия.
									</p>
									<h4 id="permit">2. Как сдать тесты в DMV и получить пермит (CLP)</h4>
									<p>Разрешение на коммерческое обучение (CLP) — это документ, который позволяет человеку практиковаться в вождении коммерческого автомобиля (CMV) во время подготовки к получению коммерческих водительских прав (CDL). Подготовиться к тестам можно при помощи <Link href="/" alt="CDL Help - приложение с CDL тестами на русском языке"><a style={{ fontWeight: 'bold', textDecoration: 'underline' }}>приложения CDL Help</a></Link>. Подробнее о CLP и как подготовится к тестам можно <Link href="/permit" alt="Как получить CLP"><a style={{ fontWeight: 'bold', textDecoration: 'underline' }}>прочитать в статье "Как получить CLP"</a></Link>.</p>
									<p>Чтобы иметь право на получение CLP, человек должен иметь действующие водительские права и соответствовать требованиям, установленным штатом, в котором он живет. Если у человека есть CLP, ему разрешается управлять коммерческим автомобилем на дорогах общего пользования под наблюдением лицензированного коммерческого водителя. Однако владельцу CLP не разрешается управлять CMV за компенсацию, например, перевозить пассажиров </p>
									<h4 id="schools">3. Пройти учебу в CDL школе и сдать экзамен по важдению</h4>
									<p>Школа CDL (коммерческое водительское удостоверение) - это тип программы обучения, которая помогает людям подготовиться к экзамену CDL и стать профессиональными водителями грузового транспорта. В школе CDL вы получаете ряд навыков и знаний, необходимых для безопасной и эффективной эксплуатации коммерческого грузового транспорта. Подробнее прочитать об учебе в школе можно <Link href="/cdl-shkola/" alt="Русско-язычные CDL школы"><a  style={{ fontWeight: 'bold', textDecoration: 'underline' }}>в статье "Русско-язычные CDL школы"</a></Link>.</p>
									<h4>Что ожидать от карьеры дальнобойщика</h4>
									<p>Чтобы стать водителем-дальнобойщиком, вам необходимо получить коммерческое водительское удостоверение (CDL). Обычно для этого требуется пройти программу обучения и сдать письменный тест и экзамен по вождению. Вам также может потребоваться соответствовать определенным физическим и медицинским требованиям, таким как способность поднимать тяжелые предметы и проходить медосмотр.</p>
									<p>Получив CDL, вы можете начать поиск работы в автотранспортных компаниях или в качестве независимого водителя купив свой трак. Важно иметь ввиду, что вождение трака на дальние расстояния может потребовать физических и умственных усилий, поскольку оно требует долгих часов вождения и времени вдали от дома. Также важно соблюдать все правила дорожного движения, а также вести отчет вождения.</p>
									<p>Чтобы преуспеть в этой карьере, полезно иметь хорошие навыки управления временем и организаторские способности, а также способность решать проблемы и принимать решения в дороге. Сильные коммуникативные навыки также важны для взаимодействия с диспетчерами, клиентами и другими профессионалами в сфере грузоперевозок.</p>
								</div>

								<div className="article-footer">
									<div className="post-author-meta">
										<div className="d-flex align-items-center">
										<img src="/images/logo-adaptive.png" alt="user" />
											<div className="title">
												<span className="name">
													Автор <Link href="/blog-grid"><a>TruckDirver.help</a></Link>
												</span>
												<span className="date">18 Декабря, 2022</span>
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

export default Dalnoboishik;