import React from 'react';
import { useRouter } from "next/router";
import { useTranslation } from 'next-i18next';

const Funfacts = () => {
    const { t } = useTranslation('index');
    const { locale } = useRouter();
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
                                <p>{t('funFactsNumberOfQuestions')}</p>
                                <h3>1200+</h3>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-md-6">
                            <div className="single-funfacts-card">
                                <div className="icon">
                                    <i className="ri-book-open-fill"></i>
                                </div>
                                <p>{t('numberOfCategories')}</p>
                                <h3>6</h3>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-md-6">
                            <div className="single-funfacts-card">
                                <div className="icon">
                                    <i className="ri-user-3-fill"></i>
                                </div>
                                <p>{t('reviews')}</p>
                                <h3>3000<span className="sign">+</span></h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		</>
    );
}

export default Funfacts;