// src/components/LogoutModal.jsx
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom'; // Add this
import { logout } from '../utils/api';

Modal.setAppElement('#root');

const LogoutModal = ({ isOpen, onRequestClose, setUser }) => {
  const navigate = useNavigate(); // Add this

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh');
      await logout(refreshToken);
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      setUser(null); // Clear user state
      onRequestClose();
      navigate('/'); // Navigate to root
    } catch (error) {
      console.error('Logout failed:', error);
      setUser(null);
      onRequestClose();
      navigate('/');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="text-white"
    >
      <h2 className="text-2xl mb-4">Confirm Logout</h2>
      <p className="mb-4">Are you sure you want to log out?</p>
      <div className="flex space-x-4">
        <button
          onClick={handleLogout}
          className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Yes, Logout
        </button>
        <button
          onClick={onRequestClose}
          className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default LogoutModal;