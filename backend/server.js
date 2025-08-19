const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express(); // create a new Express application
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {} // enable connection state recovery
}); // create a new Socket.IO server

/*
  '/' the URL path
  .get HTTTP GET method (like asking for a page)
*/
// req is the incoming request, res is the response we send back (what the server sends back)
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '..', 'frontend', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chat message', (msg) => {
    // send data to all connected clients
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // send any number of arguments to the client
  socket.emit('hello', 'SirShinu', 'the', 'great'); // send data to the connected client
  socket.on('hello', (arg1, arg2, arg3) => {
    console.log('Hello, ' + arg1 + ' ' + arg2 + ' ' + arg3);
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});