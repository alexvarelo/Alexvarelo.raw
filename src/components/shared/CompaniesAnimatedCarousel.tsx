"use client";

import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "@/contexts/ThemeContext";

const press = [
  "wix",
  "wordpress",
  "notion",
  "trello",
  "figma",
  "dropbox",
  "ghost",
  "medium",
  "googleslides",
  "mailchimp",
  "squarespace",
];

// Create duplicates outside of the component to avoid re-creation on each render
const logosDuplicates = [...press, ...press, ...press, ...press];

export function CompaniesAnimatedCarousel() {
  const [width, setWidth] = useState(0);
  const { theme } = useContext(ThemeContext);
  
  useEffect(() => {
    // Handle window resize for responsiveness
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    
    // Set initial width
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Define gradient colors based on theme
  const fromColor = theme === 'light' ? 'from-white' : theme === 'business' ? 'from-[var(--b1)]' : 'from-gray-900';
  const toColor = 'to-transparent';
  
  // Define logo filter classes based on theme
  const logoClasses = theme === 'light' 
    ? "h-10 w-24 md:h-16 md:w-32 transition-all duration-300 flex-shrink-0" 
    : "h-10 w-24 md:h-16 md:w-32 transition-all duration-300 brightness-0 invert flex-shrink-0";

  return (
    <section id="press" className="py-10 md:py-14 overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-8 relative">
        <h3 className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 mb-6">
          FEATURED IN
        </h3>

        <div className="relative w-full flex items-center">
          {/* Left blur gradient - Theme aware */}
          <div className={`absolute left-0 top-0 bottom-0 w-16 md:w-24 z-10 bg-gradient-to-r ${fromColor} ${toColor}`}></div>
          
          {/* The logos container */}
          <div className="w-full overflow-hidden">
            <motion.div
              className="flex space-x-4 md:space-x-6"
              animate={{ 
                x: [0, -((press.length * 140))] // Calculate based on logo count and approximate width
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 30, 
                ease: "linear",
                repeatType: "loop"
              }}
            >
              {logosDuplicates.map((logo, idx) => (
                <img
                  key={idx}
                  src={`./${logo}.svg`}
                  className={logoClasses}
                  alt={`logo-${logo}`}
                />
              ))}
            </motion.div>
          </div>
          
          {/* Right blur gradient - Theme aware */}
          <div className={`absolute right-0 top-0 bottom-0 w-16 md:w-24 z-10 bg-gradient-to-l ${fromColor} ${toColor}`}></div>
        </div>
      </div>
    </section>
  );
}