import React from 'react';
import Link from 'next/link';

const AboutContent = () => {
  return (
    <>
      <div className="app-about-area pb-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12">
              <div className="app-about-image">
                <img src="/images/home-7-8-9/about/about-2.png" alt="image" />
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="app-about-content">
                <span className="sub-title">ABOUT US</span>
                <h2>Most Probably You Are Getting Best App Ever</h2>
                <p>
                  Cloud based storage for your data backup just log in with your mail account from
                  play store and using whatever you want for your business purpose orem ipsum dummy
                  text. Never missyour chance its just began.
                </p>
                <ul className="list">
                  <li>
                    <div className="icon bg-3">
                      <i className="ri-award-line"></i>
                    </div>
                    <h3>Trusted and Reliable</h3>
                    <p>
                      Most provabily best you can trust on it, just log in with your mail account
                      from play store and using whatever you want for your business.
                    </p>
                  </li>
                  <li>
                    <div className="icon bg-3">
                      <i className="ri-download-cloud-2-line"></i>
                    </div>
                    <h3>Cloud Storage</h3>
                    <p>
                      Just log in with your mail account from play store and using whatever you want
                      for your business purpose.
                    </p>
                  </li>
                </ul>
                <div className="btn-box">
                  <Link href="/app-download">
                    <a className="default-btn">Start Free Trial</a>
                  </Link>
                  <Link href="/features-1">
                    <a className="link-btn">See All Features</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutContent;
