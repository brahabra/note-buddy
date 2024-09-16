import { useEffect } from 'react';
import { useNotesContext } from './useNotesContext';
import { useAuthContext } from '../auth/useAuthContext';
import { fetchNotes } from '../../api/notes';

const useFetchNotes = () => {
  const { user } = useAuthContext();
  const { dispatch } = useNotesContext();

  useEffect(() => {
    const getNotes = async () => {
      if (!user) return;

      try {
        const data = await fetchNotes(user.token);
        dispatch({ type: 'SET_NOTES', payload: data });
      } catch (error) {
        console.error('An error occurred while fetching notes', error);
      }
    };

    getNotes();
  }, [user, dispatch]);
};

export default useFetchNotes;