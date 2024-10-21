import { useRef, useState } from 'react';
import Studfooter from "../components/Studfooter";
import Studnav from '../components/Studnav';
import emailjs from '@emailjs/browser';

function Contact() {
  const form = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

  const sendEmail = (e) => {
    e.preventDefault();

    if (form.current.checkValidity()) {
      emailjs
          .sendForm('service_42kzvpa', 'template_oq327k3', form.current, {
            publicKey: 'E0l0YjX0W9Dk-nXit',
          })
          .then(() => {
                console.log('SUCCESS!');
                // Simulate notifying the doctor by updating local storage or state
                const currentNotifications = JSON.parse(localStorage.getItem('doctorNotifications')) || [];
                currentNotifications.push({ message: 'A student has sent a message', date: new Date() });
                localStorage.setItem('doctorNotifications', JSON.stringify(currentNotifications));
                setIsModalOpen(true);
                form.current.reset();
              },
              (error) => {
                console.log('FAILED...', error.text);
              });
    } else {
      form.current.reportValidity();
    }
  };


  const closeModal = () => {
    setIsModalOpen(false); // Close modal
  };

  return (
      <div>
        <Studnav />
        <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl py-10 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">Contact Us</h1>
              <p className="py-5 text-black">
                We would love to hear from you! Whether you have a question about our services, need assistance, or want to schedule an appointment, please feel free to reach out to us.
              </p>
            </div>

            <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-[#88343B] p-6 rounded-lg shadow-md text-white">
                <h3 className="text-2xl font-bold">Clinic Address</h3>
                <p className="mt-4">
                  123 Dental St.<br />
                  Smile City, SC 12345
                </p>
                <h3 className="text-2xl font-bold mt-6">Phone</h3>
                <p className="mt-4">
                  (123) 456-7890
                </p>
                <h3 className="text-2xl font-bold mt-6">Email</h3>
                <p className="mt-4">
                  dentalcapstone5@gmail.com
                </p>
              </div>

              <div className="bg-[#88343B] p-6 rounded-lg shadow-md text-white">
                <h3 className="text-2xl font-bold">Office Hours</h3>
                <p className="mt-4">
                  Monday - Friday: 8:00 AM - 6:00 PM<br />
                  Saturday: 9:00 AM - 2:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>

            <div className="mt-20 text-center">
              <h2 className="text-3xl font-bold text-[#88343B]">Send Us a Message</h2>
              <form className="mt-8 space-y-6 mx-auto max-w-lg" ref={form} onSubmit={sendEmail}>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="name" className="sr-only">Name</label>
                    <input
                        type="text"
                        name="user_name"
                        id="name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Your Name"
                        required // Make the field required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                        type="email"
                        name="user_email"
                        id="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Your Email"
                        required // Make the field required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="sr-only">Message</label>
                    <textarea
                        name="message"
                        id="message"
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Your Message"
                        required // Make the field required
                    ></textarea>
                  </div>
                </div>
                <button
                    type="submit"
                    value={"Send"}
                    className="w-full px-6 py-3 bg-[#F7C301] text-black font-bold rounded-lg hover:bg-yellow-600"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Success Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-bold text-green-600">Message Sent Successfully!</h2>
                <p className="mt-4">Thank you for reaching out to us. We'll get back to you shortly.</p>
                <button
                    className="mt-6 px-4 py-2 bg-[#F7C301] text-black font-bold rounded-lg hover:bg-yellow-600"
                    onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
        )}

        <Studfooter />
      </div>
  );
}

export default Contact;
