import { useNotesContext } from '../hooks/useNotesContext';
import NoteDetails from './NoteDetails';

const NotesList = ({ filteredNotes, handleOpenModal }) => {
  const { notes } = useNotesContext();

  const sortedNotes = filteredNotes.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mt-12 mb-12 mx-10 xl:gap-x-0 gap-x-16 gap-y-10">
      {sortedNotes.map(note => (
        <NoteDetails key={note._id} note={note} onOpenModal={handleOpenModal} />
      ))}
    </div>
  );
};

export default NotesList;