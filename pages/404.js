import React from 'react';
import Link from 'next/link';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const ErrorPage = () => {
    return (
		<>
			<div className="error-area ptb-100">
				<div className="d-table">
					<div className="d-table-cell">
						<div className="container">
							<div className="error-content">
								<img  src="/images/error.png" alt="image" />
								<p>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>

								<Link href="/">
									<a className="default-btn">Back To Home</a>
								</Link>
							</div>
						</div>
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
