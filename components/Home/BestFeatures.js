import React from 'react';
import Link from 'next/link';
import { useRouter } from "next/router";
import { useTranslation } from 'next-i18next';

const BestFeatures = () => {
    const {t} = useTranslation("index");
    const { locale } = useRouter();
    return (
        <>
            <div id="about" className="features-area pt-100 pb-75">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12">
                            <div className="features-inner-content">
                                <h2>{t("bestFeaturesTitle")}</h2>
                                <p>{t("bestFeaturesDescription")}</p>
                                <div className="btn-box">
                                    <a className="default-btn" href='#download'>{t("bestFeaturesDownload")}</a>
                                    <a className="link-btn" href={`https://test.cdlhelp.com/${locale}`}>{t("tryOnline")}</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 features-inner-list">
                            <div className="row justify-content-center">
                                <div className="col-lg-6 col-sm-6">
                                    <div className="features-inner-card">
                                        <div className="icon">
                                            <i className="ri-hand-coin-line"></i>
                                            <h3>{t("freeQuestions")}</h3>
                                        </div>
                                        <p>{t("freeQuestions")}</p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6">
                                    <div className="features-inner-card with-box-shadow">
                                        <div className="icon">
                                            <i className="ri-translate"></i>
                                            <h3>{t("translation")}</h3>
                                        </div>
                                        <p>{t("helpsToGetCdl")}</p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6">
                                    <div className="features-inner-card with-box-shadow">
                                        <div className="icon">
                                            <i className="ri-database-2-line"></i>
                                            <h3>{t("questionsDataBase")}</h3>
                                        </div>
                                        <p>{t("numberOfQuestions")}</p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6">
                                    <div className="features-inner-card">
                                        <div className="icon">
                                            <i className="ri-folder-open-line"></i>
                                            <h3>{t("questionsCategories")}</h3>
                                        </div>
                                        <p>{t("questionsCategories2")}</p>
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
