const Message = require('../models/messageModel');
const { createMessageHelper } = require('./messageController');

const handleSocketConnection = (io) => {
  io.on('connection', async (socket) => {
    console.log('New client connected');

    // Send existing messages to the client
    const messages = await Message.find().sort({ createdAt: -1 }).limit(50).populate('user', 'username').exec();
    socket.emit('loadMessages', messages.reverse());

    socket.on('sendMessage', async ({ content, user }) => {
      try {
        const message = await createMessageHelper({ content, user });
        io.emit('receiveMessage', message);
      } catch (error) {
        console.log('Error creating message:', error); // Debugging statement
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

module.exports = { handleSocketConnection };