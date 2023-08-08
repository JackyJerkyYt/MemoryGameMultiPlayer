const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const routing = require("./routes/routing");
require("dotenv").config();

const CONNECTION = process.env.MONGO_URI;

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(cors());

mongoose
  .connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("database connected");
  });

app.use("", routing);

const server = app.listen(3003, () => {
  console.log("Server runs perfectly");
});

const io = require("socket.io")(server, { cors: { origin: "*" } });
io.on("connection", (socket) => {
  console.log(socket.id, "connected to the server");
  socket.on("send-message", (message, room) => {
    if (room != "") {
      console.log("This is the room:", room, message);
      socket.to(room).emit("receive-message", message);
    }
  });

  socket.on("start_game", (hostName, room) => {
    console.log("Host started the game")
    socket.to(room).emit('host_started', hostName);
  })

  socket.on("join_room", (room, name) => {
    console.log(name, "joined this room:", room);
    socket.join(room);
    socket.to(room).emit('user_joined', name);
  });

  //game start
  //the host would generate the answer grid
  socket.on("host_answer_grid", (room, answerGrid, level) => {
    console.log("Host generated the answer grid")
    socket.to(room).emit('receive_answer_grid', answerGrid, level);
  });

  socket.on("finished", (room, message) => {
    console.log("One person has finished")
    socket.to(room).emit('receive_finished', message);
  });

  //real time, so that you can know  how many  tiles yoru oppoonent  has hit
  socket.on("tiles", (room, tiles) => {
    socket.to(room).emit('receive_tiles', tiles);
  })

  socket.on("totalScores", (room, scores) => {
    socket.to(room).emit('receive_totalScores', scores);
  })

  socket.on("lost", (room, bool) => {
    console.log("someone has lost")
    socket.to(room).emit('someone_lost', bool);
  })
});

