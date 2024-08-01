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


const KakPoluchitCdl = () => {
    const [isOpen, setIsOpen] = React.useState(true);
    const openModal = () => {
        setIsOpen(!isOpen);
    }
    return (
        <>

            <Head>
                <title>Как стать дальнобойщиком в США - CDL Help</title>
                <meta name="description" content="CDL Help - как стать дальнобойщиком в США. Подробная инструкция, полезные ресурсы, и активное сообщество в Телеграме." />

                {/* Google / Search Engine Tags */}
                <meta itemprop="name" content="Приложение CDL Help - Тесты CDL на русском языке" />
                <meta itemprop="description" content="CDL Help - как стать дальнобойщиком в США. Подробная инструкция, полезные ресурсы, и активное сообщество в Телеграме." />
                <meta itemprop="image" content="https://cdlhelp.com/images/cdlhelp-tag.jpg" />

                {/* Facebook Meta Tags */}
                <meta property="og:url" content="https://www.cdlhelp.com" />
                <meta property="og:type" content="article" />
                <meta property="og:title" content="Приложение CDL Help - Тесты CDL на русском языке" />
                <meta property="og:description" content="CDL Help - как стать дальнобойщиком в США. Подробная инструкция, полезные ресурсы, и активное сообщество в Телеграме." />
                <meta property="og:image" content="https://cdlhelp.com/images/cdlhelp-tag.jpg" />

                {/* Twitter Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Приложение CDL Help - Тесты CDL на русском языке" />
                <meta name="twitter:description" content="CDL Help - как стать дальнобойщиком в США. Подробная инструкция, полезные ресурсы, и активное сообщество в Телеграме." />
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

                                    <div className="how-it-works-area">
                                        <div className="container">
                                            <div className="pb-75">
                                                <p>В этой статье мы рассмотрим карьеру водителя дальнобойщика в США, а также подробно разберём как получить CDL:</p>

                                                <div className="article-links">
                                                    <ol style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                        <li><a href="#dot-medical" style={{ textDecoration: "underline", color: "#5B5886" }}>Пройти медицинский осмотр DOT у сертифицированного специалиста</a></li>
                                                        <li><a href="#permit" style={{ textDecoration: "underline", color: "#5B5886" }}>Сдать тесты на теоретические знания в DMV и получить Пермит (Commercial Learner&#39;s Permit)</a></li>
                                                        <li><a href="#cdl-shkola" style={{ textDecoration: "underline", color: "#5B5886" }}>Пройти учебу в CDL школе и сдать экзамен по вождению</a></li>
                                                    </ol>
                                                </div>
                                                <h3 id="dot-medical">1. Пройти медицинский осмотр DOT у сертифицированного специалиста</h3>
                                                <p>Федеральное управление по безопасности автомобильных перевозчиков (FMCSA) требует для всех желающих получить CDL пройти медицинский осмотр. Найти квалифицированную медицинскую организацию <strong><a style={{ fontWeight: 'bold', textDecoration: 'underline' }} href="https://nationalregistry.fmcsa.dot.gov/home">можно на официальном сайте FMCSA.</a></strong></p>
                                                <p>Цель медицинского осмотра DOT — убедиться, что коммерческие водители физически пригодны для безопасного управления коммерческим автомобилем. Обследование включает в себя обзор истории болезни водителя и медицинский осмотр для проверки любых состояний, которые могут повлиять на способность водителя безопасно управлять коммерческим автомобилем, таких как проблемы со зрением и слухом, диабет, сердечно-сосудистые заболевания и другие заболевания.</p>
                                                <p>Медицинский осмотр DOT должен проводиться лицензированным медэкспертом, внесенным в Национальный реестр сертифицированных медицинских экспертов. Медицинский эксперт заполнит справку, которую водитель должен постоянно иметь при себе во время управления коммереским автомобилем. В справке MEC будет укажазано, имеет ли водитель физическую квалификацию для управления коммерческим автомобилем или применяются какие-либо ограничения или особые условия.</p>
                                                <h3 id="permit">2. Как сдать тесты в DMV и получить CDL Пермит</h3>
                                                <p>Разрешение на коммерческое обучение (CLP - Commercial Learner&#39;s Permit) — это документ, который позволяет человеку практиковаться в вождении коммерческого автомобиля во время подготовки к получению коммерческих водительских прав (CDL).  Уважаемые кандидаты, тест на получение CLP (Пермит) включает в себя оценку ваших теоретических знаний, необходимых для управления коммерческим транспортным средством. Этот тест обычно состоит из нескольких разделов, включая вопросы по правилам дорожного движения, безопасности и специфическим аспектам вождения большегрузных и коммерческих автомобилей.</p>
                                                <p>Чтобы иметь право на получение Пермита, человек должен иметь действующие водительские права и соответствовать требованиям, установленным штатом, в котором он живет. Если у человека есть Пермит, ему разрешается управлять коммерческим автомобилем на дорогах общего пользования под наблюдением лицензированного коммерческого водителя. Однако владельцу Пермита не разрешается управлять коммерческим транспортным средством за компенсацию, например, перевозить пассажиров</p>
                                                <p>Подготовиться к тестам можно при помощи <strong><Link href="/"><a style={{ fontWeight: 'bold', textDecoration: 'underline' }}>приложения CDL Help</a></Link></strong>. Подробнее о Пермите и как подготовится к тестам можно <strong><Link href="/permit/"><a style={{ fontWeight: 'bold', textDecoration: 'underline' }}>прочитать в статье &quot;Как получить CDL Пермит&quot;</a></Link></strong>.</p>
                                                <h3 id="cdl-shkola">3. Пройти учебу в CDL школе и сдать экзамен по вождению</h3>
                                                <p>Согласно новым правилам с февраля 2022 года, необходимо пройти обучение по ELDT прежде чем можно начать учебу в CDL школе. Многие CDL школы предоставляют возможность изучить и сдать тест в самой школе.</p>
                                                <p>В школах CDL вы получите всестороннее обучение, нацеленное на подготовку к успешной сдаче экзамена на получение CDL. Стоит отметить, что школы CDL обычно не обучают полноценному вождению, а сконцентрированы на подготовке кандидатов к экзамену.</p>
                                                <p>В школах обучают:</p>
                                                <ol>
                                                    <li><strong>Pre-trip inspection (Предварительный осмотр перед поездкой)</strong>: В обучении особое внимание уделяется предварительному осмотру вашего транспортного средства перед каждой поездкой. Это включает в себя проверку тормозной системы, шин, освещения, зеркал и других важных компонентов. Этот осмотр необходим для обеспечения безопасности не только вашей, но и других участников дорожного движения. Он также является обязательной частью экзамена на получение CDL.</li>
                                                    <li><strong>Парковочные маневры</strong>: Вам предстоит научиться выполнять различные маневры, которые крайне важны для управления коммерческим транспортом. К ним относятся развороты в ограниченном пространстве, параллельная и задняя парковка, а также безопасное движение задним ходом. Вам также будут даны навыки проезда через перекрестки и въезда на автомагистрали, что является ключевым для безопасного вождения.</li>
                                                    <li><strong>Общие навыки вождения</strong>: В рамках курса вам будет предложено освоить ряд общих навыков вождения, которые необходимы каждому водителю. Сюда входит понимание и соблюдение правил дорожного движения, умение быстро реагировать на изменения в дорожной обстановке, управление скоростью и дистанцией для поддержания безопасного интервала между автомобилями, эффективное использование зеркал и обзора, а также умение правильно действовать в экстренных ситуациях. Эти навыки повышают вашу безопасность на дороге и помогают предотвратить аварийные ситуации.</li>
                                                </ol>
                                                <p><Link href="/o-shkolax"><a style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Прочитать подробнее о том чему обучают в школах</a></Link></p>
                                                
                                                <p><strong>Не нашли ответа на свой вопрос?</strong></p>
                                                <p><strong>Рекомендуем:</strong></p>
                                                <ol>
                                                    <li><strong><Link href="/dalnoboishik"><a style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Прочитать серию статей о том, как получить CDL</a></Link></strong></li>
                                                    <li><strong><Link href="/faq"><a style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Почитать ответы на странице “Часто Задаваемые Вопросы”</a></Link></strong></li>
                                                    <li><strong><a href="https://www.t.me/truckdrivergroup" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Спросить у пользователей в нашем Телеграм чате</a></strong></li>
                                                </ol>

                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="article-footer">
                                    <div className="post-author-meta">
                                        <div className="d-flex align-items-center">
                                            <img  src="/images/logo-adaptive.png" alt="user" />
                                            <div className="title">
                                                <span className="name">
                                                    Автор TruckDirver.help
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

export default KakPoluchitCdl;