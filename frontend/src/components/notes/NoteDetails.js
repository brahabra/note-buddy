import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import PinIcon from '@mui/icons-material/PushPin';
import DeleteIcon from '@mui/icons-material/Delete';
import useDeleteNote from '../../hooks/notes/useDeleteNote';
import usePinNote from '../../hooks/notes/usePinNote';

const NoteDetails = ({ note, onOpenModal }) => {
  const deleteNote = useDeleteNote();
  const pinNote = usePinNote();

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent the modal from opening
    deleteNote(note._id);
  };

  const handlePin = (e) => {
    e.stopPropagation(); // Prevent the modal from opening
    pinNote(note);
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
          <h4 className="mb-2 text-xl text-[#1aac83] break-words overflow-wrap">{truncate(note.title, 15)}</h4>
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