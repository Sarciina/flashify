import { useState } from 'react';
import { login } from '../utils/api';

const LoginForm = ({ setUser }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(credentials);
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      setUser(data.user);
      setError(null);
      window.location.href = '/flashcards';
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl text-white mb-4">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={credentials.username}
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
            value={credentials.password}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;