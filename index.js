const http = require("http");
// const Websocket = require("ws");
const express = require("express");
const app = express();
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1674014",
  key: "f6bfd10812a202b8d89b",
  secret: "5fb358742397778f2b73",
  cluster: "eu",
});

console.log("Hello server");
app.use(express.static(__dirname + "/build/"));
app.get("/*", (_, res) => {
  res.sendFile(`${__dirname}/build/index.html`, null, (err) => {
    if (err) console.error(err);
  });
});
app.post("/post", function (req, response) {
  console.log(req.body, "mmmm");
  pusher.trigger("unic-messenger", "message", { message: "hello world" });
  // ws.send("dcjndjc");
  response.sendStatus(200);
});
const server = http.createServer(app);
// const wss = new Websocket.Server({ server });
// wss.on("connection", function (ws) {
//   // Клиент подключен
//   ws.on("message", function (message) {
//     ws.send(message.toString());
//     console.log("server receive message: ", message.toString());
//   });
//   ws.send("msg from server!");

//   ws.on("close", function (message) {
//     console.log("连接断开", message);
//   });
// });

// server.listen(3002, function () {
//   console.log(`Приложение запущено на порту  ${3002}!`);
// });

module.exports = server;
