import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image'

const OwlCarousel = dynamic(import('react-owl-carousel3'));

const options = {
    nav: false,
    loop: true,
    margin: 25,
    dots: true,
    autoplay: true,
    autoplayHoverPause: true,
    navText: [
        "<i class='ri-arrow-left-s-line'></i>",
        "<i class='ri-arrow-right-s-line'></i>",
    ],
    responsive: {
        0: {
            items: 1
        },
        576: {
            items: 2
        },
        768: {
            items: 3
        },
        992: {
            items: 4
        },
        1200: {
            items: 5
        }
    }
};

const AppScreenshots = () => {

    const [display, setDisplay] = React.useState(false);

    React.useEffect(() => {
        setDisplay(true);
    }, [])

    return (
        <>
            <div className="app-screenshots-area ptb-100">
                <div className="container">
                    <div className="section-title">
                        <span className="sub-title">APP SCREENS</span>
                        <h2>Beautifully Crafted All App Screenshots</h2>
                    </div>

                    {display ? <OwlCarousel 
                        className="app-screenshots-slides owl-carousel owl-theme"
                        {...options}
                    > 
                        <div className="single-screenshot-item">
                            <img  src="/images/screenshots/screenshots1.png" alt="screenshots" />
                        </div>
                        <div className="single-screenshot-item">
                            <img  src="/images/screenshots/screenshots2.png" alt="screenshots" />
                        </div>
                        <div className="single-screenshot-item">
                            <img  src="/images/screenshots/screenshots3.png" alt="screenshots" />
                        </div>
                        <div className="single-screenshot-item">
                            <img  src="/images/screenshots/screenshots4.png" alt="screenshots" />
                        </div>
                        <div className="single-screenshot-item">
                            <img  src="/images/screenshots/screenshots5.png" alt="screenshots" />
                        </div>
                        <div className="single-screenshot-item">
                            <img  src="/images/screenshots/screenshots4.png" alt="screenshots" />
                        </div>
                    </OwlCarousel> : ''}
                </div>
            </div>
        </>
    )
}

export default AppScreenshots;