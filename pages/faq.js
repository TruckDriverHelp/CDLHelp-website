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
				pageTitle="Часто Задаваемые Вопросы"
				homePageUrl="/"
				homePageText="Главная Страница"
				activePageText="Часто Задаваемые Вопросы"
			/>

			<div className="blog-details-area pb-100">
				<div className="container">
					<div className="row">
						<div className="col-lg-8 col-md-12">
							<div className="blog-details-desc">

								<div className="article-content">
									{/* <div className="entry-meta">
										<ul>
											<li>
												<i className="ri-calendar-2-line"></i>
												14 Декабря, 2022
											</li>
										</ul>
									</div> */}

									<div className="faq-links">
										<ul>
											<li><a href="#russian-dmv" style={{textDecoration: "underline"}}>В каких штатах можно сдать экзамены в DMV на русском языке?</a></li>
											<li><a href="#question-quantity" style={{textDecoration: "underline"}}>Сколько вопросов в приложении?</a></li>
											<li><a href="#question-coverage" style={{textDecoration: "underline"}}>Ваши тесты покрывают все возможные вопросы?</a></li>
											<li><a href="#full-access" style={{textDecoration: "underline"}}>Как получить доступ ко всем тестам? Приложение платное?</a></li>
											<li><a href="#question-amount" style={{textDecoration: "underline"}}>Сколько вопросов на экзамене?</a></li>
											<li><a href="#mistakes-allowed" style={{textDecoration: "underline"}}>Сколько ошибок допущено на экзамене?</a></li>
											<li><a href="#without-english" style={{textDecoration: "underline"}}>Могу ли сдать экзамен без знания английского?</a></li>
											<li><a href="#audio-issue" style={{textDecoration: "underline"}}>Не работает аудио дорожка</a></li>
											<li><a href="#payment-issue" style={{textDecoration: "underline"}}>Я оплатил подписку, но не получил доступ. Что делать?</a></li>
											<li><a href="#school-cost" style={{textDecoration: "underline"}}>Сколько стоит обучение в школе?</a></li>
											<li><a href="#pretrip-russian" style={{textDecoration: "underline"}}>Можно ли сдать экзамены по вождению (Pre-trip inspection) на русском языке?</a></li>
											<li><a href="#cancel-subscription" style={{textDecoration: "underline"}}>Как отменить подписку?</a></li>
											<li><a href="#contact" style={{textDecoration: "underline"}}>У меня есть к вам предложение. Как с вами связаться?</a></li>
										</ul>
									</div>
									<div id="russian-dmv">
										<h4>В каких штатах можно сдать экзамены в DMV на русском языке?</h4>
										<p>Есть несколько штатов, в которых можно сдать тест на русском - Калифорния, Огайо, Пенсильвания. Но, советуем уточнить, позвонив в местный DMV так как законы меняются, и тесты на других языках могут, добавить либо убрать из базы DMV в вашем штате.</p>
									</div>
									<div id="question-quantity">
										<h4>Сколько вопросов в приложении?</h4>
										<p>Необходимо сдать 3 теста - General Knowledge, Combination, и Air Brake. Общее количество вопросов на экзамене в DMV составляет около 400 вопросов.</p>
										<p>В нашем приложении содержатся все три теста и большинство вопросов, которые могут задать в DMV. Общее количество вопросов, содержащиеся в приложении CDL Help составляют более 370.</p>
										<p>В нескольких штатах, например в Калифорнии, также необходимо сдать тест со знаками, если вы получили водительские права в течении года. Дорожные знаки будут добавлены в приложение в ближайшие месяцы.</p>
									</div>
									<div id="full-access">
										<h4>Как получить доступ ко всем тестам? Приложение платное?</h4>
										<p>Доступ ко всем тестам в приложении можно получить подписавшись на платную подписку.</p>
									</div>
									<div id="question-amount">
										<h4>Сколько вопросов на экзамене?</h4>
										<p>General Knowledge - 50 вопросов</p>
										<p>Air Brakes - 25 вопросов</p>
										<p>Combination - 20 вопросов</p>
									</div>
									<div id="mistakes-allowed">
										<h4>Сколько ошибок допущено на экзамене?</h4>
										<p>General Knowledge - 10 ошибок</p>
										<p>Air Brakes - 5 ошибок</p>
										<p>Combination - 5 ошибок</p>
									</div>
									<div id="without-english">
										<h4>Могу ли сдать экзамен без знания английского?</h4>
										<p>Это очевидный вопрос, которым задаются многие люди плохо, или вовсе не говорящие на английском языке. По личному опыту получения CDL, и помощи другим людям, которые не знали языка, можем сказать что это возможно, но может занять дольше времени.</p>
										<p>Экзамены также можно сдать без знаний английского. Многие заучивают ответы на вопросы. Не все сдают с первого раза, но серьезных ограничений на пересдачу нет - обычно можно пересдать на следующий день. В некоторых штатах дают несколько попыток.</p>
										<p>Подробнее о процессе как получить CDL можно почитать у нас на сайте <a style={{textDecoration: "underline"}} href="www.CDLhelp.app/dalnoboishik">www.CDLhelp.app/dalnoboishik</a></p>
									</div>
									<div id="audio-issue">
										<h4>Не работает аудио дорожка</h4>
										<p>Аудио дорожка в приложении работает напрямую с системой читающей текст в вашем устройстве. Убедитесь что Siri (iOS) либо Google Assistant (Android) в рабочем режиме.</p>
										<p>Также аудио дорожка не воспроизводится когда телефон включен на беззвучный режим.</p>
										<p>Если вы не смогли устранить проблемы, свяжитесь с администрацией через email contact@truckdriver.help или Телеграм <a style={{textDecoration: "underline"}} href="www.t.me/tdhsupport">www.t.me/tdhsupport</a></p>
									</div>
									<div id="payment-issue">
										<h4>Я оплатил подписку, но не получил доступ. Что делать?</h4>
										<p>Это может возникнуть в связи с различными причинами.</p>
										<ul>
											<li>Сервер Apple/Google перегружен. В этом случаи, ничего не нужно делать - в течении 15 минут после оплаты вы должны получить доступ. Также попробуйте перегрузить устройство.</li>
											<li>Ваш банк задержал средства, но оплата еще не осуществлена (статус Pending). Проверьте счет в банке, и убедитесь что оплата прошла успешна, и у оплаты не указан статус Pending. Если оплата в статусе Pending, доступ будет открыт после того как транзакция пройдет успешно.</li>
											<li>Задержки и сложности могут быть если ваше устройство зарегистрировано в App store/Play store Российской Федерации. Легче всего можно решить эту проблему, изменив регион в настройках App store/Play store.</li>
										</ul>
										<p>Свяжитесь с администрацией если проблема не устранена. Email contact@truckdriver.help или Телеграм <a style={{textDecoration: "underline"}} href="www.t.me/tdhsupport">www.t.me/tdhsupport</a></p>
									</div>
									<div id="school-cost">
										<h4>Сколько стоит обучение в школе?</h4>
										<p>После того как сдадите экзамены, необходимо пройти обучение в школе по вождению. Средняя стоимость обучения в CDL школе с русскоязычными инструкторами в среднем состоявляет от $2500 до $5000.</p>
										<p>В нашем списке школ вы можете найти школы в различных штатах. <a style={{textDecoration: "underline"}} href="www.CDLhelp.app/cdl-shkola">www.CDLhelp.app/cdl-shkola</a></p>
									</div>
									<div id="pretrip-russian">
										<h4>Можно ли сдать экзамены по вождению (Pre-trip inspection) на русском языке?</h4>
										<p>После обучения в школе CDL вам необходимо сдать экзамены по вождению. В экзамене также необходимо устно рассказать Pre-trip inspection. Согласно федеральному закону, экзамены необходимо сдавать на английском языке - на русском сдать невозможно.</p>
										<p>Также, согласно федеральному закону США, у водителя коммерческого автомобиля должно быть как минимум базовое знания английского языка. При осмотре коммерческого транспортного средства, водитель должен быть готов ответить на базовые вопросы, которые могут возникнуть у должностного лица который осматривает транспортное средство.</p>
										<p>В приложении CDL Help вы сможете найти весь текст Pre-trip inspection, включая перевод и озвучку.</p>
									</div>
									<div id="cancel-subscription">
										<h4>Как отменить подписку?</h4>
										<ul>
											<li>Если вы хотите отменить подписку iOS <a style={{textDecoration: "underline"}} href="https://support.apple.com/ru-ru/HT202039#:~:text=Как%20отменить%20подписку%20на%20iPhone%20или%20iPad&text=Нажмите%20свое%20имя.,Нажмите%20«Отменить%20подписку».">нажмите на эту ссылку для подробной инструкции.</a></li>
											<li>Если вы хотите отменить подписку Android <a style={{textDecoration: "underline"}} href="https://support.google.com/googleplay/answer/7018481?hl=ru&co=GENIE.Platform%3DAndroid">нажмите на эту ссылку для подробной инструкции.</a></li>
										</ul>
									</div>
									<div id="contact">
										<h4>У меня есть к вам предложение. Как с вами связаться?</h4>
										<p>Напишите нам по email'у contact@truckdriver.help</p>
										<p>Либо в Телераме <a style={{textDecoration: "underline"}} href="www.t.me/tdhsupport">www.t.me/tdhsupport</a></p>
									</div>
								</div>

								<div className="article-footer">
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