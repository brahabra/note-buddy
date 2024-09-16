import { useNotesContext } from './useNotesContext';
import { useAuthContext } from '../auth/useAuthContext';
import { useSnackbar } from 'notistack';
import PinIcon from '@mui/icons-material/PushPin';
import { updateNote } from '../../api/notes';

const usePinNote = () => {
  const { dispatch } = useNotesContext();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const pinNote = async (note) => {
    if (!user) {
      enqueueSnackbar('You must be logged in to pin a note', { variant: 'error' });
      return;
    }

    try {
      const json = await updateNote(user.token, note._id, { pinned: !note.pinned });
      dispatch({ type: 'UPDATE_NOTE', payload: json });
      enqueueSnackbar(`Note ${note.pinned ? 'unpinned' : 'pinned'} successfully`, { 
        variant: 'success',
        icon: <PinIcon />
      });
    } catch (error) {
      enqueueSnackbar('Failed to update note', { variant: 'error' });
    }
  };

  return pinNote;
};

export default usePinNote;