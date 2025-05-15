import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Flashcards from './pages/Flashcards';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in (e.g., on page refresh)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    // Update localStorage when user changes
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <Router>
      <div className="bg-gray-800 min-h-screen">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/" element={<Flashcards />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;