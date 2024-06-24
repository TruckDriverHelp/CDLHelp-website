import React from 'react';
import Link from 'next/link';

const BestFeatures = () => {
    return (
		<>
			<div id="about" className="features-area pt-100 pb-75">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12" style={{textAlign: 'justify'}}>
                            <div className="features-inner-content">
                                <h2>Приложение CDL Help</h2>
                                <p>CDL Help это уникальное приложение для подготовки к сдаче тестов CDL-A. Приложение предоставляет возможность переводить тесты с английского в режиме реального времени. Используйте тесты для того чтобы проверить свои знания и подготовиться к экзаменам Class-A Commercial Driver’s License в США. Тесты имитируют типы вопросов, которые могут возникнуть при сдаче тестов в местном офисе DMV.</p>
                                <div className="btn-box">
                                    <a className="default-btn" href='#download'>Скачать</a>
                                    <a className="link-btn" href="https://academy.truckdriver.help/quiz">Попробовать Онлайн</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 features-inner-list">
                            <div className="row justify-content-center">
                                <div className="col-lg-6 col-sm-6">
                                    <div className="features-inner-card with-box-shadow">
                                        <div className="icon">
                                            <i><img src="images/icons/support-money-donation.svg" style={{color: "white", width: 25, height: 25}}></img></i>
                                            <h3>Бесплатные вопросы</h3>
                                        </div>
                                        <p>Бесплатный доступ к более 100 вопросам</p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6">
                                    <div className="features-inner-card with-box-shadow">
                                        <div className="icon">
                                            <i><img src="images/icons/translate.svg" style={{color: "white", width: 25, height: 25}}></img></i>
                                            <h3>Текст с переводом</h3>
                                        </div>
                                        <p>Помогает получить права CDL, а также учить английский язык</p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6">
                                    <div className="features-inner-card with-box-shadow">
                                        <div className="icon">
                                            <i><img src="images/icons/database.svg" style={{color: "white", width: 25, height: 25}}></img></i>
                                            <h3>База вопросов</h3>
                                        </div>
                                        <p>В нашей базе вопросов содержится более 1000 вопросов</p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6">
                                    <div className="features-inner-card with-box-shadow">
                                        <div className="icon">
                                            <i><img src="images/icons/layout-grid-stack-left.svg" style={{color: "white", width: 25, height: 25}}></img></i>
                                            <h3>6 категории вопросов</h3>
                                        </div>
                                        <p>Приложение содержит три основных, и три дополнительных теста</p>
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