import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LiaSignInAltSolid } from 'react-icons/lia';
import axios from 'axios';
import formimg from '../assets/formimg.png';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setMessage(null);
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, formData);
      const { access_token, username: user, profile: profile, owner: owner } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('username', user);
      localStorage.setItem('profile', profile);
      localStorage.setItem('owner', owner);

      setMessage(response.data.message);
      navigate('/');
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        setErrors(errorData.errors);
      } else {
        setMessage(errorData?.message || 'An error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container m-auto g-6 flex h-full flex-wrap items-center justify-center lg:justify-between mt-28">
      {/* Image Column */}
      <div className="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
        <img
          src={formimg}
          className="w-full hidden lg:block"
          alt="Sample image"
        />
      </div>

      {/* Form Column */}
      <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-md">
        <LiaSignInAltSolid className="fill-primary size-20 mx-auto p-4"/>
        <h2 className="text-2xl font-semibold text-center text-primary mb-4 uppercase">Login</h2>
        {message && <p className="text-center text-red-500 mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full p-2 border border-primary rounded-md ${errors.username ? 'border-red-500' : ''}`}
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-2 border border-primary rounded-md ${errors.password ? 'border-red-500' : ''}`}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <div className="text-center my-12">
            <p>Forgot your password? </p>
            <button
              type="button"
              className="text-primary font-bold hover:underline"
              onClick={() => navigate('/forgot-password')}
            >
                            Reset Password
            </button>
          </div>

          <div className="text-center mb-16">
            <p> Don't have an account? </p>
            <button
              type="button"
              className="text-primary font-bold hover:underline"
              onClick={() => navigate('/signup')}
            >
                            Sign Up
            </button>

          </div>

          <button
            type="submit"
            className={`w-full p-2 ${loading ? 'bg-secondaryHover' : 'bg-secondary'} text-offwhite rounded-md hover:bg-secondaryHover`}
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>
        <div className="text-center pt-10">Bookaspot &copy;{new Date().getFullYear()}</div>
      </div>
    </div>
  );
};

export default Login;
