// pages/index.js

import React from 'react';
import SignUp from './SignUp';  // Import your SignUp component
import SignIn from './SignIn';  // Import your SignIn component

const HomePage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '20px' }}>welcome</h1>
      <SignUp />  {/* Render SignUp component */}
      <SignIn />  {/* Render SignIn component */}
    </div>
  );
};

export default HomePage;


