const express = require('express')
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 8000;

const app = express()
const server = http.createServer(app);

const io = socketIo(server);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

io.on("connection", (socket) => {
  socket.on('message', (msg) => {
    socket.broadcast.emit("FromAPI", msg);
  }) 
  console.log("New client connected");
  // Emitting a new message. Will be consumed by the client
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));