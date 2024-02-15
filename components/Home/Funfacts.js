import React from 'react';
import { useRouter } from "next/router";

const localeContent = {
    "ru": {
    numberOfQuestions: "Количество Вопросов",
    amountOfTests: "Количество Тестов",
    numberOfCategories: "Количество Разделов",
    users: "Пользователей", 

    },
    "ua": {
    numberOfQuestions: "Кількість питань",
    amountOfTests: "Кількість тестів",
    numberOfCategories: "Кількість розділів",
    users: "Користувачів", 
    }
  };


const Funfacts = () => {
    const { locale, locales, defaultLocale, asPath } = useRouter();
    const { numberOfQuestions, amountOfTests, numberOfCategories, users } = localeContent[locale];
    return (
		<>
			<div className="gradient-funfacts-area pt-100 pb-75">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-3 col-sm-6 col-md-6">
                            <div className="single-funfacts-card">
                                <div className="icon">
                                    <i className="ri-question-fill"></i>
                                </div>
                                <p>{numberOfQuestions}</p>
                                <h3>370<span className="sign">+</span></h3>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-md-6">
                            <div className="single-funfacts-card">
                                <div className="icon">
                                    <i className="ri-file-list-3-fill"></i>
                                </div>
                                <p>{amountOfTests}</p>
                                <h3>13</h3>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-md-6">
                            <div className="single-funfacts-card">
                                <div className="icon">
                                    <i className="ri-book-open-fill"></i>
                                </div>
                                <p>{numberOfCategories}</p>
                                <h3>3</h3>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-md-6">
                            <div className="single-funfacts-card">
                                <div className="icon">
                                    <i className="ri-user-3-fill"></i>
                                </div>
                                <p>{users}</p>
                                <h3>15<span className="sign">к</span></h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		</>
    );
}

export default Funfacts;