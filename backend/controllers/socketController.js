const Message = require('../models/messageModel');
const { createMessageHelper, toggleLikeMessage } = require('./messageController');

const handleSocketConnection = (io) => {
  io.on('connection', async (socket) => {
    console.log('New client connected');

    // Send existing messages to the client
    const messages = await Message.find().sort({ createdAt: -1 }).limit(50).populate('user', 'username').exec();
    socket.emit('loadMessages', messages.reverse());

    socket.on('sendMessage', async ({ content, user }) => {
      try {
        const message = await createMessageHelper({ content, user });
        console.log('New message sent!')
        io.emit('receiveMessage', message);
      } catch (error) {
        console.log('Error creating message:', error);
      }
    });

    socket.on('likeMessage', async ({ messageId, userId }) => {
      try {
        const message = await toggleLikeMessage(messageId, userId);
        console.log('Message disliked/liked!')
        io.emit('updateMessage', message);
      } catch (error) {
        console.log('Error liking message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

module.exports = { handleSocketConnection };