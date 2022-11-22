import React from 'react';

const Funfacts = () => {
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
                                <p>Количество Вопросов</p>
                                <h3>400<span className="sign">+</span></h3>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-md-6">
                            <div className="single-funfacts-card">
                                <div className="icon">
                                    <i className="ri-file-list-3-fill"></i>
                                </div>
                                <p>Количество Тестов</p>
                                <h3>13</h3>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-md-6">
                            <div className="single-funfacts-card">
                                <div className="icon">
                                    <i className="ri-book-open-fill"></i>
                                </div>
                                <p>Количество Разделов</p>
                                <h3>3</h3>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-md-6">
                            <div className="single-funfacts-card">
                                <div className="icon">
                                    <i className="ri-user-3-fill"></i>
                                </div>
                                <p>Пользователей</p>
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