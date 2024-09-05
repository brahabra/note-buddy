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

mongoose.set('debug', true);

// express app
const app = express();

// create HTTP server
const server = http.createServer(app);

// CORS setup for both Express and Socket.io
const corsOptions = {
  origin: process.env.FRONTEND_URL, // Ensure this is set correctly
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
};
app.use(cors(corsOptions));

const io = socketIo(server, {
  cors: corsOptions
});

// middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use('/api/notes', noteRoutes);
app.use('/api/user', userRoutes);
app.use('/api/messages', messageRoutes);

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    server.listen(process.env.PORT || 4000, () => {
      console.log('connected to db & listening on port', process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// handle Socket.io connections
handleSocketConnection(io);