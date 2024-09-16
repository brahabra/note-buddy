import { useContext } from 'react';
import { MessagesContext } from '../../context/MessageContext';

export const useMessagesContext = () => {
  const context = useContext(MessagesContext);

  if (!context) {
    throw new Error('useMessagesContext must be used within a MessagesContextProvider');
  }

  return context;
};