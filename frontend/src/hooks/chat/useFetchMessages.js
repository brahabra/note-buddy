import { useEffect, useRef } from 'react';
import { useAuthContext } from '../auth/useAuthContext';
import { useMessagesContext } from './useMessagesContext';
import { useSnackbar } from 'notistack';
import socket from '../../utils/socket';
import { fetchMessages } from '../../api/chat';

const useFetchMessages = (setIsNewMessage) => {
  const { user } = useAuthContext();
  const { dispatch } = useMessagesContext();
  const { enqueueSnackbar } = useSnackbar();
  const fetchMessagesCalled = useRef(false);

  useEffect(() => {
    const getMessages = async () => {
      if (!user || fetchMessagesCalled.current) return;

      fetchMessagesCalled.current = true;

      try {
        const data = await fetchMessages(user.token);
        if (data) {
          dispatch({ type: 'SET_MESSAGES', payload: data });
        } else {
          enqueueSnackbar('Failed to fetch messages', { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar('An error occurred while fetching messages', { variant: 'error' });
      }
    };

    getMessages();

    socket.on('receiveMessage', (message) => {
      dispatch({ type: 'CREATE_MESSAGE', payload: message });
      setIsNewMessage(true);
    });

    socket.on('updateMessage', (updatedMessage) => {
      dispatch({ type: 'UPDATE_MESSAGE', payload: updatedMessage });
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('updateMessage');
    };
  }, [dispatch, user, enqueueSnackbar, setIsNewMessage]);
};

export default useFetchMessages;