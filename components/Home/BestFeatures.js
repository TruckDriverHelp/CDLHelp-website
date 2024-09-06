import React from 'react';
import Link from 'next/link';
import Image from 'next/image'
import { useTranslation } from 'lib/useTranslation';

const BestFeatures = ({translations}) => {
    const {t} = useTranslation(translations);
    return (
		<>
			<div id="about" className="features-area pt-100 pb-75">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12" style={{textAlign: 'justify'}}>
                            <div className="features-inner-content">
                                <h2>{t("CDL Help App")}</h2>
                                <p>{t("CDL Help is a unique application for preparing for the CDL-A tests. The application provides the ability to translate texts from English in real time. Use the tests to test your knowledge and prepare for the Class-A Commercial Driver's License exams in the USA. The tests simulate the types of questions that may appear during exam at a local DMV office")}</p>
                                <div className="btn-box">
                                    <a className="default-btn" href='#download'>{t("Download")}</a>
                                    <a className="link-btn" href="https://test.cdlhelp.com">{t("Try It Online")}</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 features-inner-list">
                            <div className="row justify-content-center">
                                <div className="col-lg-6 col-sm-6">
                                    <div className="features-inner-card with-box-shadow">
                                        <div className="icon">
                                            <i><img src="/images/icons/support-money-donation.svg" alt="Бесплатные вопросы" style={{color: "white", width: 25, height: 25}}></img></i>
                                            <h3>{t("Free materials")}</h3>
                                        </div>
                                        <p>{t("Free access to over 100 questions")}</p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6">
                                    <div className="features-inner-card with-box-shadow">
                                        <div className="icon">
                                            <i><img src="/images/icons/translate.svg" alt="Текст с переводом" style={{color: "white", width: 25, height: 25}}></img></i>
                                            <h3>{t("Real-time translation")}</h3>
                                        </div>
                                        <p>{t("Helps to get a CDL while learning English at the same time")}</p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6">
                                    <div className="features-inner-card with-box-shadow">
                                        <div className="icon">
                                            <i><img src="/images/icons/database.svg" alt="База вопросов" style={{color: "white", width: 25, height: 25}}></img></i>
                                            <h3>{t("Question Database")}</h3>
                                        </div>
                                        <p>{t("Our database contains more than 1000 questions")}</p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6">
                                    <div className="features-inner-card with-box-shadow">
                                        <div className="icon">
                                            <i><img src="/images/icons/layout-grid-stack-left.svg" alt="6 категории вопросов" style={{color: "white", width: 25, height: 25}}></img></i>
                                            <h3>{t("6 categories of questions")}</h3>
                                        </div>
                                        <p>{t("The application contains three main and three endorsement tests")}</p>
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