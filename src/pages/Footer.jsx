import React from 'react';

const Footer = () => {
  return (
    <>
      <footer className=" bg-green-500 w-full  font-sans font-semibold border-2 fixed bottom-0 border-[#f3f2f2] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <p className="text-sm font-bold">
              &copy; 2024 Your Blog App.All rights reserved.
            </p>
            <div className="flex space-x-4">
              {/* <Link to={"#"} className="hover:text-gray-400">About</Link> */}
              {/* bg-[#00af9d] */}
              {/* bg-[#6e63e8] */}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
