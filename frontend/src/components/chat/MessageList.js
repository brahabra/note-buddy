import { formatDistanceToNow } from 'date-fns';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import { useMessagesContext } from '../../hooks/chat/useMessagesContext';
import socket from '../../utils/socket';

const MessageList = () => {
  const { user } = useAuthContext();
  const { messages } = useMessagesContext();

  const likeMessageOnDoubleTap = async (messageId) => {
    socket.emit('likeMessage', { messageId, userId: user._id });
  };

  const detectDoubleTap = (() => {
    let lastTap = 0;
    return (messageId) => {
      const now = Date.now();
      if (now - lastTap < 300) {
        likeMessageOnDoubleTap(messageId);
      }
      lastTap = now;
    };
  })();

  return (
    <>
      {Array.isArray(messages) && messages.map((msg, index) => {
        const isOwnMessage = user._id === msg.user?._id;
        const showUsername = index === messages.length - 1 || (msg.user && messages[index + 1]?.user && messages[index + 1].user._id !== msg.user._id);

        return (
          <div key={index} className={`flex items-start ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <div className="flex flex-col max-w-full">
              {!isOwnMessage && showUsername && (
                <h4 className="ml-3.5 text-sm text-gray-300">{msg.user?.username}</h4>
              )}
              <div onClick={() => detectDoubleTap(msg._id)} className={`my-1 rounded-2xl ${isOwnMessage ? 'bg-emerald-500 text-white' : 'bg-white text-[#1aac83]'} px-5 pt-3 pb-2 shadow-sm cursor-pointer break-words max-w-full`}>
                <p>{msg.content}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                </p>
                {msg.likes && msg.likes.length > 0 && (
                  <div className='flex justify-end mt-2'>
                    <p className="text-xs text-gray-500">❤️ {msg.likes.length === 1 ? '' : msg.likes.length}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default MessageList;