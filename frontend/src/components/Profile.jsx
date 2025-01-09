import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
        setFormData({
          firstname: response.data.firstname || '',
          lastname: response.data.lastname || '',
          username: response.data.username || '',
          email: response.data.email || ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    if (profileImage) {
      formDataToSend.append('profile', profileImage);
    }

    try {
      const response = await axios.put(`${apiUrl}/api/auth/user`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action is irreversible.'
    );
    if (confirmDelete) {
      try {
        await axios.delete(`${apiUrl}/api/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMessage('Account deleted successfully. Redirecting...');
        setTimeout(() => {
          localStorage.removeItem('token');
          window.location.href = '/';
        }, 2000);
      } catch (error) {
        setMessage(error.response?.data?.message || 'An error occurred');
      }
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto mt-32 md:mt-24">
      <h2 className="text-2xl font-bold text-center text-primary mb-4">
        Your Profile
      </h2>

      {message && <p className="text-center text-green-600">{message}</p>}

      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        {/* Profile Image */}
        <div className="flex flex-col items-center mb-4">
          <img
            src={`${apiUrl}/static/profile_images/${user.profile || 'default.png'}`}
            alt="Profile"
            className="w-32 h-32 rounded-full mb-2 border-2 border-primary"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 font-bold mb-2">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 font-bold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            className="bg-primary hover:bg-primaryHover text-offwhite font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
          >
            Update Profile
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="bg-secondary hover:bg-secondaryHover text-offwhite font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
          >
            Delete Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
