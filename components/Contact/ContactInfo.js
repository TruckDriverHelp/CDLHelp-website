import React from 'react';

const ContactInfo = () => {
    return (
        <>
            <div className="contact-info-area pb-100">
                <div className="container">
                    <div className="contact-info-inner">
                        <h2>Вы также можете воспользоваться следующими методами</h2>

                        <div className="row justify-content-center">
                            <div className="col-lg-4 col-md-6 col-sm-6">
                                <div className="single-contact-info-box">
                                    <div className="icon">
                                        <i className="ri-mail-line"></i>
                                    </div>
                                    <h3><a href="mailto:contact@truckdriver.help">contact@truckdriver.help</a></h3>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-6">
                                <div className="single-contact-info-box">
                                    <div className="icon">
                                        <i className="ri-telegram-line"></i>
                                    </div>
                                    <h3><a href="https://www.t.me/tdhsupport">Служба Поддержки</a></h3>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-6">
                                <div className="single-contact-info-box">
                                    <div className="icon">
                                        <i className="ri-telegram-line"></i>
                                    </div>
                                    <h3><a href="https://t.me/TruckDriverGroup/13900/13904">Группа Телеграм</a></h3>
                                </div>
                            </div>
                        </div>

                        <div className="lines">
                            <div className="line"></div>
                            <div className="line"></div>
                            <div className="line"></div>
                            <div className="line"></div>
                            <div className="line"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContactInfo;