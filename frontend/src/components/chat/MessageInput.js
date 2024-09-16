import useSendMessage from '../../hooks/chat/useSendMessage';

const MessageInput = () => {
  const { message, setMessage, handleKeyDown } = useSendMessage();

  return (
    <div className='fixed bottom-0 left-0 right-0 p-4 '>
      <div className="flex justify-center items-center max-w-[1400px] mx-auto">
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

export default MessageInput;