const Message = require('../models/messageModel');

const handleSocketConnection = (io) => {
  io.on('connection', async (socket) => {
    console.log('New client connected');

    // Send existing messages to the client
    const messages = await Message.find().sort({ createdAt: -1 }).limit(50).exec();
    socket.emit('loadMessages', messages.reverse());

    socket.on('sendMessage', async ({ content, user_id, username }) => {
      const message = new Message({ content, user_id, username });
      await message.save();
      io.emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

module.exports = { handleSocketConnection };