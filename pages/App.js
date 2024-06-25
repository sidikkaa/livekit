// pages/_app.js
import React from 'react';
import '../styles/globals.css'; // Import global styles
const MyApp = ({ Component, pageProps }) => {
    return <Component {...pageProps} />;
};

export default MyApp;
