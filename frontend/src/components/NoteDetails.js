import { useState } from 'react';
import { useNotesContext } from '../hooks/useNotesContext';
import { useAuthContext } from '../hooks/useAuthContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import PinIcon from '@mui/icons-material/PushPin';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const NoteDetails = ({ note, onOpenModal }) => {
  const { dispatch } = useNotesContext();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent the modal from opening
    if (!user) {
      enqueueSnackbar('You must be logged in to delete a note', { variant: 'error' });
      return;
    }

    const response = await fetch('/api/notes/' + note._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_NOTE', payload: json });
      enqueueSnackbar('Note deleted successfully', { 
        variant: 'success',
        icon: <DeleteIcon />
      });
    } else {
      enqueueSnackbar('Failed to delete note', { variant: 'error' });
    }
  };

  const handlePin = async (e) => {
    e.stopPropagation(); // Prevent the modal from opening
    if (!user) {
      enqueueSnackbar('You must be logged in to pin a note', { variant: 'error' });
      return;
    }

    const response = await fetch('/api/notes/' + note._id, {
      method: 'PATCH',
      body: JSON.stringify({ pinned: !note.pinned }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'UPDATE_NOTE', payload: json });
      enqueueSnackbar(`Note ${note.pinned ? 'unpinned' : 'pinned'} successfully`, { 
        variant: 'success',
        icon: <PinIcon />
      });
    } else {
      enqueueSnackbar('Failed to update note', { variant: 'error' });
    }
  };

  const truncate = (str, maxLength) => {
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
  };

  const formatDate = (createdAt, updatedAt) => {
    if (createdAt === updatedAt) {
      return `created ${formatDistanceToNow(new Date(createdAt), { addSuffix: true })}`;
    } else {
      return `updated ${formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}`;
    }
  };

  return (
    <div className='flex justify-center'>
      <div className='note-hover-effect w-40 h-60 bg-white px-5 pt-9 pb-4 shadow-sm cursor-pointer flex flex-col justify-between relative group' onClick={() => onOpenModal(note)}>
        <div className={`absolute top-2 left-2 ${note.pinned ? '' : 'hidden group-hover:block'}`}>
          <PinIcon
            className={`cursor-pointer ${note.pinned ? 'text-yellow-500 hover:text-gray-500' : 'text-gray-500 hover:text-yellow-500'}`}
            onClick={handlePin}
          />
        </div>
        <div className="absolute top-2 right-2 hidden group-hover:block">
          <DeleteIcon
            className="cursor-pointer text-gray-500 hover:text-red-500"
            onClick={handleDelete}
          />
        </div>
        <div>
          <h4 className="mb-2 text-xl text-[#1aac83]">{truncate(note.title, 20)}</h4>
          <p className="text-sm text-gray-700 break-words overflow-wrap">{truncate(note.content, 60)}</p>
        </div>
        <p className="text-sm text-gray-500">
          {formatDate(note.createdAt, note.updatedAt)}
        </p>
      </div>
    </div>
  );
};

export default NoteDetails;