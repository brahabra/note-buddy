import { useEffect, useState } from "react";
import { useNotesContext } from "../hooks/notes/useNotesContext";
import useFetchNotes from "../hooks/notes/useFetchNotes";
import searchNotes from "../utils/searchNotes";
import { useSnackbar } from 'notistack';

import AddNoteButton from "../components/notes/AddNoteButton";
import NoteModal from "../components/notes/NoteModal";
import SearchBar from "../components/notes/SearchBar";
import NotesList from "../components/notes/NotesList";

const Notes = () => {
  const { notes } = useNotesContext();
  const { enqueueSnackbar } = useSnackbar();
  const [showModal, setShowModal] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [filteredNotes, setFilteredNotes] = useState([]);

  useFetchNotes();

  useEffect(() => {
    if (notes) {
      setFilteredNotes(notes);
    }
  }, [notes]);

  const handleOpenModal = (note) => {
    setCurrentNote(note);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentNote(null);
  };

  const handleSearch = (query) => {
    setFilteredNotes(searchNotes(notes, query));
  };

  const handleNoteAction = (message) => {
    enqueueSnackbar(message, { variant: 'success' });
  };

  return (
    <div>
      <div className="flex justify-center">
        <p className="note-hover-effect flex justify-center mt-8 mb-14 text-5xl text-white">
          Note Buddy
        </p>
      </div>
      <SearchBar onSearch={handleSearch} />
      <AddNoteButton onClick={() => setShowModal(true)} />
      {notes && notes.length > 0 ? (
        filteredNotes && filteredNotes.length > 0 ? (
          <NotesList filteredNotes={filteredNotes} handleOpenModal={handleOpenModal} />
        ) : (
          <p className="flex justify-center mt-28 text-2xl text-white">
            No notes found!
          </p>
        )
      ) : (
        <p className="flex justify-center mt-28 text-2xl text-white">
          No notes added yet!
        </p>
      )}
      {showModal && <NoteModal onClose={handleCloseModal} note={currentNote} onAction={handleNoteAction} />}
    </div>
  );
};

export default Notes;