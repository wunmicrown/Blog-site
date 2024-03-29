import React from 'react';
// import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white text-black font-sans font-semibold border-2 border-[#f3f2f2]  py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center">
          <p className="text-sm">&copy; 2024 Your Blog App. All rights reserved.</p>
          <div className="flex space-x-4">
             {/* <Link to={"#"} className="hover:text-gray-400">About</Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
