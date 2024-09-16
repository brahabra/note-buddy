const API_URL = process.env.REACT_APP_BACKEND_URL;

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/api/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response;
};

export const signupUser = async (email, username, password) => {
  const response = await fetch(`${API_URL}/api/user/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password }),
  });
  return response;
};