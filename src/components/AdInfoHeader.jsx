import React from "react";
import { Link, useLocation } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

function AdInfoHeader() {
  const location = useLocation();
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/">
          <h1 className="text-xl font-['Pacifico'] text-primary">Adingo</h1>
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/Myads" className={`main-label${location.pathname === "/Myads" ? " active" : ""}`}>내 광고</Link>
          <Link to="/Local" className={`main-label${location.pathname === "/Local" ? " active" : ""}`}>지역 시세 보기</Link>
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
            <i className="ri-notification-3-line text-gray-600"></i>
          </div>
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
            <i className="ri-user-line text-gray-600"></i>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdInfoHeader;
