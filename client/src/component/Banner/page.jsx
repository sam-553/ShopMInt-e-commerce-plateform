import React, { useEffect, useState } from 'react';

const desktopBanner = [
  '/images/assest/banner/img1.webp',
  '/images/assest/banner/img2.webp',
  '/images/assest/banner/img3.jpg',
  '/images/assest/banner/img4.jpg',
  '/images/assest/banner/img5.webp',
];

const mobileBanner = [
  '/images/assest/banner/img1_mobile.jpg',
  '/images/assest/banner/img2_mobile.webp',
  '/images/assest/banner/img3_mobile.jpg',
  '/images/assest/banner/img4_mobile.jpg',
  '/images/assest/banner/img5_mobile.png',
];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const banners = isMobile ? mobileBanner : desktopBanner;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [isMobile]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners]);

  return (
    <div className="relative w-full mt-18 overflow-hidden rounded-xl h-[450px] sm:h-[300px] max-sm:h-[200px] shadow-lg group">

      <div
        className="flex h-full transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {banners.map((image, idx) => (
          <div
            className="min-w-full h-full overflow-hidden"
            key={idx}
          >
            <img
              src={image}
              alt={`Banner ${idx + 1}`}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 bg-black/20 backdrop-blur-sm px-3 py-2 rounded-full">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to banner ${idx + 1}`}
            className={`rounded-full transition-all duration-300 ${
              currentIndex === idx
                ? 'w-7 h-2 bg-white'
                : 'w-2 h-2 bg-white/60 hover:bg-white hover:scale-125'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;