const API_URL = process.env.REACT_APP_BACKEND_URL;

export const fetchMessages = async (token) => {
  const response = await fetch(`${API_URL}/api/messages`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
};