const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const port = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);

const io = socketIo(server);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/public', express.static('public'))

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("new room", (room) => {
    console.log("a new room is created", room);
    socket.room = room;
    socket.join(room);
    io.emit("rooms", getRooms("new room"));
  });

  socket.on("join room", function (room) {
    console.log(`A new user joined room ${room}`);
    socket.room = room;
    socket.join(room);
    io.emit("rooms", getRooms("joined room"));
  });
  socket.on("chat message", function (data) {
    io.in(data.room).emit("chat message", `${data.name}: ${data.msg}`);
  });
  socket.on("set username", function (name) {
    console.log(`username set to ${name}(${socket.id})`);
    socket.username = name;
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

function getRooms(msg) {
  const nsp = io.of("/");
  const rooms = nsp.adapter.rooms;
  /*Returns data in this form
  {
    'roomid1': { 'socketid1', socketid2', ...},
    ...
  }
  */
  //console.log('getRooms rooms>>' + util.inspect(rooms));

  const list = {};

  for (let roomId in rooms) {
    const room = rooms[roomId];
    if (room === undefined) continue;
    const sockets = [];
    let roomName = "";
    //console.log('getRooms room>>' + util.inspect(room));
    for (let socketId in room.sockets) {
      const socket = nsp.connected[socketId];
      if (socket === undefined || socket.username === undefined || socket.room === undefined)
        continue;
      //console.log(`getRooms socket(${socketId})>>${socket.username}:${socket.room}`);
      sockets.push(socket.username);
      if (roomName == "") roomName = socket.room;
    }
    if (roomName != "") list[roomName] = sockets;
  }

  console.log(`getRooms: ${msg} >>`);

  return list;
}
