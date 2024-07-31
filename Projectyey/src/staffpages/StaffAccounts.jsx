import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';

function StaffAccounts() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUpdate, setIsUpdateMode] = useState(false); // State to track update mode
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/staffs?archived=false');
      if (response.status === 200) {
        setData(response.data);
        console.log('Staff accounts fetched successfully:', response.data);
      } else {
        throw new Error('Failed to fetch staff accounts');
      }
    } catch (error) {
      console.error('Error fetching staff accounts:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/user/staffs/search?keyword=${searchTerm}`);
      if (response.status === 200) {
        setData(response.data);
        console.log('Staff accounts fetched successfully:', response.data);
      } else {
        throw new Error('Failed to search staff accounts');
      }
    } catch (error) {
      console.error('Error searching staff accounts:', error);
    }
  };

  const handleArchiveClick = (user) => {
    setSelectedUser(user);
    setConfirmationOpen(true);
  };

  const handleArchiveConfirm = async () => {
    try {
      console.log(`Attempting to archive user with ID: ${selectedUser.id}`);
      const response = await axios.post(`http://localhost:8080/user/staffs/archiveStaff/${selectedUser.id}`);
      console.log('Archive response:', response);
      if (response.status === 200) {
        console.log('Staff account archived successfully');
        setData(prevData => prevData.filter(user => user.id !== selectedUser.id));
      } else {
        throw new Error(`Failed to archive staff account. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error archiving staff account:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
    setConfirmationOpen(false);
    setSelectedUser(null);
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewClick = (user) => {
    console.log('View User:', user);
    setSelectedUser(user);
    setIsUpdateMode(false); // Set mode to view
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setIsUpdateMode(false); // Reset mode
  };

  const handleInputChange = (e) => {
    setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
    console.log('Selected User on Input Change:', { ...selectedUser, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    console.log('Selected User before Update:', selectedUser);

    if (selectedUser && selectedUser.id) {
      try {
        console.log('Updating user with ID:', selectedUser.id);
        const response = await axios.put(`http://localhost:8080/user/updateStaff/${selectedUser.id}`, selectedUser);
        if (response.status === 200) {
          console.log('Staff account updated successfully');
          fetchData(); // Refresh the data
        } else {
          throw new Error('Failed to update staff account');
        }
      } catch (error) {
        console.error('Error updating staff account:', error);
      }
      handleClose();
    } else {
      console.error('Selected user or user ID is undefined');
    }
  };

  return (
    <div className='ml-[265px]'>
      <Nav />
      <img src="src/image/logo.png" alt="Logo" className="absolute top-0 left-5 ml-[265px] object-center"/>

      <div className="w-50 ml-10 mt-[120px] relative ">
        <div className="flex items-center mb-5 mt-5">
          <input
            type="text"
            id="search-bar"
            placeholder="Search"
            value={searchTerm}
            onChange={handleChange}
            className="flex-grow p-2 border border-gray-300 rounded-lg shadow-sm"
          />
          <button
            onClick={handleSearch}
            className="ml-2 p-2 bg-[#F7C301] text-white rounded-lg shadow-md hover:bg-[#F7C301]"
          >
            Search
          </button>

          <a
          href="/Create-account"
          className="ml-2 p-2 bg-[#F7C301] text-white rounded-lg shadow-md hover:bg-[#F7C301]">
            <span>Create Account</span>
          </a>
        </div>
        
        <div className="overflow-auto h-96 mt-2">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-[#88343B] text-white">
              <tr>
                <th className="w-1/6 py-3 px-4 uppercase font-semibold text-sm">ID Number</th>
                <th className="w-1/6 py-3 px-4 uppercase font-semibold text-sm">First Name</th>
                <th className="w-1/6 py-3 px-4 uppercase font-semibold text-sm">Last Name</th>
                <th className="w-1/6 py-3 px-4 uppercase font-semibold text-sm">Birthdate</th>
                <th className="w-1/6 py-3 px-4 uppercase font-semibold text-sm">Email</th>
                <th className="w-1/6 py-3 px-4 uppercase font-semibold text-sm">Actions</th>
              </tr>
            </thead>  
            <tbody className="text-gray-700">
            {data.filter(user => !user.archived).map((user) => (
                <tr key={user.id}>
                  <td className="w-1/6 py-3 px-4">{user.idNumber}</td>
                  <td className="w-1/6 py-3 px-4">{user.firstname}</td>
                  <td className="w-1/6 py-3 px-4">{user.lastname}</td>
                  <td className="w-1/6 py-3 px-4">{user.birthdate}</td>
                  <td className="w-1/6 py-3 px-4">{user.email}</td>
                  <td className="w-1/6 py-3 px-4">
                    <button
                      onClick={() => handleViewClick(user)}
                      className="ml-8 mb-2 px-4 py-2 bg-[#88343B] text-white rounded-lg shadow-md hover:bg-[#88343B]"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setIsUpdateMode(true);
                        setDialogOpen(true);
                      }}
                      className="ml-6 mb-2 px-4 py-2 bg-[#88343B] text-white rounded-lg shadow-md hover:bg-[#88343B]"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleArchiveClick(user)}
                      className="ml-7 mb-2 px-4 py-2 bg-[#88343B] text-white rounded-lg shadow-md hover:bg-[#88343B]"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className={`fixed z-10 inset-0 overflow-y-auto ${dialogOpen ? '' : 'hidden'}`}>
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {isUpdate ? 'Update Staff Details' : 'Staff Details'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">ID Number: {selectedUser.idNumber}</p>
                      {isUpdate ? (
                        <>
                          <input
                            type="text"
                            name="firstname"
                            value={selectedUser.firstname}
                            onChange={handleInputChange}
                            className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                            placeholder="First Name"
                          />
                          <input
                            type="text"
                            name="lastname"
                            value={selectedUser.lastname}
                            onChange={handleInputChange}
                            className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                            placeholder="Last Name"
                          />
                          <input
                            type="text"
                            name="birthdate"
                            value={selectedUser.birthdate}
                            onChange={handleInputChange}
                            className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                            placeholder="Birthdate"
                          />
                          <input
                            type="email"
                            name="email"
                            value={selectedUser.email}
                            onChange={handleInputChange}
                            className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                            placeholder="Email"
                          />
                        </>
                      ) : (
                        <>
                          <p className="mt-2 text-sm text-gray-500">First Name: {selectedUser.firstname}</p>
                          <p className="mt-2 text-sm text-gray-500">Last Name: {selectedUser.lastname}</p>
                          <p className="mt-2 text-sm text-gray-500">Birthdate: {selectedUser.birthdate}</p>
                          <p className="mt-2 text-sm text-gray-500">Email: {selectedUser.email}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {isUpdate ? (
                  <button
                    onClick={handleUpdate}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#F7C301] font-medium text-white hover:bg-[#88343B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Update
                  </button>
                ) : null}
                <button
                  onClick={handleClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {confirmationOpen && (
        <div className={`fixed z-10 inset-0 overflow-y-auto`}>
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Confirm Archive</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to archive the student account for {selectedUser.firstname} {selectedUser.lastname}?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleArchiveConfirm}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#88343B] text-base font-medium text-white hover:bg-[#88343B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-[#88343B] sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmationOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-[#88343B] sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffAccounts;
