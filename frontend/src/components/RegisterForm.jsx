import { useState } from 'react';
import { register } from '../utils/api';

const RegisterForm = () => {
  const [userData, setUserData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await register(userData);
      setSuccess(data.message);
      setError(null);
      setTimeout(() => (window.location.href = '/login'), 2000);
    } catch (err) {
      setError(err.response?.data || 'Registration failed');
      setSuccess(null);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl text-white mb-4">Register</h2>
      {error && <p className="text-red-500 mb-4">{JSON.stringify(error)}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={userData.username}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={userData.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={userData.password}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;