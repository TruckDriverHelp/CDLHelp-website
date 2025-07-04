import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

const PageBannerStyle1 = ({ pageTitle, homePageUrl, homePageText, activePageText }) => {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className="page-title-area">
        <div className="container">
          <div className="page-title-content">
            <h1>{pageTitle}</h1>
            {/* <ul>
                            <li>
                                <Link href={homePageUrl}>
                                    <a>{homePageText}</a>
                                </Link>
                            </li>
                            <li>{activePageText}</li>
                        </ul> */}
          </div>
        </div>

        <div className="lines">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>

        <div className="banner-shape1">
          <img src="/images/shape/shape9.png" alt="image" />
        </div>
      </div>
    </>
  );
};

export default PageBannerStyle1;
