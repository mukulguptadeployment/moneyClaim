import React from "react";
import Header from "./Header";
import Head from "next/head";

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <title>Money Claim</title>
        <link rel="icon" href="/Logo.png" />
      </Head>
      <div className="root">
        <Header />
        {children}
      </div>
    </>
  );
};

export default Layout;
