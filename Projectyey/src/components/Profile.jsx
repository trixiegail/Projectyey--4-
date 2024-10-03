// src/components/Profile.jsx
import React from "react";

function Profile({ user }) {
  return (
    <div className="profile-section bg-gray-100 p-4 rounded-lg">
      <img
        src={user.profileImage || "default-profile-image.png"}
        alt="Profile"
        className="w-16 h-16 rounded-full"
      />
      <h3 className="text-xl font-semibold">{user.name}</h3>
      <p className="text-gray-600">{user.email}</p>
    </div>
  );
}

export default Profile;
