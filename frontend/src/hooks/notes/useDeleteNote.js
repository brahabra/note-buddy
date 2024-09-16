import { useNotesContext } from './useNotesContext';
import { useAuthContext } from '../auth/useAuthContext';
import { useSnackbar } from 'notistack';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteNote } from '../../api/notes';

const useDeleteNote = () => {
  const { dispatch } = useNotesContext();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const removeNote = async (noteId) => {
    if (!user) {
      enqueueSnackbar('You must be logged in to delete a note', { variant: 'error' });
      return;
    }

    try {
      const json = await deleteNote(user.token, noteId);
      dispatch({ type: 'DELETE_NOTE', payload: json });
      enqueueSnackbar('Note deleted successfully', { 
        variant: 'success',
        icon: <DeleteIcon />
      });
    } catch (error) {
      enqueueSnackbar('Failed to delete note', { variant: 'error' });
    }
  };

  return removeNote;
};

export default useDeleteNote;