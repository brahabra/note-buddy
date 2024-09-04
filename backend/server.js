require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const noteRoutes = require('./routes/notes');
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message'); // Import the message routes
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const { handleSocketConnection } = require('./controllers/socketController'); // Import the socket controller

// express app
const app = express();

// create HTTP server
const server = http.createServer(app);

// initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Update with your frontend URL if different
    methods: ['GET', 'POST']
  }
});

// middleware
app.use(express.json());
app.use(cors()); // Use CORS middleware

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Serve the uploads directory as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
app.use('/api/notes', noteRoutes);
app.use('/api/user', userRoutes);
app.use('/api/messages', messageRoutes);

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    server.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// handle Socket.io connections
handleSocketConnection(io);