// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Flashcards from './pages/Flashcards';
import LoginModal from './components/LoginModal';

const ProtectedRoute = ({ user, setUser, children }) => {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(!user);

  useEffect(() => {
    setIsLoginOpen(!user); // Open modal only if user is not logged in
  }, [user]);

  const handleLoginClose = () => {
    setIsLoginOpen(false);
    if (!user) {
      navigate('/');
    }
  };

  return (
    <>
      {user ? (
        children
      ) : (
        <div className="min-h-screen bg-gray-800 text-white flex items-center justify-center">
          <p>Please log in to continue.</p>
        </div>
      )}
      <LoginModal
        isOpen={isLoginOpen}
        onRequestClose={handleLoginClose}
        setUser={setUser}
      />
    </>
  );
};

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user');
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
    }
  }, [user]);

  return (
    <Router>
      <div className="bg-gray-800 min-h-screen">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route
            path="/flashcards"
            element={
              <ProtectedRoute user={user} setUser={setUser}>
                <Flashcards />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute user={user} setUser={setUser}>
                <Flashcards />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;