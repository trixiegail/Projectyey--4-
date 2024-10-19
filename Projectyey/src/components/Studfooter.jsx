import React from 'react';

const Studfooter = () => {
  return (
      <div className="bg-[#88343B]">
        <footer className="bg-[#88343B] text-white py-10">
          <div className="container mx-auto px-4 flex justify-between">
            <div className="w-1/3">
              {/* Brand logo */}
              <a href="/home" className="flex items-center text-xl font-bold text-black ">
                <img src="src/image/teethLogoDesignWhite.png" alt="Teeth Logo" className="h-20" />
                {/* HAPPY <span className="text-gray-800">DENTAL</span> */}
              </a>
              <p className="mt-2">
                Amet quis rhoncus turpis phasellus ut dui. Volutpat turpis tortor blandit eget nibh ac lacus vitae purus. Sagittis tortor fermentum.
              </p>
            </div>
            <div className="w-1/3 ml-20">
              <h3 className="text-xl font-semibold">Navigation</h3>
              <ul className="mt-2 space-y-2">
                <li><a href="#" className="hover:text-[#F7C301]">Home</a></li>
                <li><a href="#" className="hover:text-[#F7C301]">About Us</a></li>
                <li><a href="#" className="hover:text-[#F7C301]">Services</a></li>
                <li><a href="#" className="hover:text-[#F7C301]">Contact Us</a></li>
              </ul>
            </div>
            <div className="w-1/3">
              <h3 className="text-xl font-semibold">Services</h3>
              <ul className="mt-2 space-y-2">
                <li><a href="#" className="hover:text-[#F7C301]">Teeth Whitening</a></li>
                <li><a href="#" className="hover:text-[#F7C301]">Dental Filling</a></li>
                <li><a href="#" className="hover:text-[#F7C301]">Teeth Checkup</a></li>
                <li><a href="#" className="hover:text-[#F7C301]">Teeth Implants</a></li>
              </ul>
            </div>
            <div className="w-1/3">
              <h3 className="text-xl font-semibold">Resources</h3>
              <ul className="mt-2 space-y-2">
                <li><a href="#" className="hover:text-[#F7C301]">Customer Stories</a></li>
                <li><a href="#" className="hover:text-[#F7C301]">Help Center</a></li>
                <li><a href="#" className="hover:text-[#F7C301]">Documentation</a></li>
                <li><a href="#" className="hover:text-[#F7C301]">Blog & Guide</a></li>
              </ul>
            </div>
          </div>
        </footer>
        <div className="bg-[#fee140] bg-gradient-to-b from-[#F0E1A6] via-[#F0E1A6] to-[#E1C966] bg-[length:100%_100%] text-black text-center py-4 mt-10">
          <p>© 2024 Capstone 2</p>
        </div>
      </div>
  );
};

export default Studfooter;
