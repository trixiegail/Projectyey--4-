// src/pages/Account.jsx
import React, { useState, useEffect } from 'react';

function Account({ user }) {
  const [userData, setUserData] = useState(user || {});

  useEffect(() => {
    // Simulate fetching user data from an API if `user` prop is not already provided
    if (!user) {
      setTimeout(() => {
        setUserData({
          profileImage: "path/to/profile-image.png",
          name: "John Doe",
          email: "john@example.com",
          phone: "(123) 456-7890",
          address: "123 Dental Street, Smile City",
        });
      }, 1000);
    }
  }, [user]);

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">My Account</h1>
      <div className="flex items-center mb-4">
        <img src={userData.profileImage || "default-profile-image.png"} alt="Profile" className="w-20 h-20 rounded-full" />
        <div className="ml-4">
          <h2 className="text-xl">{userData.name}</h2>
          <p>{userData.email}</p>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mt-4">Contact Information</h2>
        <p>Phone: {userData.phone}</p>
        <p>Address: {userData.address}</p>
      </div>
    </div>
  );
}

export default Account;
