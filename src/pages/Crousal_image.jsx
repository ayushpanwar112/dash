import React, { useState } from "react";
import CrousalComponentDesktop from "../components/CrousalComponentDesktop";
import CarousalForSmallScreen from "../components/CrousalForSmallScreen";

const Crousal_image = () => {
  const [showDesktop, setShowDesktop] = useState(true);

  const handleToggle = () => {
    setShowDesktop(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-8">
    

        {/* Toggle Controls */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-2 shadow-lg border">
            <button
              onClick={handleToggle}
              className="relative px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <span>
                  {showDesktop ? "Switch to Mobile View" : "Switch to Desktop View"}
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Current View Indicator */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md border">
            <div className={`w-3 h-3 rounded-full ${showDesktop ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm font-medium text-gray-600">Desktop</span>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className={`w-3 h-3 rounded-full ${!showDesktop ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm font-medium text-gray-600">Mobile</span>
          </div>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 border">
          {/* View Title */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              {showDesktop ? "Desktop Carousel View" : "Mobile Carousel View"}
            </h2>
            <p className="text-gray-600 mt-2">
              {showDesktop 
                ? "Optimized for large screens with rich content layout" 
                : "Streamlined for mobile devices with touch-friendly navigation"
              }
            </p>
          </div>

          {/* Carousel Component */}
          <div className="transition-all duration-500 ease-in-out">
            {showDesktop ? <CrousalComponentDesktop /> : <CarousalForSmallScreen />}
          </div>
        </div>

        {/* Features Section */}
        
      </div>
    </div>
  );
};

export default Crousal_image;