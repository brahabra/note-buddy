import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuthContext } from '../hooks/useAuthContext';
import { useMessagesContext } from '../hooks/useMessagesContext';
import { useSnackbar } from 'notistack';
import { formatDistanceToNow } from 'date-fns';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const socket = io('http://localhost:4000');

const Chat = () => {
  const { user } = useAuthContext();
  const { messages, dispatch } = useMessagesContext();
  const { enqueueSnackbar } = useSnackbar();
  const [message, setMessage] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

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

    socket.on('receiveMessage', (message) => {
      dispatch({ type: 'CREATE_MESSAGE', payload: message });
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [dispatch, user, enqueueSnackbar]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop } = chatContainerRef.current;
        if (scrollTop < 0) {
          setShowScrollButton(true);
        } else {
          setShowScrollButton(false);
        }
      }
    };

    if (chatContainerRef.current) {
      chatContainerRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const sendMessage = async () => {
    if (!user) {
      enqueueSnackbar('You must be logged in', { variant: 'error' });
      return;
    }

    if (!message) {
      enqueueSnackbar('Message cannot be empty', { variant: 'error' });
      return;
    }

    const socketMessageData = {
      content: message,
      user: {
        _id: user._id,
        username: user.username,
        profilePicture: user.profilePicture
      }
    };

    try {
      socket.emit('sendMessage', socketMessageData);
      setMessage('');
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
    } catch (error) {
      console.log('Error sending message:', error); // Debugging statement
      enqueueSnackbar('An error occurred while sending the message', { variant: 'error' });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={chatContainerRef} className="overflow-y-auto flex flex-col-reverse h-[calc(100vh-12rem)]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div ref={messagesEndRef} />
        {messages.map((msg, index) => {
          const isOwnMessage = user._id === msg.user?._id;
          const wrapMessages = !isOwnMessage && index > 0 && msg.user && messages[index - 1].user && messages[index - 1].user._id === msg.user._id;
          const showProfileInfo = index === 0 || !wrapMessages;
          const showUsername = !wrapMessages;

          return (
            <div key={index} className={`flex items-start ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              {!isOwnMessage && (
                <div className={`flex items-center justify-center ${wrapMessages ? "h-28" : ""}`}>
                  {showProfileInfo && (
                    msg.user?.profilePicture ? (
                      <img src={`/${msg.user.profilePicture}`} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <AccountCircleIcon />
                      </div>
                    )
                  )}
                </div>
              )}
              <div className="flex flex-col ml-3">
                {!isOwnMessage && showUsername && (
                  <h4 className="ml-3.5 text-sm text-gray-300">{msg.user?.username}</h4>
                )}
                <div className={`my-1 rounded-2xl ${isOwnMessage ? 'bg-emerald-500 text-white' : 'bg-white text-[#1aac83]'} px-5 pt-3 pb-2 shadow-sm cursor-pointer`}>
                  <p>{msg.content}</p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed mb-6 bottom-20 left-1/2 transform -translate-x-1/2 bg-white text-blue-500 p-2 rounded-full shadow-lg"
        >
          <ArrowDownwardIcon />
        </button>
      )}
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