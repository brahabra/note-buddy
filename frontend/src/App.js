import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

// pages & components
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import Chat from './pages/Chat'; // Import the Chat component
import Profile from './pages/Profile'; // Import the Profile component

function App() {
  const { user } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route 
              path="/" 
              element={user ? <Home /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/" />} 
            />
            <Route 
              path="/signup" 
              element={!user ? <Signup /> : <Navigate to="/" />} 
            />
            <Route 
              path="/chat" 
              element={user ? <Chat /> : <Navigate to="/login" />} // Add the chat route
            />
            <Route 
              path="/profile" 
              element={user ? <Profile /> : <Navigate to="/login" />} // Add the profile route
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;