#!/usr/bin/env node

/**
 * Translate school page content to all supported languages
 */

const fs = require('fs');
const path = require('path');

// Translation mappings for the new content
const translations = {
  stateOverviewTitle: {
    en: 'CDL Training in {{state}}',
    ru: 'CDL обучение в {{state}}',
    uk: 'CDL навчання в {{state}}',
    ar: 'التدريب على CDL في {{state}}',
    ko: '{{state}}의 CDL 교육',
    zh: '{{state}}的CDL培训',
    tr: '{{state}} CDL Eğitimi',
    pt: 'Treinamento CDL em {{state}}',
  },
  stateOverviewText: {
    en: '{{state}} offers numerous opportunities for aspiring commercial truck drivers. With a growing transportation industry and strategic location for freight distribution, obtaining your CDL in {{state}} opens doors to a rewarding career. Our comprehensive directory helps you find accredited CDL schools that offer Class A and Class B licenses, endorsement training, and job placement assistance.',
    ru: '{{state}} предлагает множество возможностей для начинающих водителей грузовиков. С растущей транспортной отраслью и стратегическим расположением для распределения грузов, получение CDL в {{state}} открывает двери к успешной карьере. Наш подробный каталог поможет вам найти аккредитованные школы CDL, которые предлагают лицензии класса A и B, обучение подтверждениям и помощь в трудоустройстве.',
    uk: "{{state}} пропонує численні можливості для майбутніх водіїв вантажівок. З зростаючою транспортною галуззю та стратегічним розташуванням для розподілу вантажів, отримання CDL в {{state}} відкриває двері до успішної кар'єри. Наш детальний каталог допоможе вам знайти акредитовані школи CDL, які пропонують ліцензії класу A та B, навчання схваленням та допомогу в працевлаштуванні.",
    ar: 'تقدم {{state}} فرصًا عديدة لسائقي الشاحنات التجارية الطموحين. مع صناعة النقل المتنامية والموقع الاستراتيجي لتوزيع الشحن، فإن الحصول على CDL في {{state}} يفتح الأبواب أمام مهنة مجزية. يساعدك دليلنا الشامل في العثور على مدارس CDL المعتمدة التي تقدم تراخيص الفئة A والفئة B، والتدريب على التصديقات، والمساعدة في التوظيف.',
    ko: '{{state}}는 상업용 트럭 운전사를 꿈꾸는 사람들에게 많은 기회를 제공합니다. 성장하는 운송 산업과 화물 유통을 위한 전략적 위치로 {{state}}에서 CDL을 취득하면 보람 있는 경력의 문이 열립니다. 우리의 포괄적인 디렉토리는 클래스 A 및 클래스 B 라이센스, 승인 교육 및 취업 지원을 제공하는 공인 CDL 학교를 찾는 데 도움이 됩니다.',
    zh: '{{state}}为有志成为商业卡车司机的人提供了众多机会。随着运输业的发展和货运分配的战略位置，在{{state}}获得CDL将为您开启一个有回报的职业生涯。我们的综合目录帮助您找到提供A类和B类驾照、认证培训和就业协助的认证CDL学校。',
    tr: "{{state}}, ticari kamyon sürücüsü olmak isteyenler için çok sayıda fırsat sunuyor. Büyüyen ulaşım endüstrisi ve yük dağıtımı için stratejik konumu ile {{state}}'de CDL almanız ödüllendirici bir kariyerin kapılarını açıyor. Kapsamlı rehberimiz, A Sınıfı ve B Sınıfı lisanslar, onay eğitimi ve iş yerleştirme yardımı sunan akredite CDL okullarını bulmanıza yardımcı olur.",
    pt: '{{state}} oferece inúmeras oportunidades para aspirantes a motoristas de caminhão comercial. Com uma indústria de transporte em crescimento e localização estratégica para distribuição de carga, obter seu CDL em {{state}} abre portas para uma carreira gratificante. Nosso diretório abrangente ajuda você a encontrar escolas CDL credenciadas que oferecem licenças Classe A e Classe B, treinamento de endosso e assistência na colocação profissional.',
  },
  whyChooseStateTitle: {
    en: 'Why Choose {{state}} for CDL Training?',
    ru: 'Почему стоит выбрать {{state}} для обучения CDL?',
    uk: 'Чому варто обрати {{state}} для навчання CDL?',
    ar: 'لماذا تختار {{state}} للتدريب على CDL؟',
    ko: 'CDL 교육을 위해 {{state}}를 선택해야 하는 이유',
    zh: '为什么选择{{state}}进行CDL培训？',
    tr: 'CDL Eğitimi için Neden {{state}}?',
    pt: 'Por que escolher {{state}} para treinamento CDL?',
  },
  whyChooseStateText: {
    en: "{{state}} is home to some of the nation's top CDL training programs. The state's robust trucking industry means high demand for qualified drivers, competitive salaries, and excellent job security. Local CDL schools offer flexible scheduling options including weekend and evening classes, financial aid opportunities, and hands-on training with modern equipment.",
    ru: '{{state}} является домом для некоторых из лучших программ обучения CDL в стране. Развитая индустрия грузоперевозок штата означает высокий спрос на квалифицированных водителей, конкурентоспособную зарплату и отличную гарантию занятости. Местные школы CDL предлагают гибкие варианты расписания, включая занятия в выходные и вечерние часы, возможности финансовой помощи и практическое обучение на современном оборудовании.',
    uk: '{{state}} є домом для деяких з найкращих програм навчання CDL в країні. Розвинена індустрія вантажоперевезень штату означає високий попит на кваліфікованих водіїв, конкурентну зарплату та відмінну гарантію зайнятості. Місцеві школи CDL пропонують гнучкі варіанти розкладу, включаючи заняття у вихідні та вечірні години, можливості фінансової допомоги та практичне навчання на сучасному обладнанні.',
    ar: '{{state}} هي موطن لبعض من أفضل برامج التدريب على CDL في البلاد. تعني صناعة النقل بالشاحنات القوية في الولاية ارتفاع الطلب على السائقين المؤهلين والرواتب التنافسية والأمان الوظيفي الممتاز. تقدم مدارس CDL المحلية خيارات جدولة مرنة بما في ذلك دروس نهاية الأسبوع والمساء، وفرص المساعدة المالية، والتدريب العملي بالمعدات الحديثة.',
    ko: '{{state}}는 미국 최고의 CDL 교육 프로그램이 있는 곳입니다. 주의 강력한 트럭 운송 산업은 자격을 갖춘 운전자에 대한 높은 수요, 경쟁력 있는 급여, 우수한 직업 안정성을 의미합니다. 지역 CDL 학교는 주말 및 저녁 수업을 포함한 유연한 일정 옵션, 재정 지원 기회, 최신 장비를 사용한 실습 교육을 제공합니다.',
    zh: '{{state}}拥有全国一些顶级的CDL培训项目。该州强大的卡车运输行业意味着对合格司机的高需求、有竞争力的薪资和出色的工作保障。当地CDL学校提供灵活的时间安排，包括周末和晚间课程、经济援助机会以及使用现代设备的实践培训。',
    tr: '{{state}}, ülkenin en iyi CDL eğitim programlarından bazılarına ev sahipliği yapmaktadır. Eyaletin güçlü kamyon taşımacılığı endüstrisi, kalifiye sürücülere yüksek talep, rekabetçi maaşlar ve mükemmel iş güvenliği anlamına gelir. Yerel CDL okulları, hafta sonu ve akşam dersleri dahil esnek zamanlama seçenekleri, mali yardım fırsatları ve modern ekipmanlarla uygulamalı eğitim sunar.',
    pt: '{{state}} é o lar de alguns dos melhores programas de treinamento CDL do país. A robusta indústria de caminhões do estado significa alta demanda por motoristas qualificados, salários competitivos e excelente segurança no emprego. As escolas CDL locais oferecem opções de agendamento flexíveis, incluindo aulas nos fins de semana e à noite, oportunidades de ajuda financeira e treinamento prático com equipamentos modernos.',
  },
  cityOverviewTitle: {
    en: 'CDL Schools in {{city}}, {{state}}',
    ru: 'Школы CDL в {{city}}, {{state}}',
    uk: 'Школи CDL в {{city}}, {{state}}',
    ar: 'مدارس CDL في {{city}}، {{state}}',
    ko: '{{city}}, {{state}}의 CDL 학교',
    zh: '{{city}}, {{state}}的CDL学校',
    tr: '{{city}}, {{state}} CDL Okulları',
    pt: 'Escolas CDL em {{city}}, {{state}}',
  },
  cityOverviewText: {
    en: "Find the best commercial driving schools in {{city}} and start your trucking career today. {{city}} CDL schools provide comprehensive training programs designed to prepare you for the CDL exam and a successful career in commercial driving. With experienced instructors and state-of-the-art training facilities, you'll gain the skills and confidence needed to excel in the trucking industry.",
    ru: 'Найдите лучшие школы коммерческого вождения в {{city}} и начните свою карьеру водителя грузовика сегодня. Школы CDL {{city}} предоставляют комплексные программы обучения, разработанные для подготовки вас к экзамену CDL и успешной карьере в коммерческом вождении. С опытными инструкторами и современными учебными объектами вы получите навыки и уверенность, необходимые для успеха в индустрии грузоперевозок.',
    uk: "Знайдіть найкращі школи комерційного водіння в {{city}} і почніть свою кар'єру водія вантажівки сьогодні. Школи CDL {{city}} надають комплексні програми навчання, розроблені для підготовки вас до іспиту CDL та успішної кар'єри в комерційному водінні. З досвідченими інструкторами та сучасними навчальними об'єктами ви отримаєте навички та впевненість, необхідні для успіху в індустрії вантажоперевезень.",
    ar: 'ابحث عن أفضل مدارس القيادة التجارية في {{city}} وابدأ مسيرتك المهنية في قيادة الشاحنات اليوم. توفر مدارس CDL في {{city}} برامج تدريب شاملة مصممة لإعدادك لامتحان CDL ومهنة ناجحة في القيادة التجارية. مع مدربين ذوي خبرة ومرافق تدريب حديثة، ستكتسب المهارات والثقة اللازمة للتميز في صناعة النقل بالشاحنات.',
    ko: '{{city}}에서 최고의 상업 운전 학교를 찾아 오늘 트럭 운전 경력을 시작하세요. {{city}} CDL 학교는 CDL 시험과 상업 운전에서의 성공적인 경력을 준비하도록 설계된 포괄적인 교육 프로그램을 제공합니다. 경험이 풍부한 강사와 최첨단 교육 시설을 통해 트럭 운송 산업에서 탁월하게 필요한 기술과 자신감을 얻을 수 있습니다.',
    zh: '在{{city}}找到最好的商业驾驶学校，今天就开始您的卡车驾驶生涯。{{city}}的CDL学校提供全面的培训项目，旨在为您准备CDL考试和商业驾驶的成功职业生涯。通过经验丰富的教练和最先进的培训设施，您将获得在卡车运输行业中脱颖而出所需的技能和信心。',
    tr: "{{city}}'deki en iyi ticari sürücü okullarını bulun ve kamyon şoförlüğü kariyerinize bugün başlayın. {{city}} CDL okulları, sizi CDL sınavına ve ticari sürücülükte başarılı bir kariyere hazırlamak için tasarlanmış kapsamlı eğitim programları sunar. Deneyimli eğitmenler ve son teknoloji eğitim tesisleri ile kamyon taşımacılığı endüstrisinde başarılı olmak için gereken becerileri ve güveni kazanacaksınız.",
    pt: 'Encontre as melhores escolas de condução comercial em {{city}} e comece sua carreira de motorista de caminhão hoje. As escolas CDL de {{city}} oferecem programas de treinamento abrangentes projetados para prepará-lo para o exame CDL e uma carreira bem-sucedida na condução comercial. Com instrutores experientes e instalações de treinamento de última geração, você ganhará as habilidades e a confiança necessárias para se destacar na indústria de caminhões.',
  },
  trainingProgramsTitle: {
    en: 'Available CDL Training Programs',
    ru: 'Доступные программы обучения CDL',
    uk: 'Доступні програми навчання CDL',
    ar: 'برامج التدريب CDL المتاحة',
    ko: '이용 가능한 CDL 교육 프로그램',
    zh: '可用的CDL培训项目',
    tr: 'Mevcut CDL Eğitim Programları',
    pt: 'Programas de Treinamento CDL Disponíveis',
  },
  trainingProgramsText: {
    en: 'CDL schools in {{location}} typically offer several training options to meet different career goals. Class A CDL programs prepare you to drive tractor-trailers and other large commercial vehicles. Class B CDL training qualifies you for straight trucks, buses, and delivery vehicles. Many schools also offer endorsement training for hazmat, tanker, doubles/triples, and passenger vehicles.',
    ru: 'Школы CDL в {{location}} обычно предлагают несколько вариантов обучения для достижения различных карьерных целей. Программы CDL класса A готовят вас к управлению тягачами с прицепом и другими крупными коммерческими транспортными средствами. Обучение CDL класса B дает право управлять прямыми грузовиками, автобусами и транспортными средствами доставки. Многие школы также предлагают обучение для получения подтверждений для опасных материалов, цистерн, двойных/тройных прицепов и пассажирских транспортных средств.',
    uk: "Школи CDL в {{location}} зазвичай пропонують кілька варіантів навчання для досягнення різних кар'єрних цілей. Програми CDL класу A готують вас до керування тягачами з причепом та іншими великими комерційними транспортними засобами. Навчання CDL класу B дає право керувати прямими вантажівками, автобусами та транспортними засобами доставки. Багато шкіл також пропонують навчання для отримання схвалень для небезпечних матеріалів, цистерн, подвійних/потрійних причепів та пасажирських транспортних засобів.",
    ar: 'تقدم مدارس CDL في {{location}} عادة عدة خيارات تدريبية لتلبية أهداف مهنية مختلفة. تعدك برامج CDL من الفئة A لقيادة الجرارات والمقطورات والمركبات التجارية الكبيرة الأخرى. يؤهلك تدريب CDL من الفئة B للشاحنات المستقيمة والحافلات ومركبات التوصيل. تقدم العديد من المدارس أيضًا تدريبًا للحصول على تصديقات للمواد الخطرة والصهاريج والمقطورات المزدوجة/الثلاثية والمركبات الخاصة بالركاب.',
    ko: '{{location}}의 CDL 학교는 일반적으로 다양한 경력 목표를 충족하기 위해 여러 교육 옵션을 제공합니다. 클래스 A CDL 프로그램은 트랙터 트레일러 및 기타 대형 상업용 차량을 운전할 수 있도록 준비시킵니다. 클래스 B CDL 교육은 스트레이트 트럭, 버스 및 배달 차량에 대한 자격을 부여합니다. 많은 학교에서는 위험물, 탱커, 이중/삼중 트레일러 및 승객 차량에 대한 승인 교육도 제공합니다.',
    zh: '{{location}}的CDL学校通常提供几种培训选项以满足不同的职业目标。A类CDL项目让您准备驾驶牵引拖车和其他大型商用车辆。B类CDL培训使您有资格驾驶直卡车、公共汽车和送货车辆。许多学校还提供危险品、油罐车、双/三挂车和客运车辆的认证培训。',
    tr: "{{location}}'daki CDL okulları genellikle farklı kariyer hedeflerini karşılamak için çeşitli eğitim seçenekleri sunar. A Sınıfı CDL programları sizi çekici römorklar ve diğer büyük ticari araçları kullanmaya hazırlar. B Sınıfı CDL eğitimi sizi düz kamyonlar, otobüsler ve teslimat araçları için kalifiye eder. Birçok okul ayrıca tehlikeli maddeler, tanker, çift/üçlü römorklar ve yolcu araçları için onay eğitimi de sunar.",
    pt: 'As escolas CDL em {{location}} normalmente oferecem várias opções de treinamento para atender a diferentes objetivos de carreira. Os programas CDL Classe A preparam você para dirigir carretas e outros veículos comerciais grandes. O treinamento CDL Classe B qualifica você para caminhões retos, ônibus e veículos de entrega. Muitas escolas também oferecem treinamento de endosso para materiais perigosos, tanques, duplos/triplos e veículos de passageiros.',
  },
  costAndFinancingTitle: {
    en: 'CDL School Costs and Financial Aid',
    ru: 'Стоимость школы CDL и финансовая помощь',
    uk: 'Вартість школи CDL та фінансова допомога',
    ar: 'تكاليف مدرسة CDL والمساعدة المالية',
    ko: 'CDL 학교 비용 및 재정 지원',
    zh: 'CDL学校费用和经济援助',
    tr: 'CDL Okul Maliyetleri ve Mali Yardım',
    pt: 'Custos da Escola CDL e Ajuda Financeira',
  },
  costAndFinancingText: {
    en: 'CDL training costs vary by program length and type, typically ranging from $3,000 to $7,000. Many schools offer financial aid options including payment plans, workforce development grants, VA benefits for veterans, and company-sponsored training programs where employers cover tuition in exchange for a driving commitment.',
    ru: 'Стоимость обучения CDL варьируется в зависимости от продолжительности и типа программы, обычно от $3,000 до $7,000. Многие школы предлагают варианты финансовой помощи, включая планы платежей, гранты на развитие рабочей силы, льготы VA для ветеранов и программы обучения, спонсируемые компаниями, где работодатели покрывают стоимость обучения в обмен на обязательство работать водителем.',
    uk: "Вартість навчання CDL варіюється залежно від тривалості та типу програми, зазвичай від $3,000 до $7,000. Багато шкіл пропонують варіанти фінансової допомоги, включаючи плани платежів, гранти на розвиток робочої сили, пільги VA для ветеранів та програми навчання, що спонсоруються компаніями, де роботодавці покривають вартість навчання в обмін на зобов'язання працювати водієм.",
    ar: 'تختلف تكاليف التدريب على CDL حسب طول البرنامج ونوعه، وتتراوح عادة من 3000 دولار إلى 7000 دولار. تقدم العديد من المدارس خيارات المساعدة المالية بما في ذلك خطط الدفع ومنح تنمية القوى العاملة ومزايا VA للمحاربين القدامى وبرامج التدريب التي ترعاها الشركات حيث يغطي أصحاب العمل الرسوم الدراسية مقابل التزام القيادة.',
    ko: 'CDL 교육 비용은 프로그램 기간과 유형에 따라 다르며 일반적으로 $3,000에서 $7,000 사이입니다. 많은 학교에서는 지불 계획, 인력 개발 보조금, 재향 군인을 위한 VA 혜택, 고용주가 운전 약속 대신 수업료를 지불하는 회사 후원 교육 프로그램을 포함한 재정 지원 옵션을 제공합니다.',
    zh: 'CDL培训费用因项目长度和类型而异，通常在3,000美元到7,000美元之间。许多学校提供财政援助选项，包括付款计划、劳动力发展补助金、退伍军人VA福利，以及雇主支付学费以换取驾驶承诺的公司赞助培训项目。',
    tr: 'CDL eğitim maliyetleri program süresine ve türüne göre değişir, genellikle 3.000 ila 7.000 dolar arasındadır. Birçok okul, ödeme planları, işgücü geliştirme hibeleri, gaziler için VA yardımları ve işverenlerin sürüş taahhüdü karşılığında öğrenim ücretini karşıladığı şirket sponsorlu eğitim programları dahil mali yardım seçenekleri sunar.',
    pt: 'Os custos de treinamento CDL variam de acordo com a duração e o tipo do programa, normalmente variando de $3.000 a $7.000. Muitas escolas oferecem opções de ajuda financeira, incluindo planos de pagamento, subsídios para desenvolvimento da força de trabalho, benefícios VA para veteranos e programas de treinamento patrocinados por empresas, onde os empregadores cobrem as mensalidades em troca de um compromisso de condução.',
  },
  requirementsTitle: {
    en: 'CDL Requirements in {{state}}',
    ru: 'Требования CDL в {{state}}',
    uk: 'Вимоги CDL в {{state}}',
    ar: 'متطلبات CDL في {{state}}',
    ko: '{{state}}의 CDL 요구 사항',
    zh: '{{state}}的CDL要求',
    tr: '{{state}} CDL Gereksinimleri',
    pt: 'Requisitos CDL em {{state}}',
  },
  requirementsText: {
    en: "To obtain a CDL in {{state}}, you must be at least 18 years old for intrastate driving or 21 for interstate commerce, hold a valid driver's license, pass a DOT physical examination, and successfully complete written knowledge tests and skills tests. Most CDL schools help students navigate these requirements and prepare thoroughly for all examinations.",
    ru: 'Чтобы получить CDL в {{state}}, вам должно быть не менее 18 лет для вождения внутри штата или 21 год для межштатной торговли, иметь действительные водительские права, пройти медицинский осмотр DOT и успешно сдать письменные тесты на знания и тесты на навыки. Большинство школ CDL помогают студентам разобраться с этими требованиями и тщательно подготовиться ко всем экзаменам.',
    uk: 'Щоб отримати CDL в {{state}}, вам має бути принаймні 18 років для водіння в межах штату або 21 рік для міжштатної торгівлі, мати дійсні водійські права, пройти медичний огляд DOT та успішно скласти письмові тести на знання та тести на навички. Більшість шкіл CDL допомагають студентам розібратися з цими вимогами та ретельно підготуватися до всіх іспитів.',
    ar: 'للحصول على CDL في {{state}}، يجب أن يكون عمرك 18 عامًا على الأقل للقيادة داخل الولاية أو 21 عامًا للتجارة بين الولايات، وأن تحمل رخصة قيادة سارية، وأن تجتاز الفحص الطبي DOT، وأن تكمل بنجاح اختبارات المعرفة المكتوبة واختبارات المهارات. تساعد معظم مدارس CDL الطلاب على التنقل في هذه المتطلبات والاستعداد جيدًا لجميع الامتحانات.',
    ko: '{{state}}에서 CDL을 취득하려면 주 내 운전의 경우 최소 18세, 주간 상업의 경우 21세 이상이어야 하며, 유효한 운전 면허증을 소지하고, DOT 신체 검사를 통과하고, 필기 지식 시험과 기술 시험을 성공적으로 완료해야 합니다. 대부분의 CDL 학교는 학생들이 이러한 요구 사항을 탐색하고 모든 시험에 철저히 준비하도록 돕습니다.',
    zh: '要在{{state}}获得CDL，您必须年满18岁才能进行州内驾驶，或21岁才能进行州际贸易，持有有效的驾驶执照，通过DOT体检，并成功完成书面知识测试和技能测试。大多数CDL学校帮助学生了解这些要求，并为所有考试做好充分准备。',
    tr: "{{state}}'de CDL almak için, eyalet içi sürüş için en az 18 yaşında veya eyaletler arası ticaret için 21 yaşında olmalı, geçerli bir sürücü belgesi bulundurmalı, DOT fizik muayenesini geçmeli ve yazılı bilgi testlerini ve beceri testlerini başarıyla tamamlamalısınız. Çoğu CDL okulu, öğrencilerin bu gereksinimleri karşılamalarına ve tüm sınavlara kapsamlı bir şekilde hazırlanmalarına yardımcı olur.",
    pt: 'Para obter um CDL em {{state}}, você deve ter pelo menos 18 anos para dirigir dentro do estado ou 21 para comércio interestadual, possuir uma carteira de motorista válida, passar em um exame físico DOT e concluir com sucesso testes de conhecimento escritos e testes de habilidades. A maioria das escolas CDL ajuda os alunos a navegar por esses requisitos e se preparar completamente para todos os exames.',
  },
  faqTitle: {
    en: 'Frequently Asked Questions',
    ru: 'Часто задаваемые вопросы',
    uk: 'Часті запитання',
    ar: 'الأسئلة الشائعة',
    ko: '자주 묻는 질문',
    zh: '常见问题',
    tr: 'Sıkça Sorulan Sorular',
    pt: 'Perguntas Frequentes',
  },
  faqHowLong: {
    en: 'How long does CDL training take?',
    ru: 'Сколько времени занимает обучение CDL?',
    uk: 'Скільки часу займає навчання CDL?',
    ar: 'كم من الوقت يستغرق التدريب على CDL؟',
    ko: 'CDL 교육은 얼마나 걸리나요?',
    zh: 'CDL培训需要多长时间？',
    tr: 'CDL eğitimi ne kadar sürer?',
    pt: 'Quanto tempo leva o treinamento CDL?',
  },
  faqHowLongAnswer: {
    en: 'Most full-time CDL programs take 3-7 weeks to complete, while part-time programs may take 8-12 weeks. The duration depends on the license class and any additional endorsements.',
    ru: 'Большинство программ CDL с полной занятостью занимают 3-7 недель, в то время как программы с частичной занятостью могут занимать 8-12 недель. Продолжительность зависит от класса лицензии и любых дополнительных подтверждений.',
    uk: 'Більшість програм CDL з повною зайнятістю займають 3-7 тижнів, тоді як програми з частковою зайнятістю можуть займати 8-12 тижнів. Тривалість залежить від класу ліцензії та будь-яких додаткових схвалень.',
    ar: 'تستغرق معظم برامج CDL بدوام كامل من 3 إلى 7 أسابيع لإكمالها، بينما قد تستغرق البرامج بدوام جزئي من 8 إلى 12 أسبوعًا. تعتمد المدة على فئة الترخيص وأي تصديقات إضافية.',
    ko: '대부분의 풀타임 CDL 프로그램은 완료하는 데 3-7주가 걸리며, 파트타임 프로그램은 8-12주가 걸릴 수 있습니다. 기간은 라이센스 등급과 추가 승인에 따라 다릅니다.',
    zh: '大多数全日制CDL项目需要3-7周完成，而非全日制项目可能需要8-12周。持续时间取决于许可证类别和任何额外的认证。',
    tr: 'Çoğu tam zamanlı CDL programı tamamlanması 3-7 hafta sürerken, yarı zamanlı programlar 8-12 hafta sürebilir. Süre, lisans sınıfına ve ek onaylara bağlıdır.',
    pt: 'A maioria dos programas CDL em tempo integral leva de 3 a 7 semanas para ser concluída, enquanto os programas de meio período podem levar de 8 a 12 semanas. A duração depende da classe da licença e de quaisquer endossos adicionais.',
  },
  faqCanIWork: {
    en: 'Can I work while attending CDL school?',
    ru: 'Могу ли я работать во время обучения в школе CDL?',
    uk: 'Чи можу я працювати під час навчання в школі CDL?',
    ar: 'هل يمكنني العمل أثناء حضور مدرسة CDL؟',
    ko: 'CDL 학교에 다니면서 일할 수 있나요?',
    zh: '我可以在上CDL学校的同时工作吗？',
    tr: 'CDL okuluna devam ederken çalışabilir miyim?',
    pt: 'Posso trabalhar enquanto frequento a escola CDL?',
  },
  faqCanIWorkAnswer: {
    en: 'Yes, many CDL schools offer flexible scheduling with evening and weekend classes to accommodate working students. Part-time programs are specifically designed for those maintaining employment during training.',
    ru: 'Да, многие школы CDL предлагают гибкое расписание с вечерними занятиями и занятиями в выходные дни для работающих студентов. Программы с частичной занятостью специально разработаны для тех, кто сохраняет работу во время обучения.',
    uk: 'Так, багато шкіл CDL пропонують гнучкий розклад з вечірніми заняттями та заняттями у вихідні дні для працюючих студентів. Програми з частковою зайнятістю спеціально розроблені для тих, хто зберігає роботу під час навчання.',
    ar: 'نعم، تقدم العديد من مدارس CDL جدولة مرنة مع دروس مسائية ونهاية الأسبوع لاستيعاب الطلاب العاملين. تم تصميم البرامج بدوام جزئي خصيصًا لأولئك الذين يحافظون على وظائفهم أثناء التدريب.',
    ko: '예, 많은 CDL 학교는 일하는 학생들을 수용하기 위해 저녁 및 주말 수업으로 유연한 일정을 제공합니다. 파트타임 프로그램은 교육 중 고용을 유지하는 사람들을 위해 특별히 설계되었습니다.',
    zh: '是的，许多CDL学校提供灵活的时间安排，包括晚间和周末课程，以适应在职学生。非全日制项目专门为那些在培训期间保持就业的人设计。',
    tr: 'Evet, birçok CDL okulu çalışan öğrencileri barındırmak için akşam ve hafta sonu dersleriyle esnek zamanlama sunar. Yarı zamanlı programlar, eğitim sırasında istihdamını sürdürenler için özel olarak tasarlanmıştır.',
    pt: 'Sim, muitas escolas CDL oferecem horários flexíveis com aulas noturnas e de fim de semana para acomodar estudantes que trabalham. Os programas de meio período são especificamente projetados para aqueles que mantêm o emprego durante o treinamento.',
  },
  faqJobGuarantee: {
    en: 'Do CDL schools guarantee job placement?',
    ru: 'Гарантируют ли школы CDL трудоустройство?',
    uk: 'Чи гарантують школи CDL працевлаштування?',
    ar: 'هل تضمن مدارس CDL التوظيف؟',
    ko: 'CDL 학교는 취업을 보장하나요?',
    zh: 'CDL学校保证就业吗？',
    tr: 'CDL okulları iş yerleştirmeyi garanti ediyor mu?',
    pt: 'As escolas CDL garantem colocação profissional?',
  },
  faqJobGuaranteeAnswer: {
    en: 'While most reputable CDL schools offer job placement assistance and maintain industry connections, job placement is typically not guaranteed. However, the high demand for CDL drivers means qualified graduates usually find employment quickly.',
    ru: 'Хотя большинство авторитетных школ CDL предлагают помощь в трудоустройстве и поддерживают связи с индустрией, трудоустройство обычно не гарантируется. Однако высокий спрос на водителей CDL означает, что квалифицированные выпускники обычно быстро находят работу.',
    uk: "Хоча більшість авторитетних шкіл CDL пропонують допомогу в працевлаштуванні та підтримують зв'язки з індустрією, працевлаштування зазвичай не гарантується. Однак високий попит на водіїв CDL означає, що кваліфіковані випускники зазвичай швидко знаходять роботу.",
    ar: 'بينما تقدم معظم مدارس CDL ذات السمعة الطيبة المساعدة في التوظيف وتحتفظ بعلاقات صناعية، إلا أن التوظيف عادة لا يكون مضمونًا. ومع ذلك، فإن الطلب المرتفع على سائقي CDL يعني أن الخريجين المؤهلين عادة ما يجدون عملاً بسرعة.',
    ko: '대부분의 평판 좋은 CDL 학교는 취업 지원을 제공하고 업계 연결을 유지하지만, 취업은 일반적으로 보장되지 않습니다. 그러나 CDL 운전자에 대한 높은 수요는 자격을 갖춘 졸업생들이 보통 빠르게 일자리를 찾는다는 것을 의미합니다.',
    zh: '虽然大多数信誉良好的CDL学校提供就业援助并保持行业联系，但通常不保证就业。然而，对CDL司机的高需求意味着合格的毕业生通常很快就能找到工作。',
    tr: 'Çoğu saygın CDL okulu iş yerleştirme yardımı sunsa ve sektör bağlantılarını korusa da, iş yerleştirme genellikle garanti edilmez. Ancak, CDL sürücülerine olan yüksek talep, kalifiye mezunların genellikle hızla iş bulduğu anlamına gelir.',
    pt: 'Embora a maioria das escolas CDL respeitáveis ofereça assistência de colocação profissional e mantenha conexões com a indústria, a colocação profissional normalmente não é garantida. No entanto, a alta demanda por motoristas CDL significa que graduados qualificados geralmente encontram emprego rapidamente.',
  },
  faqWhatToExpect: {
    en: 'What should I expect during CDL training?',
    ru: 'Чего ожидать во время обучения CDL?',
    uk: 'Чого очікувати під час навчання CDL?',
    ar: 'ماذا يجب أن أتوقع أثناء تدريب CDL؟',
    ko: 'CDL 교육 중에 무엇을 기대해야 하나요?',
    zh: '在CDL培训期间我应该期待什么？',
    tr: 'CDL eğitimi sırasında ne beklemeliyim?',
    pt: 'O que devo esperar durante o treinamento CDL?',
  },
  faqWhatToExpectAnswer: {
    en: "CDL training includes classroom instruction covering regulations and safety, pre-trip inspection training, backing and maneuvering practice, and on-road driving experience. You'll learn to operate commercial vehicles safely while preparing for the CDL knowledge and skills tests.",
    ru: 'Обучение CDL включает классные занятия по правилам и безопасности, обучение предрейсовому осмотру, практику движения задним ходом и маневрирования, а также опыт вождения на дороге. Вы научитесь безопасно управлять коммерческими транспортными средствами, готовясь к тестам на знания и навыки CDL.',
    uk: 'Навчання CDL включає класні заняття з правил та безпеки, навчання передрейсовому огляду, практику руху заднім ходом та маневрування, а також досвід водіння на дорозі. Ви навчитеся безпечно керувати комерційними транспортними засобами, готуючись до тестів на знання та навички CDL.',
    ar: 'يشمل تدريب CDL التعليم في الفصول الدراسية الذي يغطي اللوائح والسلامة، وتدريب الفحص قبل الرحلة، وممارسة الرجوع للخلف والمناورة، وخبرة القيادة على الطريق. ستتعلم تشغيل المركبات التجارية بأمان أثناء التحضير لاختبارات المعرفة والمهارات CDL.',
    ko: 'CDL 교육에는 규정 및 안전을 다루는 교실 수업, 출발 전 점검 교육, 후진 및 조작 연습, 도로 주행 경험이 포함됩니다. CDL 지식 및 기술 시험을 준비하면서 상용차를 안전하게 운전하는 법을 배우게 됩니다.',
    zh: 'CDL培训包括涵盖法规和安全的课堂教学、行前检查培训、倒车和操控练习以及道路驾驶经验。您将学习安全操作商用车辆，同时准备CDL知识和技能测试。',
    tr: 'CDL eğitimi, düzenlemeleri ve güvenliği kapsayan sınıf eğitimi, yolculuk öncesi muayene eğitimi, geri geri gitme ve manevra pratiği ve yolda sürüş deneyimini içerir. CDL bilgi ve beceri testlerine hazırlanırken ticari araçları güvenli bir şekilde kullanmayı öğreneceksiniz.',
    pt: 'O treinamento CDL inclui instrução em sala de aula cobrindo regulamentos e segurança, treinamento de inspeção pré-viagem, prática de manobra e marcha à ré, e experiência de condução na estrada. Você aprenderá a operar veículos comerciais com segurança enquanto se prepara para os testes de conhecimento e habilidades do CDL.',
  },
  jobPlacementTitle: {
    en: 'Career Opportunities After CDL Training',
    ru: 'Карьерные возможности после обучения CDL',
    uk: "Кар'єрні можливості після навчання CDL",
    ar: 'الفرص الوظيفية بعد تدريب CDL',
    ko: 'CDL 교육 후 경력 기회',
    zh: 'CDL培训后的职业机会',
    tr: 'CDL Eğitimi Sonrası Kariyer Fırsatları',
    pt: 'Oportunidades de Carreira Após o Treinamento CDL',
  },
  jobPlacementText: {
    en: 'Graduates from {{location}} CDL schools find employment opportunities in various sectors including long-haul trucking, local delivery, construction, waste management, and public transportation. Many schools maintain relationships with trucking companies and offer job placement assistance, with some reporting placement rates above 90% for qualified graduates.',
    ru: 'Выпускники школ CDL {{location}} находят возможности трудоустройства в различных секторах, включая дальнобойные перевозки, местную доставку, строительство, управление отходами и общественный транспорт. Многие школы поддерживают отношения с транспортными компаниями и предлагают помощь в трудоустройстве, при этом некоторые сообщают о показателях трудоустройства выше 90% для квалифицированных выпускников.',
    uk: 'Випускники шкіл CDL {{location}} знаходять можливості працевлаштування в різних секторах, включаючи далекобійні перевезення, місцеву доставку, будівництво, управління відходами та громадський транспорт. Багато шкіл підтримують відносини з транспортними компаніями та пропонують допомогу в працевлаштуванні, причому деякі повідомляють про показники працевлаштування вище 90% для кваліфікованих випускників.',
    ar: 'يجد خريجو مدارس CDL في {{location}} فرص عمل في قطاعات مختلفة بما في ذلك النقل بالشاحنات لمسافات طويلة والتوصيل المحلي والبناء وإدارة النفايات والنقل العام. تحتفظ العديد من المدارس بعلاقات مع شركات النقل بالشاحنات وتقدم المساعدة في التوظيف، حيث يبلغ بعضها عن معدلات توظيف تزيد عن 90٪ للخريجين المؤهلين.',
    ko: '{{location}} CDL 학교 졸업생들은 장거리 트럭 운송, 지역 배송, 건설, 폐기물 관리 및 대중 교통을 포함한 다양한 부문에서 취업 기회를 찾습니다. 많은 학교가 트럭 회사와 관계를 유지하고 취업 지원을 제공하며, 일부는 자격을 갖춘 졸업생의 취업률이 90% 이상이라고 보고합니다.',
    zh: '{{location}} CDL学校的毕业生在各个行业找到就业机会，包括长途卡车运输、本地配送、建筑、废物管理和公共交通。许多学校与卡车运输公司保持关系并提供就业援助，有些学校报告合格毕业生的就业率超过90%。',
    tr: "{{location}} CDL okullarından mezun olanlar, uzun mesafe kamyon taşımacılığı, yerel teslimat, inşaat, atık yönetimi ve toplu taşıma dahil olmak üzere çeşitli sektörlerde istihdam fırsatları bulur. Birçok okul, kamyon şirketleriyle ilişkiler sürdürür ve iş yerleştirme yardımı sunar, bazıları nitelikli mezunlar için %90'ın üzerinde yerleştirme oranları bildirmektedir.",
    pt: 'Graduados das escolas CDL de {{location}} encontram oportunidades de emprego em vários setores, incluindo transporte rodoviário de longa distância, entrega local, construção, gestão de resíduos e transporte público. Muitas escolas mantêm relacionamentos com empresas de caminhões e oferecem assistência de colocação profissional, com algumas relatando taxas de colocação acima de 90% para graduados qualificados.',
  },
  choosingSchoolTitle: {
    en: 'How to Choose the Right CDL School',
    ru: 'Как выбрать правильную школу CDL',
    uk: 'Як вибрати правильну школу CDL',
    ar: 'كيفية اختيار مدرسة CDL المناسبة',
    ko: '올바른 CDL 학교를 선택하는 방법',
    zh: '如何选择合适的CDL学校',
    tr: 'Doğru CDL Okulunu Nasıl Seçersiniz',
    pt: 'Como Escolher a Escola CDL Certa',
  },
  choosingSchoolText: {
    en: 'When selecting a CDL school, consider factors such as accreditation status, training equipment quality, instructor experience, job placement rates, and student reviews. Look for schools approved by the state DMV and those offering comprehensive programs that include both classroom instruction and behind-the-wheel training.',
    ru: 'При выборе школы CDL учитывайте такие факторы, как статус аккредитации, качество учебного оборудования, опыт инструкторов, показатели трудоустройства и отзывы студентов. Ищите школы, одобренные государственным DMV, и те, которые предлагают комплексные программы, включающие как классное обучение, так и практику вождения.',
    uk: 'При виборі школи CDL враховуйте такі фактори, як статус акредитації, якість навчального обладнання, досвід інструкторів, показники працевлаштування та відгуки студентів. Шукайте школи, схвалені державним DMV, і ті, які пропонують комплексні програми, що включають як класне навчання, так і практику водіння.',
    ar: 'عند اختيار مدرسة CDL، ضع في اعتبارك عوامل مثل حالة الاعتماد وجودة معدات التدريب وخبرة المدرب ومعدلات التوظيف ومراجعات الطلاب. ابحث عن المدارس المعتمدة من DMV الحكومية وتلك التي تقدم برامج شاملة تتضمن كلاً من التعليم في الفصل الدراسي والتدريب خلف عجلة القيادة.',
    ko: 'CDL 학교를 선택할 때 인증 상태, 교육 장비 품질, 강사 경험, 취업률 및 학생 리뷰와 같은 요소를 고려하십시오. 주 DMV에서 승인한 학교와 교실 수업과 운전 실습을 모두 포함하는 종합 프로그램을 제공하는 학교를 찾으십시오.',
    zh: '选择CDL学校时，请考虑认证状态、培训设备质量、教练经验、就业率和学生评价等因素。寻找州DMV批准的学校以及提供包括课堂教学和驾驶培训在内的综合项目的学校。',
    tr: 'Bir CDL okulu seçerken, akreditasyon durumu, eğitim ekipmanı kalitesi, eğitmen deneyimi, iş yerleştirme oranları ve öğrenci yorumları gibi faktörleri göz önünde bulundurun. Eyalet DMV tarafından onaylanmış okulları ve hem sınıf eğitimi hem de direksiyon başında eğitim içeren kapsamlı programlar sunan okulları arayın.',
    pt: 'Ao selecionar uma escola CDL, considere fatores como status de credenciamento, qualidade do equipamento de treinamento, experiência do instrutor, taxas de colocação profissional e avaliações de estudantes. Procure escolas aprovadas pelo DMV estadual e aquelas que oferecem programas abrangentes que incluem instrução em sala de aula e treinamento ao volante.',
  },
};

// Update translation files for each locale
const locales = ['ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];

locales.forEach(locale => {
  const filePath = path.join(__dirname, '..', 'public', 'locales', locale, 'city-schools.json');

  try {
    // Read existing file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);

    // Update with proper translations
    Object.keys(translations).forEach(key => {
      if (translations[key][locale]) {
        data[key] = translations[key][locale];
      }
    });

    // Write back the updated file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Updated ${locale}/city-schools.json`);
  } catch (error) {
    console.error(`❌ Error updating ${locale}/city-schools.json:`, error.message);
  }
});

console.log('\n✨ Translation update complete!');
