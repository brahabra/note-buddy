import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import useFetchMessages from '../hooks/chat/useFetchMessages';
import useScrollHandler from '../hooks/chat/useScrollHandler';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';

const Chat = () => {
  const { showScrollButton, chatContainerRef, messagesEndRef, scrollToBottom, setIsNewMessage } = useScrollHandler();

  useFetchMessages(setIsNewMessage);

  return (
    <div className="flex flex-col h-full">
      <div ref={chatContainerRef} className="overflow-y-auto flex flex-col-reverse h-[calc(100vh-12rem)]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div ref={messagesEndRef} />
        <MessageList />
      </div>
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed mb-6 bottom-20 left-1/2 transform -translate-x-1/2 bg-white text-blue-500 p-2 rounded-full shadow-lg"
        >
          <ArrowDownwardIcon />
        </button>
      )}
      <MessageInput />
    </div>
  );
};

export default Chat;