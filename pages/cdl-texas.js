import React from "react";
import Navbar from "@/components/_App/Navbar";
import PageBannerStyle1 from "@/components/Common/PageBannerStyle1";
import BlogSidebar from "@/components/Blog/BlogSidebar";
import Footer from "@/components/_App/Footer";
import Head from "next/head";
import Image from "next/image";

const CDLtexas = () => {
	return (
		<>
			<Head>
				<title>CDL Тесты - Техас CVO Knowledge тест</title>
				<meta
					name="description"
					content="CDL Тесты - Техас CVO Knowledge тест"
				/>

				{/* Google / Search Engine Tags */}
				<meta
					itemprop="name"
					content="Приложение CDL Help - Тесты CDL на русском языке"
				/>
				<meta
					itemprop="description"
					content="CDL Help - Инструкция по применению приложения CDL Help."
				/>
				<meta
					itemprop="image"
					content="https://cdlhelp.app/images/cdlhelp-tag.jpg"
				/>

				{/* Facebook Meta Tags */}
				<meta property="og:url" content="https://www.cdlhelp.app" />
				<meta property="og:type" content="article" />
				<meta
					property="og:title"
					content="Приложение CDL Help - Тесты CDL на русском языке"
				/>
				<meta
					property="og:description"
					content="CDL Help - Инструкция по применению приложения CDL Help."
				/>
				<meta
					property="og:image"
					content="https://cdlhelp.app/images/cdlhelp-tag.jpg"
				/>

				{/* Twitter Meta Tags */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta
					name="twitter:title"
					content="Приложение CDL Help - Тесты CDL на русском языке"
				/>
				<meta
					name="twitter:description"
					content="CDL Help - Инструкция по применению приложения CDL Help."
				/>
				<meta
					name="twitter:image"
					content="https://cdlhelp.app/images/cdlhelp-tag.jpg"
				/>
			</Head>
			<Navbar />

			<PageBannerStyle1
				pageTitle="CDL Тесты - Техас CVO Knowledge тест"
				homePageUrl="/"
				homePageText="Главная Страница"
				activePageText="CDL Тесты - Техас CVO Knowledge тест"
			/>

			<div className="blog-details-area ptb-75">
				<div className="container">
					<div className="row">
						<div className="col-lg-8 col-md-12">
							<div className="blog-details-desc">

								<div className="article-content">
									<p>
										Приложение CDL Help - одно из самых надежных и эффективных
										инструментов для подготовки к CDL тестам в DMV для
										иммигрантов. Это приложение разработано с учетом
										потребностей всех пользователей, предлагающее не только
										всеобъемлющий контент для подготовки к тестам, но и дающий
										дополнительные возможности для практики английского языка,
										что является незаменимым навыком для успешной карьеры в
										сфере коммерческого вождения в США.
									</p>

									<p>
										Для сдачи экзамена CDL необходимо успешное прохождение трех
										тестов - General Knowledge, Combination и Air Brake. Наше
										приложение предлагает две версии каждого из этих тестов,
										покрывающие большинство вопросов, которые могут встретиться
										в DMV. Это дает пользователям возможность ознакомиться с
										потенциальными вопросами и ответами перед сдачей экзамена.
									</p>
									<h4>Группа для начинающих дальнобойщиков</h4>
									<p>
										<a
											href="https://www.t.me/truckdrivergroup"
											style={{
												fontWeight: "bold",
												textDecoration: "underline",
											}}
											target="_blank"
										>
											Мы рекомендуем присоединиться к группе в Телеграм.
										</a>{" "}
										В группе вы можете ознакомиться с отзывами других
										пользователей, задать свои вопросы, а также обменяться
										опытом с другими участниками группы.
									</p>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>Color of clearance lamps on front of a vehicle</div>
											<div>Amber</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Цвет противотуманных фар спереди автомобиля должен быть</div>
											<div>Янтарным</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>The load on a vehicle may not extend beyond the front of the vehicles, without a special permit, more than:</div>
											<div>Three feet</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Груз на транспортном средстве не должен выступать за переднюю часть транспортного средства без специального разрешения больше, чем....</div>
											<div>три фита</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>Trailer and semitrailers must ordinarily have brakes that can be applied by the driver when the gross weight of the trailer exceeds:</div>
											<div>4,500 pounds</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Прицепы и полуприцепы должны иметь тормоза, которые обычно могут быть применены водителем, когда вес прицепа превышает</div>
											<div>4,500 паундов</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>The load on a truck may not extend over the rear of the vehicle more than:</div>
											<div>four feet</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Груз на грузовике не должен выступать за заднюю часть транспортного средства больше, чем</div>
											<div>4 фита</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>All trailers or semitrailers must be equipped with clearance lamps, side marker lamps, and side reflectors if their width is:</div>
											<div>80 inches or more</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Все прицепы или полуприцепы должны быть оснащены проблесковыми огнями, боковыми маркерными огнями и боковыми отражателями, если их ширина составляет</div>
											<div>80 инчев или больше</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>To find out the details about registering your particular vehicle, you should consult:</div>
											<div>County Tax-Assessor Collector</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Чтобы узнать подробности о регистрации вашего конкретного транспортного средства, вы должны обратиться к</div>
											<div>Коллектор налогов округа</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>When one truck is following another truck or vehicle, it may keep far enough back to allow how many vehicles to enter safely between them?</div>
											<div>One vehicle</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Когда один грузовик следует за другим грузовиком или транспортным средством, он должен держаться на достаточном расстоянии, чтобы позволить какому количеству транспортных средств безопасно войти между ними</div>
											<div>одному транспортному средству</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>Turn signal indicators are required on all motor vehicles manufactured after model year?</div>
											<div>1959</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Поворотные указатели обязательны на всех автомобилях, произведенных после какого модельного года?</div>
											<div>1959</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>No combination of vehicles, other than a truck tractor-trailer combination, may exceed:</div>
											<div>65 feet</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Никакая комбинация транспортных средств, кроме комбинации грузовик-тягач с полуприцепом, не может превышать</div>
											<div>65 фит</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>Vehicles transporting loose materials (sand, dirt, gravel, etc.) that is capable of spilling or blowing from the vehicle must:</div>
											<div>Meet loading and/or covering regulations to prevent spilling or blowing.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Транспортные средства, перевозящие сыпучие материалы (песок, грязь, щебень и т.д.), которые сыпятся или разлетаются с транспортного средства, должны</div>
											<div>Соблюдать правила погрузки и/или накрытия, чтобы предотвратить просыпание или разлетание</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>Every farm tractor and every self-propelled unit of farm equipment or implement of husbandry manufactured or assembled after January 1, 1972, complies with state lighting laws by:</div>
											<div>Having two headlamps</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Каждый сельскохозяйственный трак и каждая самоходная единица сельскохозяйственной техники или орудия земледелия, изготовленные или собранные после 1 января 1972 года, соответствует законам штата о освещении путем</div>
											<div>Двух головных фар</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>The maximum speed limit for a taxicab on numbered U.S. or state highways in the daytime is:</div>
											<div>70 mph</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Максимальный предел скорости для такси на пронумерованных шоссе США или штатных шоссе днем составляет</div>
											<div>70 миль в час</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>To operate on the highway a motor vehicle or trailer having metal, tires and weighing 5,000 pounds or more, you must:</div>
											<div>Get a special permit from the Texas Department of Transportation.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Для движения по шоссе на автомобиле или прицепе, имеющем металлический каркас, шины и весом 5000 фунтов или более, вы должны</div>
											<div>Получить специальное разрешение от Департамента транспорта Техаса.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>During the times when lighted lamps are not required, the driver should set out:</div>
											<div>two approved red flags</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Во время движения, когда включенные лампы не требуются, водитель должен установить</div>
											<div>два красных флага</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>Before going down a steep grade with a commercial vehicle, you should:</div>
											<div>Shift to a lower gear.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Прежде чем спускаться по крутому склону на коммерческом транспортном средстве, вы должны</div>
											<div>Переключиться на более низкую передачу</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>Every trailer must have how many reflectors on the rear?</div>
											<div>Two</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>На задней части каждого прицепа сколько должно быть отражателей?</div>
											<div>Два</div>
										</div>
									</div>


									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>No passenger vehicle may be coupled with more than:</div>
											<div>One trailer</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Ни одно пассажирское транспортное средство не может быть соединено более чем</div>
											<div>С одним трейлером</div>
										</div>
									</div>


									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>When is it necessary to place flares around a truck on a two-way road with a clear view, one must be placed beside the truck, the other two must be placed:</div>
											<div>100 feet to the front and rear of the truck</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Когда необходимо расставить сигнальные ракеты вокруг грузовика на двухполосной дороге с открытым видом?</div>
											<div>100 футов впереди и позади грузовика</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>All school buses, buses, taxis, and other vehicles hauling passengers for hire or lease must carry a chemical type fire extinguisher of at least:</div>
											<div>One quart capacity.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Все школьные автобусы, автобусы, такси и транспортные средства, перевозящие пассажиров по найму или в аренду, должны иметь не менее</div>
											<div>Одной емкости</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>When a load extends more than four feet over the rear of a vehicle, what color flag must be attached to the extreme end of the extension while driving in the daytime?</div>
											<div>Red.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Когда груз выступает за заднюю часть автомобиля на расстояние более четырех футов, флаг какого цвета должен быть прикреплен к крайней точке выступа в течение дня?</div>
											<div>Красного.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>Which of the following motor vehicles must stop at all railroad grade crossings outside a business or residential district?</div>
											<div>Motor bus.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Какое из следующих моторных транспортных средств должно останавливаться на всех железнодорожных переездах вне бизнес- или жилого района?</div>
											<div>Автобус</div>
										</div>
									</div>


									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>The maximum number of trailers that may be lawfully towed by one vehicle is:</div>
											<div>Two</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Какое максимальное количество прицепов, которые законно могут быть прицеплены к одному транспортному средству?</div>
											<div>Два</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>The maximum number of trailers that may be towed by a commercial motor vehicle with an unloaded weight in excess of 2,500 pounds is:</div>
											<div>Two trailers.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Максимальное количество прицепов, которые может буксировать коммерческое автотранспортное средство с незагруженным весом более 2,500 фунтов, составляет</div>
											<div>Два прицепа</div>
										</div>
									</div>


									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>To haul a load or more equipment that is wider, heavier, or longer than the law permits, you must:</div>
											<div>Obtain a permit from the Texas Department of Transportation</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Для перевозки груза или оборудования, ширина, вес или длина которых превышают установленные законом пределы, вы должны</div>
											<div>Получить разрешение от Департамента транспорта Техаса</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>Clearance lights are required by state law for trucks or buses if the width is:</div>
											<div>80 inches or more</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Огни, определяющие размеры трака, обязательны по закону штата для грузовиков или автобусов, если ширина составляет</div>
											<div>80 инчей или больше</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>When towing another vehicle with a chain, rope, or cable, what color flag must be attached to the chain, rope, or cable?</div>
											<div>White</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>При буксировке другого транспортного средства цепью, веревкой или кабелем, какого цвета флаг должен быть прикреплен к цепи, веревке или кабелю?</div>
											<div>Белого</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>It is unlawful to operate a motor vehicle on a highway with:</div>
											<div>Flanges or lugs on the wheels.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Запрещается управлять автотранспортным средством на автостраде с</div>
											<div>Фланцами или наконечниками на колесах</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>One purpose of requiring registration papers on trucks at all times is to show:</div>
											<div>The weight of the truck empty and how much it is registered to haul.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Одна из целей требования наличия регистрационных документов на грузовиках в любое время - это показать</div>
											<div>Вес грузовика без нагрузки и на сколько он зарегистрирован для перевозки</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>The top speed limit for heavy trucks on designated rural interstate in the nighttime is:</div>
											<div>65 mph</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Максимально допустимый предел скорости для грузовиков на специально обозначенных сельских магистралях ночью составляет</div>
											<div>65 миль в час</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>When going downhill with a commercial vehicle, it is unlawful to:</div>
											<div>Coast.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>При спуске с горы на коммерческом транспортном средстве нельзя использовать ....</div>
											<div>Инерцию</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>Which of the following vehicles are not required to have mud flaps?</div>
											<div>Pole trailers.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Какие из следующих транспортных средств не обязаны иметь защитные резиновые брызговики от брызг?</div>
											<div>Трейлер с опорой</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>What is the maximum speed limit for a taxicab on a numbered U.S. or state highway during the day?</div>
											<div>70 mph</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Каков максимальный предел скорости для такси на пронумерованной трассе США или штата в течение дня?</div>
											<div>70 миль в час</div>
										</div>
									</div>


									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>A slowing moving vehicle emblem must be displayed only by:</div>
											<div>Vehicles designed to be operated at speeds of 25 mph or less.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Эмблема медленно движущегося транспортного средства должна быть установлена только</div>
											<div>На транспортных средствах, предназначенных для эксплуатации со скоростью 25 миль в час или менее</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>The first thing the driver of a disabled truck or bus should do is:</div>
											<div>Set out flares, reflectors, or flags.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Первое, что должен сделать водитель заглушенного грузовика или автобуса, это</div>
											<div>Расставить сигнальные огни, отражатели или флажки</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>The length requirements of state law for vehicles or combinations of vehicles, including extensions over the front and rear, do not apply:</div>
											<div>Within city limits.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Требования законодательства штата по длине для транспортных средств или их комбинаций, включая выступы впереди и сзади, не применяются</div>
											<div>В пределах городских границ</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>The height from the ground for mounting reflectors must be at least:</div>
											<div>24 inches</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Высота от земли для установки отражателей должна быть не менее</div>
											<div>24 дюймов</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>When turning with a long vehicle or combination truck-trailer, if it is impossible to stay in the proper lane, you should:</div>
											<div>Approach the corner about 4 feet from the curb or right edge of the roadway, then if necessary, complete the turn in the center of the street entered.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>При повороте длинным транспортным средством или комбинацией грузовика-прицепа, если невозможно оставаться в правильной полосе, вы должны</div>
											<div>Подъехать к углу примерно на 4 фута от бордюра или правого края проезжей части, затем, при необходимости, завершить поворот в центре дороги, на которую въезжаете.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>Clearence lamps mounted on the rear or on the side near the rear of a vehicle must be what color?</div>
											<div>Red.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Противотуманные огни, установленные сзади или по бокам около задней части автомобиля, должны быть какого цвета</div>
											<div>Красного</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>When stopped on the side of a divided highway, flags or reflectors must be placed:</div>
											<div>One 10 feet behind the vehicle, one 100 feet behind, and one 200 feet behind the vehicles.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>При остановке на обочине разделенной дороги необходимо установить флажки или отражатели</div>
											<div>Один в 10 футах позади транспортного средства, один в 100 футах позади и один в 200 футах позади транспортных средств.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>The maximum speed limit for a pickup truck with a manufacturer's rated carrying capacity of 2,000 lbs or less on U.S. or state highway in the daytime is:</div>
											<div>70 mph</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Максимальное ограничение скорости для пикапа с номинальной грузоподъемностью производителя 2 000 фунтов или менее на автомагистралях США или штата в дневное время составляет</div>
											<div>70 миль в час</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>When backing a large truck you should:</div>
											<div>Have someone guide you.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>При движении большого грузовика задним ходом вы должны</div>
											<div>Попросить кого-то направлять вас</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>The greatest weight allowed by state law for any vehicle including its load is:</div>
											<div>80,000 pounds</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Наибольший вес, разрешенный законами штата для любого транспортного средства, включая его вес, составляет</div>
											<div>80,000 фунтов</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>The greatest height ordinarily allowed by state law for a vehicle including its load is:</div>
											<div>14 feet</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Наибольшая высота, обычно разрешенная законами штата для транспортного средства, включая высоту его груза, составляет</div>
											<div>14 фитов</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>The greatest width allowed by State law for a truck including its load is:</div>
											<div>102 inches or 8 1/2 ft</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Наибольшая ширина, разрешенная законом штата для грузовика включая его груз, составляет</div>
											<div>102 дюйма или 8 1/2 фута</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>The greatest length allowed by State law for a single motor vehicle other than a truck tractor is:</div>
											<div>45 feet</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Наибольшая длина, разрешенная законом штата для одиночного автотранспортного средства, за исключением грузового тягача, составляет.</div>
											<div>45 футов</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>One purpose of requiring registration papers on trucks at all times is to show:</div>
											<div>Weight of the truck empty and how much it is registered to haul.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Одна из целей требования наличия регистрационных документов на грузовиках в любое время - показать</div>
											<div>вес грузовика без нагрузки и сколько он зарегистрирован для перевозки.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>To operate on the highway a motor vehicle or trailer having metal tires and weighting 5,000 lbs or more must have:</div>
											<div>A special permit from the Department of Transportation.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Для движения по шоссе моторное транспортное средство или прицеп, имеющий металлические шины и весом 5,000 фунтов или более, должен иметь:</div>
											<div>Специальное разрешение от Департамента транспорта.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>To prevent damage to the highway it is unlawful to operate any motor vehicle with:</div>
											<div>Studs or spikes on the wheels.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Для предотвращения повреждений дороги запрещено эксплуатировать любое моторное транспортное средство с:</div>
											<div>С торчащими шипами на колесах.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>Air brake systems combine what three different systems?</div>
											<div>Service brakes, parking brakes, and emergency brakes.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Системы пневматических тормозов объединяют какие три различные системы?</div>
											<div>Сервисные тормоза, парковочные тормоза и аварийные тормоза.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>When should you drain the air tanks?</div>
											<div>After every working day.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>"Когда следует сливать воздушные баки?"</div>
											<div>Каждый рабочий день.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>Why drain water from the compressed air tanks?</div>
											<div>Water can freeze in cold weather and cause brake failure.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Зачем сливать воду из сжатых воздушных баков?</div>
											<div>Вода может замерзнуть в холодную погоду и вызвать отказ тормозов.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>Air brake-equipped vehicles must have:</div>
											<div>A supply pressure gauge and a warning signal when psi drops below 60.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>У автомобилей с пневматическими тормозами должны быть:</div>
											<div>Манометр для контроля давления подачи и предупредительный сигнал при снижении давления ниже 60 psi.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>What can legally hold a parking or emergency brake in position for a truck, truck tractor, or bus?</div>
											<div>Spring pressure.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Что может правильно удерживать парковочный или аварийный тормоз в положении для грузовика, грузового тягача или автобуса?</div>
											<div>Пружинное давление.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>The first thing you should do when the low air pressure warning comes on?</div>
											<div>Stop and safely park ASAP.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Первое, что вам следует сделать, когда загорается предупреждение о низком давлении воздуха?</div>
											<div>Остановиться и безопасно припарковаться как можно скорее.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>The braking power of the spring brakes:</div>
											<div>Depends on the adjustment of the service brakes.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Тормозная мощность пружинных тормозов:</div>
											<div>Зависит от регулировки сервисных тормозов.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>The application pressure gauge shows the driver how much pressure:</div>
											<div>Is being applied to the brakes.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Manometer нагрузки показывает водителю, какое давление:</div>
											<div>Применяется к тормозам.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>Which type of brake is the most common in commercial vehicles?</div>
											<div>S-cam brake</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Какой тип тормоза наиболее распространен в коммерческих транспортных средствах?</div>
											<div>Тормоз с S-образным механизмом</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>An application pressure gauge...</div>
											<div>Shows how much air pressure you are applying to the brakes.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Манометр нагрузки</div>
											<div>Показывает, сколько воздушного давления вы прикладываете к тормозам.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>To test service brakes you should...</div>
											<div>Release the parking brake, move forward slowly, and depress the brakes.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Чтобы протестировать сервисные тормоза, вы должны...</div>
											<div>Отпустить парковочный тормоз, медленно продвинуться вперед и нажать на тормоза.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>Air brakes take longer to stop than hydraulic brakes because...</div>
											<div>It takes longer for the air to flow through the lines.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Пневматические тормоза останавливаются дольше, чем гидравлические тормоза, потому что</div>
											<div>Воздуху требуется больше времени для прохождения через линии.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>The proper way to go down long grades is to...</div>
											<div>Apply brakes just hard enough to reduce speed to 5 mph below safe speed, then release until back to safe speed and repeat the process.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Правильный способ спускаться по длинным уклонам ...</div>
											<div>Нажмите на тормоза достаточно сильно, чтобы снизить скорость на 5 миль в час ниже безопасной скорости, затем отпустите, пока не вернетесь к безопасной скорости, и повторите процесс.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>When should you avoid using the parking brake?</div>
											<div>When the brakes are hot.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Когда следует избегать использования парковочного тормоза.</div>
											<div>Когда тормоза горячие</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>If your vehicle has an alcohol evaporator, everyday during cold weather you should:</div>
											<div>Check and fill the alcohol level.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Если ваше транспортное средство оснащено спиртовым испарителем, в холодную погоду каждый день вам следует</div>
											<div>Проверьте и долейте спирт</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>During normal driving, spring brakes are usually held back by what?</div>
											<div>Air pressure</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Во время нормального движения пружинные тормоза обычно удерживаются</div>
											<div>Давлением воздуха</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>In air brake vehicles, the parking brakes should be used when?</div>
											<div>Whenever the vehicle is parked.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>На транспортных средствах с пневматическим тормозом парковочные тормоза должны использоваться, когда</div>
											<div>Транспортное средство припарковано.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>The brake pedal in an air brake system does what?</div>
											<div>Controls the air pressure applied to put on the brakes.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Педаль тормоза в пневматической системе</div>
											<div>Управляется давлением воздуха, применяемым для нажатия на тормоза.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>A straight truck or bus air brake system should not leak at a rate of more than ____ PSI per minute with the engine off and the brakes released.</div>
											<div>2</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Система пневматического тормоза прямого грузовика или автобуса не должна течь со скоростью более ____ PSI в минуту с выключенным двигателем и отпущенными тормозами.</div>
											<div>2</div>
										</div>
									</div>


									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>An alcohol evaporator does what?</div>
											<div>Reduces the risk of ice in the air brake valves in cold weather.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Спиртовой испаритель выполняет функцию.</div>
											<div>Снижает риск образования льда в пневматических клапанах тормозной системы в холодную погоду</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>Air loss should not be more than ___ with the engine off and brakes released.</div>
											<div>2 psi per minute</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Потери воздуха не должны превышать ___ с выключенным двигателем и отпущенными тормозами</div>
											<div>2 psi в минуту</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>How do you know when your brakes are fading?</div>
											<div>You have to push harder on the brake pedal to control your speed on a downgrade.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Как вы узнаете, когда ваши тормоза ослабевают?</div>
											<div>Вы должны сильнее нажимать на педаль тормоза, чтобы контролировать скорость на спуске</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>To check the free play of manual slack adjusters on S-cam brakes you should:</div>
											<div>Park on a level ground, chock wheels, and release parking brake.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Для проверки свободного хода регуляторов зазора ручного типа на тормозах с S-образным механизмом вы должны:</div>
											<div>Припарковаться на ровной поверхности, подложить клинья под колеса и отпустить парковочный тормоз.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>When driving down a long steep hill you should:</div>
											<div>Release the brake when you are 5 mph below your safe speed.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>При движении вниз по длинному крутому холму вы должны:</div>
											<div>Отпустить тормоз, когда ваша скорость находится на 5 миль в час ниже вашей безопасной скорости.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>The most common type of foundation brakes found on heavy vehicles is the:</div>
											<div>S-cam drum</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Самый распространенный тип основных тормозов, которые можно найти на тяжелых транспортных средствах, это:</div>
											<div>Барабан S-образной формы</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>Air brakes should be drained...</div>
											<div>1. At the end of each working day.</div>
											<div>2. To keep sludge from clogging system valves.</div>
											<div>3. Manually when automatic devices fail.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Пневматические тормоза должны быть осушены...</div>
											<div>1. В конце каждого рабочего дня.</div>
											<div>2. Чтобы предотвратить засорение клапанов системы осадком.</div>
											<div>3. Вручную при отказе автоматических устройств.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>The governor allows the air to start pumping again when it reaches the cut-in level or around...</div>
											<div>100 psi</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Регулятор позволяет воздуху начать снова подкачиваться, когда он достигает уровня срабатывания или около него.</div>
											<div>100 psi</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>You should not use the parking brakes...</div>
											<div>When the brakes are hot.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Вы не должны использовать парковочный тормоз...</div>
											<div>Когда тормоза горячие</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>The air compressor governor controls...</div>
											<div>When the air compressor pumps air into the storage tanks.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Регулятор воздушного компрессора управляет...</div>
											<div>Когда воздушный компрессор подкачивает воздух в резервуары</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>A dual air brake system...</div>
											<div>Has two brake systems and one set of controls.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Двойная пневматическая тормозная система...</div>
											<div>Имеет две тормозные системы и один набор управления</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>An emergency brake...</div>
											<div>Is required on commercial vehicles, must be held by mechanical force, could be activated by loss of air pressure.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Аварийный тормоз...</div>
											<div>Требуется на коммерческих транспортных средствах, должен удерживаться механической силой, может быть активирован утечкой воздушного давления.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>With dual air systems, the air pressure should build...</div>
											<div>From 85 to 100 psi in 45 seconds</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>При двойных воздушных системах давление воздуха должно нарастать...</div>
											<div>От 85 до 100 psi за 45 секунд</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>A fully charged air system typically has ____ psi.</div>
											<div>125</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>В полностью заряженной воздушной системе обычно есть ____ psi.</div>
											<div>125</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>To test air leakage rate you should...</div>
											<div>Turn off engine and release the service brake.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>Для проверки скорости утечки воздуха вы должны...</div>
											<div>Выключить двигатель и отпустить сервисный тормоз.</div>
										</div>
									</div>

									<div className="tx-quiz-card">
										<div className="tx-quiz-card-column">
											<div>When testing air leakage rates for combination vehicles (before applying the brake pedal), air brake systems should not lose air faster than...</div>
											<div>3 psi per minute.</div>
										</div>
										<div className="tx-card-line"></div>
										<div className="tx-quiz-card-column">
											<div>При проверке скорости утечки воздуха для комбинированных транспортных средств (перед нажатием педали тормоза) пневматические тормозные системы не должны терять воздух быстрее, чем...</div>
											<div>3 psi в минуту</div>
										</div>
									</div>





								</div>

								<div className="article-footer">
									<div className="post-author-meta">
										<div className="d-flex align-items-center">
											<img src="/images/logo-adaptive.png" alt="user" />
											<div className="title">
												<span className="name">Автор TruckDirver.help</span>
												<span className="date">10 Ноябрь, 2023</span>
											</div>
										</div>
									</div>
								</div>
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
	);
};

export default CDLtexas;
