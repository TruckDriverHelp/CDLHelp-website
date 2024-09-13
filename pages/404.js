// 404 Error Page Style File Path: public/css/pages-and-components-css/error.scss

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/_App/Navbar';
import Footer from '@/components/_App/Footer';

const ErrorPage = () => {
    return (
		<>
			<Navbar />
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
			<Footer />
		</>
    )
}

export default ErrorPage;