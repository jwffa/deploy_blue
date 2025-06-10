import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@headlessui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// desktop images array
const images = [
  "/images/1.jpeg",
  "/images/41.jpeg",
  "/images/45.jpeg",
  "/images/49.jpeg",
];

// mobile images array
const imagesOnPhone = [
  "/images/29.jpeg",
  "/images/43.jpeg",
  "/images/47.jpeg",
  "/images/51.jpeg",
];

const SliderSection = () => {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [desktopImagesLoaded, setDesktopImagesLoaded] = useState([]);
  const [mobileImagesLoaded, setMobileImagesLoaded] = useState([]);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);
  
  // preload images separately for desktop and mobile
  useEffect(() => {
    const preloadImages = () => {
      // get scroll position before loading
      const scrollPos = window.scrollY;
      
      // track loaded images for desktop
      const loadedDesktopImages = [];
      images.forEach((src) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedDesktopImages.push(src);
          if (loadedDesktopImages.length === images.length) {
            setDesktopImagesLoaded(loadedDesktopImages);
            window.scrollTo(0, scrollPos);
          }
        };
      });
      
      // track loaded images for mobile
      const loadedMobileImages = [];
      imagesOnPhone.forEach((src) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedMobileImages.push(src);
          if (loadedMobileImages.length === imagesOnPhone.length) {
            setMobileImagesLoaded(loadedMobileImages);
            window.scrollTo(0, scrollPos);
          }
        };
      });
    };
    
    preloadImages();
  }, []);

  const nextSlide = (e) => {
    e.preventDefault();
    const scrollPos = window.scrollY;
    
    setIndex((prev) => (prev + 1) % (isMobile ? imagesOnPhone.length : images.length));
    
    setTimeout(() => {
      window.scrollTo(0, scrollPos);
    }, 0);
  };
  
  const prevSlide = (e) => {
    e.preventDefault();
    const scrollPos = window.scrollY;
    
    setIndex((prev) => (prev - 1 + (isMobile ? imagesOnPhone.length : images.length)) % (isMobile ? imagesOnPhone.length : images.length));
    setTimeout(() => {
      window.scrollTo(0, scrollPos);
    }, 0);
  };

  // check if device is mobile and update state accordingly
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // automatic slide change every 4 seconds with scroll position preservation
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      const scrollPos = window.scrollY;
      
      setIndex((prev) => (prev + 1) % (isMobile ? imagesOnPhone.length : images.length));
      
      // restore scroll position after state update
      setTimeout(() => {
        window.scrollTo(0, scrollPos);
      }, 0);
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isMobile]);

  // get the current image source based on device type
  const getCurrentImageSrc = () => {
    if (isMobile && mobileImagesLoaded.length > 0) {
      return mobileImagesLoaded[index % mobileImagesLoaded.length];
    } else if (desktopImagesLoaded.length > 0) {
      return desktopImagesLoaded[index % desktopImagesLoaded.length];
    }
    return "";
  };

  // check if images are loaded
  const areImagesLoaded = isMobile ? mobileImagesLoaded.length === imagesOnPhone.length : desktopImagesLoaded.length === images.length;

    return (
      <div ref={sliderRef} className="relative w-full max-w-screen-xl mx-auto flex flex-col items-center overflow-hidden">
        <div className="relative w-full h-auto rounded-2xl max-w-full overflow-hidden">
          {areImagesLoaded && (
            <motion.img
              layoutId="slider-image" 
              layout="position" 
              src={getCurrentImageSrc()}
              alt="Slide"
              className="w-full h-auto object-cover rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 0.5,
                layout: { duration: 0 } 
              }}
            />
          )}
        </div>
    
        <div className="absolute inset-0 md:flex hidden items-center justify-between px-6">
          <Button 
            onClick={prevSlide} 
            className="cursor-pointer bg-[#1c1c1c70]/50 text-white px-3 py-1 rounded-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button 
            onClick={nextSlide} 
            className="cursor-pointer bg-[#1c1c1c70]/50 text-white px-3 py-1 rounded-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
};

export default SliderSection;


