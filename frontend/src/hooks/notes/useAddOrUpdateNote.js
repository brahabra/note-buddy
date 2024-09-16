import { useNotesContext } from './useNotesContext';
import { useAuthContext } from '../auth/useAuthContext';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { addNote, updateNote, fetchNotes } from '../../api/notes';

const useAddOrUpdateNote = () => {
  const { dispatch } = useNotesContext();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState(null);

  const addOrUpdateNote = async (note, title, content, onClose) => {
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

    try {
      const json = note
        ? await updateNote(user.token, note._id, noteData)
        : await addNote(user.token, noteData);

      dispatch({ type: note ? 'UPDATE_NOTE' : 'CREATE_NOTE', payload: json });

      const notes = await fetchNotes(user.token);
      dispatch({ type: 'SET_NOTES', payload: notes });

      onClose();
      enqueueSnackbar(note ? 'Note updated successfully!' : 'Note added successfully!', { variant: 'success' });
    } catch (error) {
      setError(error.message);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  return { addOrUpdateNote, error };
};

export default useAddOrUpdateNote;