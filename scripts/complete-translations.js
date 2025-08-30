#!/usr/bin/env node

/**
 * Complete all remaining translations for CDL schools pages
 */

const fs = require('fs');
const path = require('path');

// Additional translations that were missing
const additionalTranslations = {
  whatIsTaught: {
    en: 'What is Taught at CDL Schools',
    ru: 'Что преподают в школах CDL',
    uk: 'Чого навчають у школах CDL',
    ar: 'ما يتم تدريسه في مدارس CDL',
    ko: 'CDL 학교에서 가르치는 내용',
    zh: 'CDL学校教授的内容',
    tr: 'CDL Okullarında Ne Öğretilir',
    pt: 'O que é Ensinado nas Escolas CDL',
  },
  cdlCurriculumParagraph: {
    en: "CDL schools provide comprehensive training to prepare students for their Commercial Driver's License exam. The curriculum covers essential topics including pre-trip vehicle inspection procedures, basic vehicle control and maneuvering, on-road driving skills and safety, federal and state regulations, Hours of Service (HOS) rules, cargo handling and documentation, trip planning and navigation, and hazardous materials handling for those seeking HazMat endorsement. Training is delivered through a combination of classroom instruction, hands-on practice, and real-world driving experience, with programs typically ranging from a few weeks to several months.",
    ru: 'Школы CDL предоставляют комплексное обучение для подготовки студентов к экзамену на получение коммерческих водительских прав. Учебная программа охватывает основные темы, включая процедуры предрейсового осмотра транспортного средства, базовый контроль и маневрирование транспортным средством, навыки вождения на дороге и безопасность, федеральные и государственные правила, правила часов работы (HOS), обработку грузов и документацию, планирование поездок и навигацию, а также обращение с опасными материалами для тех, кто стремится получить одобрение HazMat. Обучение проводится через сочетание классных занятий, практической подготовки и реального опыта вождения, при этом программы обычно длятся от нескольких недель до нескольких месяцев.',
    uk: 'Школи CDL надають комплексне навчання для підготовки студентів до іспиту на отримання комерційних водійських прав. Навчальна програма охоплює основні теми, включаючи процедури передрейсового огляду транспортного засобу, базовий контроль та маневрування транспортним засобом, навички водіння на дорозі та безпеку, федеральні та державні правила, правила годин роботи (HOS), обробку вантажів та документацію, планування поїздок та навігацію, а також поводження з небезпечними матеріалами для тих, хто прагне отримати схвалення HazMat. Навчання проводиться через поєднання класних занять, практичної підготовки та реального досвіду водіння, при цьому програми зазвичай тривають від кількох тижнів до кількох місяців.',
    ar: 'توفر مدارس CDL تدريبًا شاملاً لإعداد الطلاب لامتحان رخصة القيادة التجارية. يغطي المنهج الدراسي الموضوعات الأساسية بما في ذلك إجراءات فحص المركبة قبل الرحلة، والتحكم الأساسي في المركبة والمناورة، ومهارات القيادة على الطريق والسلامة، واللوائح الفيدرالية والولائية، وقواعد ساعات الخدمة (HOS)، ومناولة البضائع والتوثيق، وتخطيط الرحلات والملاحة، والتعامل مع المواد الخطرة لأولئك الذين يسعون للحصول على تصديق HazMat. يتم تقديم التدريب من خلال مزيج من التعليم في الفصول الدراسية والممارسة العملية وخبرة القيادة في العالم الحقيقي، حيث تتراوح البرامج عادة من بضعة أسابيع إلى عدة أشهر.',
    ko: 'CDL 학교는 상업 운전 면허 시험을 위해 학생들을 준비시키는 종합적인 교육을 제공합니다. 커리큘럼은 출발 전 차량 점검 절차, 기본 차량 제어 및 조작, 도로 주행 기술 및 안전, 연방 및 주 규정, 서비스 시간(HOS) 규칙, 화물 처리 및 문서화, 여행 계획 및 내비게이션, HazMat 승인을 원하는 사람들을 위한 위험 물질 취급을 포함한 필수 주제를 다룹니다. 교육은 교실 수업, 실습 및 실제 운전 경험의 조합을 통해 제공되며, 프로그램은 일반적으로 몇 주에서 몇 달까지 다양합니다.',
    zh: 'CDL学校提供全面的培训，为学生准备商业驾驶执照考试。课程涵盖基本主题，包括行前车辆检查程序、基本车辆控制和操作、道路驾驶技能和安全、联邦和州法规、服务时间（HOS）规则、货物处理和文件、行程规划和导航，以及为寻求HazMat认证的人提供的危险材料处理。培训通过课堂教学、实践练习和现实世界驾驶经验的结合来提供，项目通常从几周到几个月不等。',
    tr: 'CDL okulları, öğrencileri Ticari Sürücü Belgesi sınavına hazırlamak için kapsamlı eğitim sağlar. Müfredat, yolculuk öncesi araç muayene prosedürleri, temel araç kontrolü ve manevra, yolda sürüş becerileri ve güvenlik, federal ve eyalet düzenlemeleri, Hizmet Saatleri (HOS) kuralları, kargo elleçleme ve dokümantasyon, seyahat planlama ve navigasyon ve HazMat onayı arayanlar için tehlikeli madde işleme dahil olmak üzere temel konuları kapsar. Eğitim, sınıf öğretimi, uygulamalı pratik ve gerçek dünya sürüş deneyiminin bir kombinasyonu ile verilir ve programlar genellikle birkaç haftadan birkaç aya kadar değişir.',
    pt: 'As escolas CDL fornecem treinamento abrangente para preparar os alunos para o exame de Carteira de Motorista Comercial. O currículo abrange tópicos essenciais, incluindo procedimentos de inspeção pré-viagem do veículo, controle básico e manobra do veículo, habilidades de condução na estrada e segurança, regulamentos federais e estaduais, regras de Horas de Serviço (HOS), manuseio de carga e documentação, planejamento de viagem e navegação, e manuseio de materiais perigosos para aqueles que buscam endosso HazMat. O treinamento é fornecido através de uma combinação de instrução em sala de aula, prática prática e experiência de condução no mundo real, com programas normalmente variando de algumas semanas a vários meses.',
  },
  otherSchoolsInState: {
    en: 'Other CDL Schools in {{state}}',
    ru: 'Другие школы CDL в {{state}}',
    uk: 'Інші школи CDL в {{state}}',
    ar: 'مدارس CDL أخرى في {{state}}',
    ko: '{{state}}의 다른 CDL 학교',
    zh: '{{state}}的其他CDL学校',
    tr: '{{state}} içindeki Diğer CDL Okulları',
    pt: 'Outras Escolas CDL em {{state}}',
  },
  helpfulResources: {
    en: 'Helpful Resources',
    ru: 'Полезные ресурсы',
    uk: 'Корисні ресурси',
    ar: 'موارد مفيدة',
    ko: '유용한 자료',
    zh: '有用的资源',
    tr: 'Yararlı Kaynaklar',
    pt: 'Recursos Úteis',
  },
  preTrip: {
    en: 'Pre-Trip Inspection',
    ru: 'Предрейсовый осмотр',
    uk: 'Передрейсовий огляд',
    ar: 'فحص ما قبل الرحلة',
    ko: '출발 전 점검',
    zh: '行前检查',
    tr: 'Yolculuk Öncesi Muayene',
    pt: 'Inspeção Pré-Viagem',
  },
  preTripDesc: {
    en: 'Learn the complete pre-trip inspection process required for your CDL test',
    ru: 'Изучите полный процесс предрейсового осмотра, необходимый для вашего теста CDL',
    uk: 'Вивчіть повний процес передрейсового огляду, необхідний для вашого тесту CDL',
    ar: 'تعلم عملية الفحص الكاملة قبل الرحلة المطلوبة لاختبار CDL الخاص بك',
    ko: 'CDL 테스트에 필요한 완전한 출발 전 점검 과정을 배우세요',
    zh: '学习CDL测试所需的完整行前检查流程',
    tr: 'CDL testiniz için gerekli olan tam yolculuk öncesi muayene sürecini öğrenin',
    pt: 'Aprenda o processo completo de inspeção pré-viagem necessário para seu teste CDL',
  },
  cdlPractice: {
    en: 'CDL Practice Tests',
    ru: 'Практические тесты CDL',
    uk: 'Практичні тести CDL',
    ar: 'اختبارات الممارسة CDL',
    ko: 'CDL 연습 시험',
    zh: 'CDL练习测试',
    tr: 'CDL Pratik Testleri',
    pt: 'Testes Práticos CDL',
  },
  cdlPracticeDesc: {
    en: 'Free practice tests to help you prepare for your CDL knowledge exam',
    ru: 'Бесплатные практические тесты, которые помогут вам подготовиться к экзамену на знание CDL',
    uk: 'Безкоштовні практичні тести, які допоможуть вам підготуватися до іспиту на знання CDL',
    ar: 'اختبارات ممارسة مجانية لمساعدتك في التحضير لامتحان معرفة CDL الخاص بك',
    ko: 'CDL 지식 시험 준비를 돕는 무료 연습 시험',
    zh: '免费练习测试，帮助您准备CDL知识考试',
    tr: 'CDL bilgi sınavınıza hazırlanmanıza yardımcı olacak ücretsiz pratik testler',
    pt: 'Testes práticos gratuitos para ajudá-lo a se preparar para seu exame de conhecimento CDL',
  },
  dotPhysical: {
    en: 'DOT Physical Locations',
    ru: 'Места медицинского осмотра DOT',
    uk: 'Місця медичного огляду DOT',
    ar: 'مواقع الفحص البدني DOT',
    ko: 'DOT 신체 검사 장소',
    zh: 'DOT体检地点',
    tr: 'DOT Fiziksel Muayene Yerleri',
    pt: 'Locais de Exame Físico DOT',
  },
  dotPhysicalDesc: {
    en: 'Find certified medical examiners for your required DOT physical exam',
    ru: 'Найдите сертифицированных медицинских экзаменаторов для вашего обязательного медицинского осмотра DOT',
    uk: "Знайдіть сертифікованих медичних екзаменаторів для вашого обов'язкового медичного огляду DOT",
    ar: 'ابحث عن الفاحصين الطبيين المعتمدين لفحصك البدني المطلوب من DOT',
    ko: '필수 DOT 신체 검사를 위한 인증된 의료 검사관 찾기',
    zh: '查找您所需的DOT体检认证医疗检查员',
    tr: 'Gerekli DOT fiziksel muayeneniz için sertifikalı tıbbi muayene uzmanlarını bulun',
    pt: 'Encontre examinadores médicos certificados para seu exame físico DOT obrigatório',
  },
  downloadApp: {
    en: 'Download CDL Help App',
    ru: 'Скачать приложение CDL Help',
    uk: 'Завантажити додаток CDL Help',
    ar: 'تحميل تطبيق CDL Help',
    ko: 'CDL Help 앱 다운로드',
    zh: '下载CDL帮助应用程序',
    tr: 'CDL Yardım Uygulamasını İndir',
    pt: 'Baixar o Aplicativo CDL Help',
  },
  downloadAppDesc: {
    en: 'Get our mobile app for convenient CDL test preparation on the go',
    ru: 'Получите наше мобильное приложение для удобной подготовки к тесту CDL в пути',
    uk: 'Отримайте наш мобільний додаток для зручної підготовки до тесту CDL в дорозі',
    ar: 'احصل على تطبيقنا المحمول للتحضير المريح لاختبار CDL أثناء التنقل',
    ko: '이동 중에도 편리한 CDL 시험 준비를 위한 모바일 앱 받기',
    zh: '获取我们的移动应用程序，随时随地方便地准备CDL测试',
    tr: 'Hareket halindeyken rahat CDL test hazırlığı için mobil uygulamamızı edinin',
    pt: 'Obtenha nosso aplicativo móvel para preparação conveniente para o teste CDL em qualquer lugar',
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

    // Update with additional translations
    Object.keys(additionalTranslations).forEach(key => {
      if (additionalTranslations[key][locale]) {
        data[key] = additionalTranslations[key][locale];
      }
    });

    // Write back the updated content
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`✅ Updated ${locale}/city-schools.json`);
  } catch (error) {
    console.error(`❌ Error updating ${locale}/city-schools.json:`, error.message);
  }
});

console.log('\n✨ Additional translations complete!');
