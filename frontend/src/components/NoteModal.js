import { useState, useRef } from "react";
import { useNotesContext } from "../hooks/useNotesContext";
import { useAuthContext } from '../hooks/useAuthContext';
import CloseIcon from "@mui/icons-material/Close";
import { useSnackbar } from 'notistack';

const NoteModal = ({ onClose, note }) => {
  const { dispatch } = useNotesContext();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const modalRef = useRef(null);

  const [title, setTitle] = useState(note ? note.title : '');
  const [content, setContent] = useState(note ? note.content : '');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in');
      enqueueSnackbar('You must be logged in', { variant: 'error' });
      return;
    }

    if (!title && !content) {
      setError('A note cannot be empty');
      enqueueSnackbar('A note cannot be empty', { variant: 'error' });
      return;
    }

    const noteData = { title, content };

    if (note) {
      noteData.pinned = note.pinned; // Preserve the pinned status
    }

    const method = note ? 'PATCH' : 'POST';
    const url = note ? `${process.env.REACT_APP_BACKEND_URL}/api/notes/${note._id}` : `${process.env.REACT_APP_BACKEND_URL}/api/notes`;

    const response = await fetch(url, {
      method,
      body: JSON.stringify(noteData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      enqueueSnackbar(json.error, { variant: 'error' });
    } else {
      setTitle('');
      setContent('');
      setError(null);
      dispatch({ type: note ? 'UPDATE_NOTE' : 'CREATE_NOTE', payload: json });

      const fetchNotes = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/notes`, {
          headers: { 'Authorization': `Bearer ${user.token}` },
        });
        const notes = await response.json();
        if (response.ok) {
          dispatch({ type: 'SET_NOTES', payload: notes });
        }
      };
      onClose();
      await fetchNotes();
      enqueueSnackbar(note ? 'Note updated successfully!' : 'Note added successfully!', { variant: 'success' });
    }
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg max-w-lg text-center"
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from triggering onClose
      >
        <div className="flex justify-end">
          <button onClick={onClose} className="p-3 hover:bg-red-500 hover:text-white">
            <CloseIcon />
          </button>
        </div>
        <div className="pt-10 pb-20 px-20">
          <h3 className="text-lg font-bold mb-4">{note ? 'Edit Note' : 'Add a New Note'}</h3>
          <form onSubmit={handleSubmit}>
            <input 
              type="text"
              placeholder="Title"
              className="w-full p-2 mb-4 border rounded"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
            <textarea
              placeholder="Content"
              className="w-full p-2 pb-40 mb-4 border rounded"
              onChange={(e) => setContent(e.target.value)}
              value={content}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              {note ? 'Update Note' : 'Add Note'}
            </button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;