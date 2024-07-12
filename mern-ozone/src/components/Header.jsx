import React from 'react';
import logo from "./ozone.svg";

const Header = () => {
  return (
    <header className="bg-white text-white shadow-md py-4 px-6 flex items-center">
      <div className="flex items-center">
        <img src={logo} alt="" className="w-10 h-10 mr-2" />
        
      </div>
     
    </header>
  );
};

export default Header;
