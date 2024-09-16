import { useState, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import useAddOrUpdateNote from '../../hooks/notes/useAddOrUpdateNote';

const NoteModal = ({ onClose, note }) => {
  const modalRef = useRef(null);
  const [title, setTitle] = useState(note ? note.title : '');
  const [content, setContent] = useState(note ? note.content : '');
  const { addOrUpdateNote, error } = useAddOrUpdateNote();

  const handleSubmit = (e) => {
    e.preventDefault();
    addOrUpdateNote(note, title, content, onClose);
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