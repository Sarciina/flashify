import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/api';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh');
      await logout(refreshToken);
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="text-white text-2xl font-bold">
        <Link to="/">FLASHIFY</Link>
      </div>
      <div className="space-x-4">
        {user ? (
          <>
            <span className="text-white">Welcome, {user.username}</span>
            <Link to="/flashcards" className="text-white hover:text-gray-300">
              Flashcards
            </Link>
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-white hover:text-gray-300">
              Login
            </Link>
            <Link to="/register" className="text-white hover:text-gray-300">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;