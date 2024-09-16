const API_URL = process.env.REACT_APP_BACKEND_URL;

export const fetchNotes = async (token) => {
  const response = await fetch(`${API_URL}/api/notes`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
};

export const addNote = async (token, noteData) => {
  const response = await fetch(`${API_URL}/api/notes`, {
    method: 'POST',
    body: JSON.stringify(noteData),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};

export const updateNote = async (token, noteId, noteData) => {
  const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
    method: 'PATCH',
    body: JSON.stringify(noteData),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};

export const deleteNote = async (token, noteId) => {
  const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};