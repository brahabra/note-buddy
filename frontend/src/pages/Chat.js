import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuthContext } from '../hooks/useAuthContext';
import { useMessagesContext } from '../hooks/useMessagesContext';
import { useSnackbar } from 'notistack';
import { formatDistanceToNow } from 'date-fns';

const socket = io('http://localhost:4000');

const Chat = () => {
  const { user } = useAuthContext();
  const { messages, dispatch } = useMessagesContext();
  const { enqueueSnackbar } = useSnackbar();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return;

      try {
        const response = await fetch('/api/messages', {
          headers: { 'Authorization': `Bearer ${user.token}` },
        });
        const data = await response.json();

        if (response.ok) {
          dispatch({ type: 'SET_MESSAGES', payload: data });
        } else {
          enqueueSnackbar('Failed to fetch messages', { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar('An error occurred while fetching messages', { variant: 'error' });
      }
    };

    fetchMessages();

    socket.on('loadMessages', (loadedMessages) => {
      dispatch({ type: 'SET_MESSAGES', payload: loadedMessages });
    });

    socket.on('receiveMessage', (message) => {
      dispatch({ type: 'CREATE_MESSAGE', payload: message });
    });

    return () => {
      socket.off('loadMessages');
      socket.off('receiveMessage');
    };
  }, [dispatch, user, enqueueSnackbar]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!user) {
      enqueueSnackbar('You must be logged in', { variant: 'error' });
      return;
    }

    if (!message) {
      enqueueSnackbar('Message cannot be empty', { variant: 'error' });
      return;
    }

    const messageData = { content: message, username: user.username };

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify(messageData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      const json = await response.json();

      if (!response.ok) {
        enqueueSnackbar(json.error, { variant: 'error' });
      } else {
        setMessage('');
        socket.emit('sendMessage', json);
        enqueueSnackbar('Message sent successfully!', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar('An error occurred while sending the message', { variant: 'error' });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto flex flex-col-reverse h-[calc(100vh-12rem)]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div ref={messagesEndRef} />
        {messages.map((msg, index) => (
          <div key={index} className={`flex flex-col justify-center ${user.username === msg.username ? 'items-end' : 'items-start'}`}>
            <div className={`my-6 rounded-2xl ${user.username === msg.username ? 'bg-emerald-500' : 'bg-white'} px-5 pt-9 pb-4 shadow-sm cursor-pointer`}>
              <h4 className={`mb-2 text-xl ${user.username === msg.username ? 'text-white' : 'text-[#1aac83]'}`}>{msg.username}</h4>
              <p>{msg.content}</p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 flex items-center p-4">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 p-2 mr-2 rounded-2xl"
        />
      </div>
    </div>
  );
};

export default Chat;