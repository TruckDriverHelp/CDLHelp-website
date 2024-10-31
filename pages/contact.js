import React from 'react'
import ContactForm from '@/components/Contact/ContactForm'
import ContactInfo from '@/components/Contact/ContactInfo'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Footer from '@/components/_App/Footer';
import Navbar from '@/components/_App/Navbar';
import Head from 'next/head';
import { useTranslation } from 'next-i18next'; 

const Contact = ({ alternateLinks }) => {
    const {t} = useTranslation("contact");
    const title = t("support");
    return (
        <>
        <Head>
            {alternateLinks.map((link, index) => (
                <link
                    key={index}
                    rel="alternate"
                    href={process.env.BASE_URL + link.href}
                    hrefLang={link.hrefLang}
                />
            ))}
        </Head>
        <Navbar alternateLinks={alternateLinks}/>

        <div className="page-title-area">
                <div className="container">
                    <div className="page-title-content">
                        <h1>{t("support")}</h1>
                    </div>
                </div>
                <div className="banner-shape1">
                    <img src="/images/shape/shape9.png" alt="image" />
                </div>
            </div>

        <ContactForm />
        <ContactInfo />
        <Footer />
        </>
    )
}

export default Contact;

export async function getStaticProps({ locale }) {
    const alternateLinks = [
        { href: '/contact/', hrefLang: 'x-default' },
        { href: '/ar/contact/', hrefLang: 'ar' },
        { href: '/ru/contact/', hrefLang: 'ru' },
        { href: '/uk/contact/', hrefLang: 'uk' },
        { href: '/zh/contact/', hrefLang: 'zh' },
        { href: '/ko/contact/', hrefLang: 'ko' },
        { href: '/tr/contact/', hrefLang: 'tr' },
        { href: '/en/contact/', hrefLang: 'en' }
    ];

    return {
        props: {
            alternateLinks,
            ...(await serverSideTranslations(locale ?? 'en', [
                'navbar',
                'footer',
                'cookie',
                'contact'
            ])),
        },
    };
}