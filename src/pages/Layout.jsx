// import React, { useState } from 'react';
// import { Outlet } from 'react-router-dom';
// import PublicNavbar from './Navbar/PublicNavbar';
// import PrivateNavbar from './Navbar/PrivateNavbar';
// import Footer from '../pages/Footer';

// const Layout = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false); 

//   return (
//     <>
//       <main>
//         {isLoggedIn ? <PrivateNavbar />: <PublicNavbar />}
//         <Outlet />
//         <Footer />
//       </main>
//     </>
//   );
// };

// export default Layout;
import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

const Layout = () => {
  return (
    <>
    <div>
      <Outlet/>
      <Footer/>
    </div>
    </>
  )
}

export default Layout