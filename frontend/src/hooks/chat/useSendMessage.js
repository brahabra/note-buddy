import { useState } from 'react';
import { useSnackbar } from 'notistack';
import socket from '../../utils/socket';
import { useAuthContext } from '../auth/useAuthContext';

const useSendMessage = () => {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    if (!user) {
      enqueueSnackbar('You must be logged in', { variant: 'error' });
      return;
    }

    if (!message) {
      return;
    }

    const socketMessageData = {
      content: message,
      user: {
        _id: user._id,
        username: user.username
      }
    };

    try {
      socket.emit('sendMessage', socketMessageData);
      setMessage('');
    } catch (error) {
      console.log('Error sending message:', error);
      enqueueSnackbar('An error occurred while sending the message', { variant: 'error' });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return { message, setMessage, sendMessage, handleKeyDown };
};

export default useSendMessage;