import React from 'react';
// import GoTop from './GoTop'

const Layout = ({ children, dir }) => {
  return (
    <>
      <div dir={dir}>
        {/* <Navbar /> */}
        {children}
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default Layout;
