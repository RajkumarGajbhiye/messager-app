const  mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const config = require("./config.js");
const colors = require( "colors");
const userRoute = require( "./routes/userRoute.js");
const globalErrorHandling = require( "./controllers/errorController.js");
const chatRoute = require( "./routes/chatRoute.js");
const messageRoute = require("./routes/messageRoute.js")
const bodyParser = require('body-parser')
//connect mongoose

const DB_Connection_String = process.env.DATABASE_CONNECTION_STRING.replace(
  "<mongodb_user>",
  process.env.DATABASE_USERNAME
).replace("<mongodb_password>", process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB_Connection_String, {
    useNewUrlParser: true,
  })
  .then((con) => console.log("Database connection established...".blue.bold));

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(globalErrorHandling);

app.use("/api/user", userRoute);
app.use("/api", chatRoute);
app.use("/api/message",messageRoute)

const port = process.env.PORT || 5000;

const server = app.listen(port, () =>
  console.log(`listening to port ${port}.....`.rainbow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin:"*",
  },
});

//this event is fired upon new connection
io.on("connection",(socket)=>{
console.log('connected to socket.io')

socket.on("setup", (userData) => {
  socket.join(userData._id);
  socket.emit("connected"); // socket.emit to send a message to all the connected clients.
});

socket.on("join chat",(room)=>{
  socket.join(room);
  console.log("User Joined Room:" + room)
});

socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));


socket.on("new message", (newMessageRecieved) => {
  var chat = newMessageRecieved.chat;

  if (!chat.users) return console.log("chat.users not defined");

  chat.users.forEach((user) => {
    if (user._id == newMessageRecieved.sender._id) return;

    socket.in(user._id).emit("message recieved", newMessageRecieved);
  });
});

socket.off("setup", () => {
  console.log("USER DISCONNECTED");
  socket.leave(userData._id);
});
})

