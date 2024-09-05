import { useEffect, useState } from "react";
import { useNotesContext } from "../hooks/useNotesContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useSnackbar } from 'notistack';

// components
import AddNoteButton from "../components/AddNoteButton";
import NoteModal from "../components/NoteModal";
import SearchBar from "../components/SearchBar";
import NotesList from "../components/NotesList";

const Home = () => {
  const { notes, dispatch } = useNotesContext();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [showModal, setShowModal] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [filteredNotes, setFilteredNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) return;

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/notes`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const json = await response.json();

        if (response.ok) {
          dispatch({ type: "SET_NOTES", payload: json });
          setFilteredNotes(json); // Initialize filtered notes
        } else {
          enqueueSnackbar('Failed to fetch notes', { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar('An error occurred while fetching notes', { variant: 'error' });
      }
    };

    fetchNotes();
  }, [dispatch, user, enqueueSnackbar]);

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
    if (!query) {
      setFilteredNotes(notes);
    } else {
      const lowercasedQuery = query.toLowerCase();
      const filtered = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(lowercasedQuery) ||
          note.content.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredNotes(filtered);
    }
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

export default Home;