import { useEffect, useState } from "react";
import rugbyLogo from "@/assets/rugby-logo-white.svg";

export const LoadingScreen = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      {/* Logo Container with Animation */}
      <div className="animate-fade-in space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <img 
            src={rugbyLogo} 
            alt="Rugby School Thailand"
            className="h-16 md:h-20 w-auto animate-pulse-glow"
          />
        </div>

        {/* Loading Indicator */}
        <div className="flex flex-col items-center space-y-4">
          {/* Spinning Circle */}
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>

          {/* Loading Text */}
          <p className="text-gray-300 text-sm font-medium">
            Loading{dots}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center text-gray-400 text-xs">
        <p>© 2024 Rugby School Thailand</p>
      </div>
    </div>
  );
};
