import React from 'react';
import Studfooter from "../components/Studfooter";
import Studnav from '../components/Studnav';
 
function AboutUs() {
  return (
    <div>
      <Studnav />
      <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl py-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">About Us</h1>
            <p className="py-5 text-black">
              Welcome to our Dental Clinic, where your smile is our top priority. Our team is dedicated to providing you with personalized, gentle care that you deserve.
            </p>
          </div>
 
          <div className="mt-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex justify-center">
                  <img src="C:\Users\Mark Nikko\Desktop\nikko\2024-2025 1st sem\IT411\capstone\Projectyey--4-\Projectyey\src\image\mission.png" className="h-48 w-48 rounded-full object-cover" />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-[#88343B]">Our Mission</h3>
                <p className="mt-4 text-black">
                  To protect, promote and maintain the well-being of students and school personnel.
                </p>
                <p className="mt-4 text-black">
                  To promote and maintain school health which consists of the physiological, psychological, sociological, spritual aspect of health as they relate to the school setting.
                </p>
              </div>
 
              <div className="text-center">
                <div className="flex justify-center">
                  <img src="C:\Users\Mark Nikko\Desktop\nikko\2024-2025 1st sem\IT411\capstone\Projectyey--4-\Projectyey\src\image\vission.png" className="h-48 w-48 rounded-full object-cover" />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-[#88343B]">Our Vision</h3>
                <p className="mt-4 text-black">
                  A health conscious school population with a well-equipped clinic and updated staff on the current trends in medical and dental management.
                </p>
              </div>
 
              <div className="text-center">
                <div className="flex justify-center">
                  <img src="C:\Users\Mark Nikko\Desktop\nikko\2024-2025 1st sem\IT411\capstone\Projectyey--4-\Projectyey\src\image\values.png" className="h-48 w-48 rounded-full object-cover" />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-[#88343B]">Our Values</h3>
                <p className="mt-4 text-black">
                  At CIT-U medical dental clinic, what we stand for is simple: compassionate care, integrity and excellence in every smile we help create.
                </p>
              </div>
            </div>
          </div>
 
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-[#88343B]">Meet Our Team</h2>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex justify-center">
                  <img src="C:\Users\Mark Nikko\Desktop\nikko\2024-2025 1st sem\IT411\capstone\Projectyey--4-\Projectyey\src\image\doc.png" className="h-48 w-48 rounded-full object-cover" />
                </div>
                <h4 className="mt-4 text-xl font-bold text-[#88343B]">Dr. John Doe</h4>
                <p className="mt-2 text-black">Chief Dentist</p>
              </div>
             
              <div className="text-center">
                <div className="flex justify-center">
                  <img src="C:\Users\Mark Nikko\Desktop\nikko\2024-2025 1st sem\IT411\capstone\Projectyey--4-\Projectyey\src\image\doc.png" className="h-48 w-48 rounded-full object-cover" />
                </div>
                <h4 className="mt-4 text-xl font-bold text-[#88343B]">Dr. Jane Smith</h4>
                <p className="mt-2 text-black">Orthodontist</p>
              </div>
             
              <div className="text-center">
                <div className="flex justify-center">
                  <img src="C:\Users\Mark Nikko\Desktop\nikko\2024-2025 1st sem\IT411\capstone\Projectyey--4-\Projectyey\src\image\doc.png" className="h-48 w-48 rounded-full object-cover" />
                </div>
                <h4 className="mt-4 text-xl font-bold text-[#88343B]">Dr. Emily Johnson</h4>
                <p className="mt-2 text-black">Pediatric Dentist</p>
              </div>
             
              <div className="text-center">
                <div className="flex justify-center">
                  <img src="C:\Users\Mark Nikko\Desktop\nikko\2024-2025 1st sem\IT411\capstone\Projectyey--4-\Projectyey\src\image\doc.png" className="h-48 w-48 rounded-full object-cover" />
                </div>
                <h4 className="mt-4 text-xl font-bold text-[#88343B]">Dr. Michael Lee</h4>
                <p className="mt-2 text-black">Periodontist</p>
              </div>
            </div>
          </div>
 
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-[#88343B]">Contact Us</h2>
            <p className="py-5 text-black">
              We would love to hear from you! Whether you have a question, want to book an appointment, or simply want to share your feedback, feel free to reach out.
            </p>
            <div className="mt-10">
 
              <a className="px-6 py-3 bg-[#F7C301] text-[rgb(136,52,59)] font-bold rounded-lg hover:bg-yellow-600 "
              href="/contact">Get in Touch</a>
            </div>
          </div>
        </div>
      </div><Studfooter />
    </div>
  );
}
 
export default AboutUs;