import React from 'react';
import Link from 'next/link';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const ErrorPage = () => {
	return (
		<>
			<div className="d-flex flex-column min-vh-100">
				<div className="container my-auto">
					<div className="text-black text-center">
						<h1 className='pb-4'>Страница не найдена</h1>
						<Link href="/">
							<a className="default-btn">Главная страница</a>
						</Link>
					</div>
				</div>
			</div>
		</>
	)
}

export default ErrorPage;

export async function getStaticProps({ locale }) {
    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'en', [
            'navbar',
            'footer',
            'cookie'
          ])),
      },
    };
  }