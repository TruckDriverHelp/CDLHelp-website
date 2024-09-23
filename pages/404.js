import React from 'react';
import Link from 'next/link';
import Image from 'next/image'

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
