import React from 'react'
import Image from 'next/image';

const Preloader = () => {
    return (
        <>
            <div className="preloader-area">
                <div className="d-table">
                    <div className="d-table-cell">
                        <Image src="/images/black-logo.png" alt="logo" width="138" height="44" />
                        <p>Загрузка...</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .preloader-area {
                    position: fixed;
                    background: #fff;
                    width: 100%;
                    top: 0;
                    height: 100%;
                    z-index: 1010;
                    left: 0;
                    text-align: center;
                    opacity: .96;
                }
                .preloader-area img {
                    margin-bottom: 5px;
                }
                .preloader-area p {
                    font-size: 17px;
                }
            `}</style>
        </>
    )
}

export default Preloader;
