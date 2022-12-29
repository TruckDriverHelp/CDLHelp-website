// Footer Component Style File Path: public/css/pages-and-components-css/footer.scss

import React from 'react';
import Link from 'next/link';

const Footer = () => {
    
    const currentYear = new Date().getFullYear();

    return (
        <>
            <div className="footer-area footer-style-two bg-black">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="single-footer-widget">
                                <Link href="/">
                                    <a className="logo">
                                        <img src="/images/logo.png" alt="logo" />
                                    </a>
                                </Link>

                                <p>Приложение для мобильных устройств iOS и Android, с тестами CDL с возможностью перевода.</p>

                                <ul className="social-links">
                                    <li>
                                        <a href="https://www.facebook.com/TruckDriverHelp" target="_blank">
                                            <i className="ri-facebook-fill"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.t.me/TruckDriverHelp" target="_blank">
                                            <i className="ri-telegram-fill"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="mailto:contact@truckdriver.help" target="_blank">
                                            <i className="ri-mail-fill"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-2 col-md-6 col-sm-6">
                            <div className="single-footer-widget pl-2">
                                <h3>CDL Help</h3>
                                <ul className="links-list">
                                    <li>
                                        <Link href="#about">
                                            <a>О Проекте</a>
                                        </Link>
                                    </li>
                                    {/* <li>
                                        <Link href="/features">
                                            <a>Отзывы</a>
                                        </Link>
                                    </li> */}
                                    <li>
                                        <a href="https://academy.truckdriver.help/quiz">Попробовать Бесплатно</a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-2 col-md-3 col-sm-6">
                            <div className="single-footer-widget">
                                <h3>Поддержка</h3>
                                <ul className="links-list">
                                    <li>
                                        <Link href="/privacy-policy">
                                            <a>Конфиденциальность</a>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/terms-conditions">
                                            <a>Публичное Соглашение</a>
                                        </Link>
                                    </li>
                                    <li>
																				<a href="https://www.t.me/TDHsupport">Обратная Связь</a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-2 col-md-3 col-sm-6">
                            <div className="single-footer-widget">
                                <h3>Ресурсы</h3>
                                <ul className="links-list">
                                    <li>
																				<a href="/dalnoboishik">Как стать дальнобойщиком</a>
                                    </li>
																		<li>
																				<a href="/cdl-shkola">Школа CDL на русском</a>
                                    </li>
                                    <li>
																				<a href="https://www.truckdriver.help/">Найти Работу</a>
                                    </li>
                                    <li>
																				<a href="https://academy.truckdriver.help/course/dispatch/0">Бесплатные Курсы Диспетчера</a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="single-footer-widget">
                                <h3>Рассылка</h3>
                                <p>Подпишитесь на рассылку поектов TruckDriver.help и CDL Help.</p>

                                <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
                                    <input 
                                        type="text" 
                                        className="input-newsletter" 
                                        placeholder="Ваш Email" 
                                        name="EMAIL" 
                                        required 
                                    />
                                    <button type="submit">
                                        <i className="ri-send-plane-2-line"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    
                    <div className="copyright-area">
                        <p>{currentYear} &copy; <strong>CDL Help</strong>. Все права защищены <a href="https://www.truckdriver.help/" target="_blank">TruckDriver.help llc</a></p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Footer;