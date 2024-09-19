import React from 'react';
import Link from 'next/link';
import { useRouter } from "next/router";

const localeContent = {
    "ru": {
        title: "Приложение CDL Help",
        description: "CDL Help это уникальное приложение для подготовки к сдаче тестов CDL-A. Приложение предоставляет возможность переводить тесты с английского в режиме реального времени. Используйте тесты для того чтобы проверить свои знания и подготовиться к экзаменам Class-A Commercial Driver’s License в США. Тесты имитируют типы вопросов, которые могут возникнуть при сдаче тестов в местном офисе DMV.", 
        download: "Скачать", 
        try: "Попробовать Онлайн", 
        freeQuestions: "Бесплатные вопросы",
        freeAccess: "Бесплатный доступ к 80+ вопросам.",
        translation: "Текст с переводом",
        helpsToGetCdl: "Помогает получить права CDL, а также учить английский язык.", 
        questionsDataBase: "База вопросов",
        numberOfQuestions: "В нашей базе вопросов содержится более 370 вопросов.", 
        questionsCategories: "3 категории вопросов",
        questionsCategories2: "Приложение содержит вопросы из трех категорий: General Knowedlge, Air Brakes, и Combination.",
    },

    "en": {
        title: "Приложение CDL Help",
        description: "CDL Help это уникальное приложение для подготовки к сдаче тестов CDL-A. Приложение предоставляет возможность переводить тесты с английского в режиме реального времени. Используйте тесты для того чтобы проверить свои знания и подготовиться к экзаменам Class-A Commercial Driver’s License в США. Тесты имитируют типы вопросов, которые могут возникнуть при сдаче тестов в местном офисе DMV.", 
        download: "Скачать", 
        try: "Попробовать Онлайн", 
        freeQuestions: "Бесплатные вопросы",
        freeAccess: "Бесплатный доступ к 80+ вопросам.",
        translation: "Текст с переводом",
        helpsToGetCdl: "Помогает получить права CDL, а также учить английский язык.", 
        questionsDataBase: "База вопросов",
        numberOfQuestions: "В нашей базе вопросов содержится более 370 вопросов.", 
        questionsCategories: "3 категории вопросов",
        questionsCategories2: "Приложение содержит вопросы из трех категорий: General Knowedlge, Air Brakes, и Combination.",
    },
    
    "uk": {
        title: "Додаток CDL Help",
        description: "CDL Help — це унікальна програма для підготовки до тестів CDL-A. Додаток надає можливість перекладати тести з англійської мови в режимі реального часу. Використовуйте тести, щоб перевірити свої знання та підготуватися до іспитів CDL класу A в США. Тести в додатку схожі на запитання, які вам трапляться під час проходження тестів у місцевому офісі DMV.", 
        download: "Завантажити", 
        tryOnline: "Спробувати онлайн", 
        freeQuestions: "Безкоштовні запитання",
        freeAccess: "Безкоштовний доступ до 80+ запитань.",
        translation: "Текст з перекладом",
        helpsToGetCdl: "Допомагає отримати права CDL, а також вивчити англійську мову", 
        questionsDataBase: "База питань",
        numberOfQuestions: "В нашій базі понад 370 питань.", 
        questionsCategories: "3 категорії питань",
        questionsCategories2: "Додаток містить питання з трьох категорій: Загальні знання, пневматичні гальма та комбінований транспорт.",
    }
  };


const BestFeatures = () => {
    const { locale, locales, defaultLocale, asPath } = useRouter();
    const { title, description, download, tryOnline, freeAccess, freeQuestions, translation, helpsToGetCdl, questionsDataBase, numberOfQuestions, questionsCategories, questionsCategories2 } = localeContent[locale];
    return (
        <>
            <div id="about" className="features-area pt-100 pb-75">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12">
                            <div className="features-inner-content">
                                <h2>{title}</h2>
                                <p>{description}</p>
                                <div className="btn-box">
                                    <a className="default-btn" href='#download'>{download}</a>
                                    <a className="link-btn" href="https://academy.truckdriver.help/quiz">{tryOnline}</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 features-inner-list">
                            <div className="row justify-content-center">
                                <div className="col-lg-6 col-sm-6">
                                    <div className="features-inner-card">
                                        <div className="icon">
                                            <i className="ri-hand-coin-line"></i>
                                            <h3>{freeQuestions}</h3>
                                        </div>
                                        <p>{freeQuestions}</p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6">
                                    <div className="features-inner-card with-box-shadow">
                                        <div className="icon">
                                            <i className="ri-translate"></i>
                                            <h3>{translation}</h3>
                                        </div>
                                        <p>{helpsToGetCdl}</p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6">
                                    <div className="features-inner-card with-box-shadow">
                                        <div className="icon">
                                            <i className="ri-database-2-line"></i>
                                            <h3>{questionsDataBase}</h3>
                                        </div>
                                        <p>{numberOfQuestions}</p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6">
                                    <div className="features-inner-card">
                                        <div className="icon">
                                            <i className="ri-folder-open-line"></i>
                                            <h3>{questionsCategories}</h3>
                                        </div>
                                        <p>{questionsCategories2}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BestFeatures;
