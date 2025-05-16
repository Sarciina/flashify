// src/components/Navbar.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import LogoutModal from './LogoutModal';

const Navbar = ({ user, setUser }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

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
              onClick={() => setIsLogoutOpen(true)}
              className="text-white hover:text-gray-300"
            >
              Logout
            </button>
            <LogoutModal
              isOpen={isLogoutOpen}
              onRequestClose={() => setIsLogoutOpen(false)}
              setUser={setUser}
            />
          </>
        ) : (
          <>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="text-white hover:text-gray-300"
            >
              Login
            </button>
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="text-white hover:text-gray-300"
            >
              Register
            </button>
            <LoginModal
              isOpen={isLoginOpen}
              onRequestClose={() => setIsLoginOpen(false)}
              setUser={setUser}
            />
            <RegisterModal
              isOpen={isRegisterOpen}
              onRequestClose={() => setIsRegisterOpen(false)}
            />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;