  
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const { timeLog } = require("console");
const port = 5000;
const app = express();


app.get('/', (req, res) => 
    res.send("Hello World!")
)

const server = http.createServer(app);


const io = socketIO(server, {  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }});

 
const room = 'room';
const user = 'user';

io.on("connection", (socket) => {
  // join : 채팅 참여 이벤트
  socket.on("join", ({ roomName: room, userName: user }) => {
    socket.join(room);
    io.to(room).emit("onConnect", `${user} 님이 입장했습니다.`);
    // send : 클라이언트가 메시지 보내는 이벤트
    // item: {name: String, msg: String, timeStamp: String}



    socket.on("onSend", (messageItem) => {
      io.to(room).emit("onReceive", messageItem);
    });

    socket.on("disconnect", () => {
      socket.leave(room);
      io.to(room).emit("onDisconnect", `${user} 님이 퇴장하셨습니다.`);
    });
  });
});

 
server.listen(port, function() {
  console.log(`Server is running on port: ${port}`);
});
