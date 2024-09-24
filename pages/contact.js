import React from 'react'
import PageBannerStyle1 from '@/components/Common/PageBannerStyle1'
import ContactForm from '@/components/Contact/ContactForm'
import ContactInfo from '@/components/Contact/ContactInfo'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
 
const Contact = () => {
    return (
        <>
            <PageBannerStyle1 
                pageTitle="Обратная Связь"
                homePageUrl="/"
                homePageText="Главная Страница"
                activePageText="Обратная Связь"
            />

            <ContactForm />

            <ContactInfo />

        </>
    )
}

export default Contact;

export async function getStaticProps({ locale }) {
    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'en', [
            'navbar',
            'footer',
            'cookie',
            'contact'
          ])),
      },
    };
  }