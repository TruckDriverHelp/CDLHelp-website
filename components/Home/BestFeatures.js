import React from 'react';
import Link from 'next/link';

const BestFeatures = () => {
    return (
		<>
			<div id="about" className="features-area pt-100 pb-75">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12">
                            <div className="features-inner-content">
                                <h2>Приложение CDL Help</h2>
                                <p>CDL Help это уникальное приложение для для подготовки к сдаче тестов CDL-A. Приложение предоставляет возможность переводить тесты с английского в режиме реального времени. Используйте тесты для того чтобы проверить свои знания и подготовиться к экзаменам Class-A Commercial Driver’s License в США. Тесты имитируют типы вопросов, которые могут возникнуть при сдаче тестов в местном офисе DMV.</p>
                                <div className="btn-box">
																<a className="default-btn" href='#download'>Скачать</a>
																<a className="link-btn" href="https://academy.truckdriver.help/quiz">Попробовать Онлайн</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 features-inner-list">
                            <div className="row justify-content-center">
                                <div className="col-lg-6 col-sm-6">
                                    <div className="features-inner-card">
                                        <div className="icon">
                                            <i className="ri-hand-coin-line"></i>
                                            <h3>Бесплатные вопросы</h3>
                                        </div>
                                        <p>Бесплатный доступ к 80+ вопросам.</p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6">
                                    <div className="features-inner-card with-box-shadow">
                                        <div className="icon">
                                            <i className="ri-translate"></i>
                                            <h3>Текст с переводом</h3>
                                        </div>
                                        <p>Возможность перевода вопросов нажатием на кнопку.</p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6">
                                    <div className="features-inner-card with-box-shadow">
                                        <div className="icon">
                                            <i className="ri-database-2-line"></i>
                                            <h3>База вопросов</h3>
                                        </div>
                                        <p>В нашей базе вопросов содержится более 90% возможных вопросов.</p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6">
                                    <div className="features-inner-card">
                                        <div className="icon">
                                            <i className="ri-folder-open-line"></i>
                                            <h3>3 категории вопросов</h3>
                                        </div>
                                        <p>Приложение содержит вопросы из трех категорий: General Knowedlge, Air Brakes, и Combination.</p>
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