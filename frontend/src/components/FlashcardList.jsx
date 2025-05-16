// src/components/FlashcardList.jsx
import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { getFlashcards, createFlashcard, updateFlashcard, deleteFlashcard } from '../utils/api';

Modal.setAppElement('#root');

const FlashcardList = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentFlashcard, setCurrentFlashcard] = useState(null);
  const [newFlashcard, setNewFlashcard] = useState({ front: '', back: '' });
  const [error, setError] = useState(null);

  // Fetch flashcards on mount
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const data = await getFlashcards();
        setFlashcards(data);
      } catch (err) {
        setError('Failed to fetch flashcards');
        console.error('Fetch flashcards error:', err);
      }
    };
    fetchFlashcards();
  }, []);

  const handleAddOpen = () => {
    setNewFlashcard({ front: '', back: '' });
    setIsAddModalOpen(true);
  };

  const handleEditOpen = (flashcard) => {
    setCurrentFlashcard(flashcard);
    setNewFlashcard({ front: flashcard.front, back: flashcard.back });
    setIsEditModalOpen(true);
  };

  const handleDeleteOpen = (flashcard) => {
    setCurrentFlashcard(flashcard);
    setIsDeleteModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await createFlashcard(newFlashcard);
      setFlashcards([...flashcards, data]);
      setIsAddModalOpen(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create flashcard');
      console.error('Create flashcard error:', err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await updateFlashcard(currentFlashcard.id, newFlashcard);
      setFlashcards(flashcards.map((fc) => (fc.id === currentFlashcard.id ? data : fc)));
      setIsEditModalOpen(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update flashcard');
      console.error('Update flashcard error:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteFlashcard(currentFlashcard.id);
      setFlashcards(flashcards.filter((fc) => fc.id !== currentFlashcard.id));
      setIsDeleteModalOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to delete flashcard');
      console.error('Delete flashcard error:', err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl text-white mb-6">Your Flashcards</h1>
      {/* White card with plus icon for adding a flashcard */}
      <div
        className="bg-white text-black p-4 rounded-lg shadow-lg mb-6 flex items-center justify-center cursor-pointer hover:bg-gray-100"
        onClick={handleAddOpen}
      >
        <span className="text-2xl">+</span>
      </div>

      {/* Flashcard list */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {flashcards.map((flashcard) => (
          <div
            key={flashcard.id}
            className="bg-yellow-400 p-4 rounded-lg shadow-lg text-black relative"
          >
            <h3 className="font-bold mb-2">{flashcard.front}</h3>
            <p>{flashcard.back}</p>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleEditOpen(flashcard)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteOpen(flashcard)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Flashcard Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
        className="text-white"
      >
        <h2 className="text-2xl mb-4">Add Flashcard</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleAddSubmit}>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="front">
              Front
            </label>
            <input
              type="text"
              name="front"
              id="front"
              value={newFlashcard.front}
              onChange={(e) => setNewFlashcard({ ...newFlashcard, front: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="back">
              Back
            </label>
            <input
              type="text"
              name="back"
              id="back"
              value={newFlashcard.back}
              onChange={(e) => setNewFlashcard({ ...newFlashcard, back: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Flashcard Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        className="text-white"
      >
        <h2 className="text-2xl mb-4">Edit Flashcard</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleEditSubmit}>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="front">
              Front
            </label>
            <input
              type="text"
              name="front"
              id="front"
              value={newFlashcard.front}
              onChange={(e) => setNewFlashcard({ ...newFlashcard, front: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="back">
              Back
            </label>
            <input
              type="text"
              name="back"
              id="back"
              value={newFlashcard.back}
              onChange={(e) => setNewFlashcard({ ...newFlashcard, back: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        className="text-white"
      >
        <h2 className="text-2xl mb-4">Confirm Delete</h2>
        <p className="mb-4">Are you sure you want to delete this flashcard?</p>
        <div className="flex space-x-4">
          <button
            onClick={handleDeleteConfirm}
            className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default FlashcardList;