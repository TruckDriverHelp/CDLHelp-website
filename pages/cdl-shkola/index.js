import React, { useEffect, useState } from "react";
import Navbar from "@/components/_App/Navbar";
import PageBannerStyle1 from "@/components/Common/PageBannerStyle1";
import BlogSidebar from "@/components/Blog/BlogSidebar";
import Footer from "@/components/_App/Footer";
import Head from "next/head";
import Link from "next/link";
// import supabase from "../utils/supabase";
import { createClient } from "@supabase/supabase-js";

const CdlShkola = () => {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,);

    const [schoolData, setSchoolData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('phonenumbers')
                .select('*, schools(school_name), locations(address_street, address_city, address_state, address_zip))');
            console.log(data, error);
            if (error) {
                console.error('Data fetch error:', error);
            } else {
                setSchoolData(data);
            }
        };

        fetchData();
    }, []);
    return (
        <>
            <Head>
                <title>CDL школы на русском - CDL Help</title>
                <meta
                    name="description"
                    content="Приложение CDL Help - справочник со школами CDL в различных штатах. "
                />

                {/* Google / Search Engine Tags */}
                <meta
                    itemprop="name"
                    content="Приложение CDL Help - Тесты CDL на русском языке"
                />
                <meta
                    itemprop="description"
                    content="Приложение CDL Help - справочник со школами CDL в различных штатах. "
                />
                <meta
                    itemprop="image"
                    content="https://cdlhelp.com/images/cdlhelp-tag.jpg"
                />

                {/* Facebook Meta Tags */}
                <meta property="og:url" content="https://www.cdlhelp.com" />
                <meta property="og:type" content="article" />
                <meta
                    property="og:title"
                    content="Приложение CDL Help - Тесты CDL на русском языке"
                />
                <meta
                    property="og:description"
                    content="Приложение CDL Help - справочник со школами CDL в различных штатах. "
                />
                <meta
                    property="og:image"
                    content="https://cdlhelp.com/images/cdlhelp-tag.jpg"
                />

                {/* Twitter Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="Приложение CDL Help - Тесты CDL на русском языке"
                />
                <meta
                    name="twitter:description"
                    content="Приложение CDL Help - справочник со школами CDL в различных штатах. "
                />
                <meta
                    name="twitter:image"
                    content="https://cdlhelp.com/images/cdlhelp-tag.jpg"
                />
            </Head>

            <PageBannerStyle1
                pageTitle="CDL Школы в США"
                homePageUrl="/"
                homePageText="Главная Страница"
                activePageText="CDL Школы в США"
            />

            <div className="blog-details-area pb-100">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-md-12">
                            <div className="blog-details-desc">
                                {/* <div className="article-image">
									<img src="/images/blog/cdl-shkoly-v-usa.jpg" alt="blog-details" />
								</div> */}

                                <div className="article-content">
                                    {/* <div className="entry-meta">
										<ul>
											<li>
												<i className="ri-calendar-2-line"></i>
												14 Декабря, 2022
											</li>
										</ul>
									</div> */}

                                    <h4>Справочник CDL Школ в США</h4>
                                    <div>
                                        <p>
                                            Список CDL школ с русскоязычными инструкторами в различных штатах США. Прежде чем Вы можете пройти обучени в школе CDL вам необходимо сдать тест на получение CDL пермита.
                                        </p>
                                        <div
                                            style={{
                                                marginTop: 20,
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 10,
                                            }}
                                        >
                                            <div style={{ marginBottom: 20 }}>
                                                <a
                                                    style={{ textDecoration: "underline" }}
                                                    href="https://cdlhelp.com/dalnoboishik"
                                                    target="_blank"
                                                >
                                                    Подробнее о том, что необходимо прежде чем начать учёбу в
                                                    школе CDL.
                                                </a>
                                            </div>
                                            <p style={{ marginBottom: 0 }}>
                                                Если Вы уже сдали экзамен на получение CDL пермита, то Вы можете приступить к поиску школы CDL в вашем штате.
                                            </p>
                                            <h3>Выберите штат:</h3>
                                        </div>

                                        <div style={{ maxWidth: 500, marginBottom: 20 }}>
                                            <div
                                                className="school_card school_card_states"
                                                style={{
                                                    backgroundColor: '#f1f1f1'
                                                }}
                                            >
                                                <div>
                                                    <a style={{ textDecoration: 'underline' }} href="https://www.cdlshkola.com/shkola/sacramento">CDL школы в Калифорнии</a>
                                                </div>
                                            </div>
                                            {/* <div
                                                className="school_card school_card_states"
                                                style={{
                                                    backgroundColor: '#fff'
                                                }}
                                            >
                                                <div>
                                                    <a style={{ textDecoration: 'underline' }} href="https://www.cdlshkola.com/shkola/new-york">CDL школы в Нью-Йорке</a>
                                                </div>
                                            </div> */}
                                            {/* <div
                                                className="school_card school_card_states"
                                                style={{
                                                    backgroundColor: '#f1f1f1'
                                                }}
                                            >
                                                <div>
                                                    <a style={{ textDecoration: 'underline' }} href="https://www.cdlshkola.com/shkola/new-jersey">CDL школы в Нью-Джерси</a>
                                                </div>
                                            </div> */}
                                            <div
                                                className="school_card school_card_states"
                                                style={{
                                                    backgroundColor: '#f1f1f1'
                                                }}
                                            >
                                                <div>
                                                    <a style={{ textDecoration: 'underline' }} href="https://www.cdlshkola.com/shkola/washington">CDL школы в Вашингтоне</a>
                                                </div>
                                            </div>
                                            {/* <div
                                                className="school_card school_card_states"
                                                style={{
                                                    backgroundColor: '#fff'
                                                }}
                                            >
                                                <div>
                                                    <a style={{ textDecoration: 'underline' }} href="https://www.cdlshkola.com/shkola/chicago">CDL школы в Чикаго</a>
                                                </div>
                                            </div> */}
                                            {/* <div
                                                className="school_card school_card_states"
                                                style={{
                                                    backgroundColor: '#f1f1f1'
                                                }}
                                            >
                                                <div>
                                                    <a style={{ textDecoration: 'underline' }} href="https://www.cdlshkola.com/shkola/miami">CDL школы во Флориде</a>
                                                </div>
                                            </div> */}
                                            {/* <div
                                                className="school_card school_card_states"
                                                style={{
                                                    backgroundColor: '#fff'
                                                }}
                                            >
                                                <div>
                                                    <a style={{ textDecoration: 'underline' }} href="https://www.cdlshkola.com/shkola/philadelphia">CDL школы в Пенсильвании</a>
                                                </div>
                                            </div> */}
                                            {/* <div
                                                className="school_card school_card_states"
                                                style={{
                                                    backgroundColor: '#f1f1f1'
                                                }}
                                            >
                                                <div>
                                                    <a style={{ textDecoration: 'underline' }} href="https://www.cdlshkola.com/shkola/washington">CDL школы в штате Вашингтон</a>
                                                </div>
                                            </div>
                                            <div
                                                className="school_card school_card_states"
                                                style={{
                                                    backgroundColor: '#fff'
                                                }}
                                            >
                                                <div>
                                                    <a style={{ textDecoration: 'underline' }} href="https://www.cdlshkola.com/shkola/north-carolina">CDL школы в Северной Каролине</a>
                                                </div>
                                            </div> */}
                                            <div
                                                className="school_card school_card_states"
                                                style={{
                                                    backgroundColor: '#f1f1f1'
                                                }}
                                            >
                                                <div>
                                                    <a style={{ textDecoration: 'underline' }} href="https://www.cdlshkola.com/shkola/las-vegas">CDL школы в Лас-Вегасе</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="school_register">
                                        <p style={{ fontSize: 12, margin: 0 }}>
                                            <em>
                                                Хотите добавить свою школу CDL в наш список?
                                            </em>
                                        </p>

                                        <a className="default-btn" href="https://school.cdlhelp.app">Зарегистрировать Школу</a>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="col-lg-4 col-md-12">
                            <div className="right-sidebar">
                                <BlogSidebar />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </>
    );
};

export default CdlShkola;


export async function getStaticProps({ locale }) {
    return {
	    props: {
            locale: false
        }
    };
  }