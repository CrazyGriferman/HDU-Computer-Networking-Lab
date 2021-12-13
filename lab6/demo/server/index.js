const express = require("express");
const app = express();
const server = app.listen(5233, console.log("server start zq 19205133"));
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  socket.on("message-from-client-to-server", (msg) => {
    console.log(msg);
  });
  socket.emit("message-from-server-to-client", "zq 19205133 receive request");
});
