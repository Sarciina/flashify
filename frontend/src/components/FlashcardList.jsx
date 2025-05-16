// src/components/FlashcardList.jsx
import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import {
  getFlashcards,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard
} from '../utils/api';

const FlashcardList = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({ question: '', answer: '' });
  const [error, setError] = useState(null);
  const [flipped, setFlipped] = useState({});

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const data = await getFlashcards();
      setFlashcards(data);
      setFlipped(data.reduce((m, c) => ({ ...m, [c.id]: false }), {}));
      setError(null);
    } catch {
      setError('Failed to fetch flashcards');
    }
  };

  const openAdd = () => {
    setForm({ question: '', answer: '' });
    setIsAddOpen(true);
  };
  const openEdit = (card, e) => {
    e.stopPropagation();
    setCurrent(card);
    setForm({ question: card.question, answer: card.answer });
    setIsEditOpen(true);
  };
  const openDelete = (card, e) => {
    e.stopPropagation();
    setCurrent(card);
    setIsDeleteOpen(true);
  };

  const submitAdd = async e => {
    e.preventDefault();
    try {
      const created = await createFlashcard(form);
      setFlashcards(f => [...f, created]);
      setFlipped(f => ({ ...f, [created.id]: false }));
      setIsAddOpen(false);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to add');
    }
  };

  const submitEdit = async e => {
    e.preventDefault();
    if (!current?.id) return setError('No card selected');
    try {
      const updatedFromServer = await updateFlashcard(current.id, form);
      const updated = { ...updatedFromServer, id: current.id };
      setFlashcards(f => f.map(c => (c.id === current.id ? updated : c)));
      setFlipped(f => ({ ...f, [current.id]: false }));
      setIsEditOpen(false);
      setCurrent(null);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to update');
    }
  };

  const confirmDelete = async () => {
    if (!current?.id) return setError('No card selected');
    try {
      await deleteFlashcard(current.id);
      setFlashcards(f => f.filter(c => c.id !== current.id));
      setFlipped(f => {
        const copy = { ...f };
        delete copy[current.id];
        return copy;
      });
      setIsDeleteOpen(false);
      setCurrent(null);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to delete');
    }
  };

  const flip = id =>
    setFlipped(f => ({ ...f, [id]: !f[id] }));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl text-white font-serif text-center mb-12">
        F L A S H I F Y
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div
          onClick={openAdd}
          className="bg-white rounded-lg shadow-lg aspect-[5/7] flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <span className="text-mint-green text-6xl">+</span>
        </div>

        {flashcards.map(c => (
          <div
            key={c.id}
            onClick={() => flip(c.id)}
            className={`bg-yellow-100 rounded-lg shadow-lg aspect-[5/7] relative cursor-pointer transition-all duration-300 ${
              flipped[c.id] ? 'bg-yellow-200' : ''
            }`}
          >
            <div className="absolute inset-0 p-6 flex flex-col">
              <div className="flex-grow flex items-center justify-center">
                <h3 className="text-lg text-black font-medium text-center">
                  {flipped[c.id] ? c.answer : c.question}
                </h3>
              </div>
              <div className="mt-auto flex justify-end space-x-2 opacity-0 hover:opacity-100 transition-opacity">
                <button
                  onClick={e => openEdit(c, e)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={e => openDelete(c, e)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onRequestClose={() => setIsAddOpen(false)}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white rounded-xl p-8 max-w-md w-full z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-40"
        contentLabel="Add Flashcard"
      >
        <h2 className="text-2xl mb-4">Add Flashcard</h2>
        <form onSubmit={submitAdd}>
          <label className="block mb-2">Question</label>
          <input
            className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
            value={form.question}
            onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
            required
          />
          <label className="block mb-2">Answer</label>
          <input
            className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
            value={form.answer}
            onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
            required
          />
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 p-2 rounded hover:bg-blue-600"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="flex-1 bg-gray-500 p-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onRequestClose={() => setIsEditOpen(false)}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white rounded-xl p-8 max-w-md w-full z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-40"
        contentLabel="Edit Flashcard"
      >
        <h2 className="text-2xl mb-4">Edit Flashcard</h2>
        <form onSubmit={submitEdit}>
          <label className="block mb-2">Question</label>
          <input
            className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
            value={form.question}
            onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
            required
          />
          <label className="block mb-2">Answer</label>
          <input
            className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
            value={form.answer}
            onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
            required
          />
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 p-2 rounded hover:bg-blue-600"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="flex-1 bg-gray-500 p-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onRequestClose={() => setIsDeleteOpen(false)}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white rounded-xl p-8 max-w-md w-full z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-40"
        contentLabel="Delete Flashcard Modal"
      >
        <h2 className="text-2xl mb-4">Confirm Delete</h2>
        <p className="mb-4">Are you sure you want to delete this?</p>
        <div className="flex space-x-4">
          <button
            onClick={confirmDelete}
            className="flex-1 bg-red-500 p-2 rounded hover:bg-red-600 text-white"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => setIsDeleteOpen(false)}
            className="flex-1 bg-gray-500 p-2 rounded hover:bg-gray-600 text-white"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default FlashcardList;
