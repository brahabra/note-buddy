import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { NotesContextProvider } from './context/NoteContext';
import { AuthContextProvider } from './context/AuthContext';
import { MessagesContextProvider } from './context/MessageContext'; // Import the MessagesContextProvider
import { SnackbarProvider } from 'notistack';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={3}>
      <AuthContextProvider>
        <NotesContextProvider>
          <MessagesContextProvider> {/* Wrap App with MessagesContextProvider */}
            <App />
          </MessagesContextProvider>
        </NotesContextProvider>
      </AuthContextProvider>
    </SnackbarProvider>
  </React.StrictMode>
);