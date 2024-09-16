const searchNotes = (notes, query) => {
    if (!query) return notes;
  
    const lowercasedQuery = query.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowercasedQuery) ||
        note.content.toLowerCase().includes(lowercasedQuery)
    );
  };
  
  export default searchNotes;