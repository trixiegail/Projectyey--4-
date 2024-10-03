// src/pages/Settings.jsx
import React, { useState } from 'react';

function Settings() {
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleNotificationChange = () => {
    setNotification(!notification);
  };

  const handleSave = () => {
    // Handle saving settings logic (e.g., API call to save settings)
    console.log('Settings saved:', { password, notification });
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="mb-4">
        <label className="block text-gray-700">Change Password:</label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          className="w-full p-2 border border-gray-300 rounded mt-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Notifications:</label>
        <input
          type="checkbox"
          checked={notification}
          onChange={handleNotificationChange}
          className="mr-2"
        />
        Receive email notifications
      </div>
      <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
        Save Changes
      </button>
    </div>
  );
}

export default Settings;
