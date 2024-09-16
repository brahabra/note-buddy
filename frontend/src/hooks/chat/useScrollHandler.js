import { useEffect, useRef, useState } from 'react';

const useScrollHandler = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isNewMessage, setIsNewMessage] = useState(false);
  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isNewMessage && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setIsNewMessage(false);
    }
  }, [isNewMessage]);

  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop } = chatContainerRef.current;
        setShowScrollButton(scrollTop < 0);
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

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return { showScrollButton, chatContainerRef, messagesEndRef, scrollToBottom, setIsNewMessage };
};

export default useScrollHandler;