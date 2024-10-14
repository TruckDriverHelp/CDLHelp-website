import React from 'react'
import Head from "next/head"
import Navbar from "./Navbar"
import Footer from "./Footer"
// import GoTop from './GoTop'

const Layout = ({ children, alternateLinks, dir }) => {

    return (
        <>
            <div dir={dir}>
                {children}
            </div>
        </>
    );
};

export default Layout;