import { default as React } from "react";
import Studfooter from "../components/Studfooter";
import Studnav from "../components/Studnav";
 
export function Home() {
  const [open, setOpen] = React.useState(1);
 
  const handleOpen = (value) => setOpen(open === value ? 0 : value);
 
  const stats = [
    { id: 1, name: 'Happy Patient', value: '780+' },
    { id: 2, name: 'Online Appointment', value: '560+' },
    { id: 3, name: 'Winning Award', value: '340+' },
  ]
 
  return (
    <>
      <div>
          <Studnav />
          <img
            className="h-90 w-full items-center"
            src="/Banner.png"
            alt="Your Company"
          />
 
      <section className="py-16 bg-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          {/* Image Section */}
          <div className="md:w-1/2 w-full px-4 mb-8 md:mb-0">
            <img src="/Aboutus.png" alt="Happy Dental" className="rounded-lg shadow-lg" />
          </div>
 
          {/* Text Section */}
          <div className="md:w-1/2 w-full px-4">
            <h2 className="text-lg font-semibold text-gray-600 uppercase mb-2">About Us</h2>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Trusted Partner For Dental Health</h1>
            <p className="text-gray-700 mb-6" style={{ textAlign: 'justify' }}>
            At CIT-U University Medical-Dental Clinic, we are dedicated to providing top-quality dental care. With a commitment to excellence, our experienced dentists offer personalized treatments in a welcoming environment. We believe that everyone deserves access to affordable, reliable dental services to ensure a healthy smile. Trust us to be your partner in maintaining optimal dental health, with expert care that you can rely on.
            </p>
            <div className="flex items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Experienced Dentist</h3>
                <p className="text-gray-600" style={{ textAlign: 'justify' }}>Our team of dentists brings years of experience and expertise in various dental specialties, ensuring you receive the highest standard of care. With a patient-centered approach, we strive to make every visit comfortable and effective, using the latest techniques and technology to achieve the best results.</p>
              </div>
            </div>
            <div className="flex items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Affordable Pricing</h3>
                <p className="text-gray-600" style={{ textAlign: 'justify' }}>Quality dental care should be accessible to everyone. We offer competitive pricing and flexible payment options to make our services affordable for all. From routine check-ups to advanced treatments, we believe in transparent pricing without compromising on the quality of care.</p>
              </div>
            </div>
          </div>
        </div>
 
        <video className="h-50 w-50 rounded-lg container mx-auto flex flex-col items-center mt-20" controls>
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>
 
      <section className="py-16 bg-[#88343B] flex pt-20">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
          {/* Text Section */}
          <div className="w-full px-4 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Happy dental Statistic</h1>
            <p className="text-white mb-6 col-span-4 lg:col-span-6" >
            Our clinic takes pride in delivering satisfaction to our patients, with countless smiles and successful treatments. These statistics represent the trust and happiness of our patients, highlighting our dedication to providing top-quality dental care. Join our community of satisfied clients and experience dental care that exceeds expectations.
            </p>
          </div>
        </div>
      </section>
 
      <div className="border-b border-black mx-20"></div>
 
      <div className="bg-[#88343B] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-white">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-[#F7C301] sm:text-5xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
 
      <section className="py-16 bg-white">
  <div className="container mx-auto text-center">
    <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-8">Your Journey to a Healthy Smile Starts Here</h1>
    <div className="flex flex-col md:flex-row justify-center items-center gap-8">
      <div className="max-w-xs text-center">
        <div className="bg-[#88343B] p-4 mb-4 inline-block rounded">
          <img src="/scedule.png" alt="Make Appointment Icon" className="h-16 w-16" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Make Appointment</h3>
        <p className="text-gray-600">Conveniently book your next visit with us and start your journey to optimal dental health.</p>
      </div>
      <div className="max-w-xs text-center">
        <div className="bg-[#88343B] p-4 mb-4 inline-block rounded">
          <img src="/dentist.png" alt="Expert Dental Care Icon" className="h-16 w-16" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Dental Care</h3>
        <p className="text-gray-600">Our skilled team provides personalized treatments to meet all your dental needs.</p>
      </div>
      <div className="max-w-xs text-center">
        <div className="bg-[#88343B] p-4 mb-4 inline-block rounded">
          <img src="/whitening.png" alt="Radiate Confidence Icon" className="h-16 w-16" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Radiate Confidence</h3>
        <p className="text-gray-600">Leave our clinic with a smile that makes you feel confident and proud.</p>
      </div>
    </div>
    <div className="mt-10">
    <a className=" bg-[#F7C301] text-[rgb(136,52,59)] font-bold rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300 w-full px-6 py-3"
    href="/student-calendar">
      Make Appointment
    </a>
    </div>
  </div>
</section>
 
 
 
          <Studfooter />
      </div>
 
 
    </>
  );
}
 
export default Home;