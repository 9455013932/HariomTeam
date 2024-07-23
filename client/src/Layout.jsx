import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Pages/Header.jsx';
import Spinner from './components/Pages/Spinner.jsx';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';

function Layout() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // console.log("hello",document.cookie);
  // console.log("cook", Cookies.get('token'));

  useEffect(() => {
    const checkToken = async () => {
      const token = await Cookies.get('token');
      
      setIsLoggedIn(!!token);
      setIsLoading(false);
    };
  
    checkToken();
  }, []);

  if (isLoading) {
    // Optionally, you can render a loading spinner or message here
     
    return <Spinner />
  }

  return isLoggedIn ? (
    <>
      <Header />
      <Outlet />
    </>
  ) :<Navigate to="/" />;
}

export default Layout;
