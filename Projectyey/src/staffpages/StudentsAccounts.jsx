import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';

function StudentAccounts() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://dentalmanagement.azurewebsites.net/student/getAllStudents?archived=false'
      );
      if (response.status === 200) {
        setData(response.data);
      } else {
        throw new Error('Failed to fetch student accounts');
      }
    } catch (error) {
      console.error('Error fetching student accounts:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://dentalmanagement.azurewebsites.net/student/searchStudents?keyword=${searchTerm}`
      );
      if (response.status === 200) {
        setData(response.data);
      } else {
        throw new Error('Failed to search student accounts');
      }
    } catch (error) {
      console.error('Error searching student accounts:', error);
    }
  };

  const handleArchiveConfirm = async () => {
    try {
      const response = await axios.post(
        `https://dentalmanagement.azurewebsites.net/student/archive/${selectedUser.id}`
      );
      if (response.status === 200) {
        setData((prevData) =>
          prevData.filter((user) => user.id !== selectedUser.id)
        );
      } else {
        throw new Error('Failed to archive student account');
      }
    } catch (error) {
      console.error('Error archiving student account:', error);
    }
    setConfirmationOpen(false);
    setSelectedUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (selectedUser?.id) {
      try {
        const response = await axios.put(
          `https://dentalmanagement.azurewebsites.net/student/updateStudent/${selectedUser.id}`,
          selectedUser
        );
        if (response.status === 200) {
          fetchData();
        } else {
          throw new Error('Failed to update student account');
        }
      } catch (error) {
        console.error('Error updating student account:', error);
      }
      handleClose();
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setIsUpdateMode(false);
  };

  return (
    <div className="ml-[265px]" style={{ minHeight: '100vh' }}>
      <Nav />
      <div className="w-50 ml-10 relative pt-[50px]">
        <h1 className="text-2xl font-bold mb-5">Student Account</h1>
        <div className="flex items-center mb-5 mt-5 mr-40 ml-40">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-lg shadow-sm"
          />
          <button
            onClick={handleSearch}
            className="ml-2 p-2 bg-[#F7C301] text-white rounded-lg shadow-md"
          >
            Search
          </button>
        </div>
        <div className="overflow-auto h-96 mt-2 mr-7">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-[#88343B] text-white">
              <tr>
                <th>ID Number</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Birthdate</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data
                .filter((user) => !user.archived)
                .map((user) => (
                  <tr key={user.id}>
                    <td>{user.idNumber}</td>
                    <td>{user.firstname}</td>
                    <td>{user.lastname}</td>
                    <td>{user.birthdate}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsUpdateMode(false);
                          setDialogOpen(true);
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsUpdateMode(true);
                          setDialogOpen(true);
                        }}
                      >
                        Update
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setConfirmationOpen(true);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {/* Dialog */}
        {dialogOpen && selectedUser && (
          <div>
            {isUpdateMode ? (
              <>
                <input
                  name="firstname"
                  value={selectedUser.firstname}
                  onChange={handleInputChange}
                />
                <button onClick={handleUpdate}>Save</button>
              </>
            ) : (
              <p>{selectedUser.firstname}</p>
            )}
            <button onClick={handleClose}>Close</button>
          </div>
        )}
        {/* Archive Confirmation */}
        {confirmationOpen && (
          <div>
            <p>
              Are you sure you want to delete{' '}
              {selectedUser?.firstname || 'this user'}?
            </p>
            <button onClick={handleArchiveConfirm}>Confirm</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentAccounts;
