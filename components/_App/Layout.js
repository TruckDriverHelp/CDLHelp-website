import React from 'react'
import Head from "next/head"
import Navbar from "./Navbar"
import Footer from "./Footer"
// import GoTop from './GoTop'

const Layout = ({ children, alternateLinks }) => {

    return (
        <>
            {children}
        </>
    );
};

export default Layout;