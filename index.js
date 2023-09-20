const http = require("http");
const Websocket = require("ws");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// const Pusher = require("pusher");

// let pusher = new Pusher({
//   appId: "1674014",
//   key: "f6bfd10812a202b8d89b",
//   secret: "5fb358742397778f2b73",
//   cluster: "eu",
// });

console.log("Hello server");
app.use(express.static(__dirname + "/build/"));
app.use(bodyParser.json());

app.get("/*", (_, res) => {
  res.sendFile(`${__dirname}/build/index.html`, null, (err) => {
    if (err) console.error(err);
  });
});
// pusher.trigger("unic-messenger", "message", { message: "hello world" });

const server = http.createServer(app);
const wss = new Websocket.Server({ server });
wss.on("connection", function (ws) {
  // Клиент подключен
  ws.on("message", function (message) {
    ws.send(message.toString());
    console.log("server receive message: ", message.toString());
  });
  app.post("/post", function (req, response) {
    // console.log(req.body, "mmmm");
    // pusher = new Pusher({
    //   appId: "1674014",
    //   key: "f6bfd10812a202b8d89b",
    //   secret: "5fb358742397778f2b73",
    //   cluster: "eu",
    // });
    // pusher.trigger("unic-messenger", "message", { message: "hello world" });
    ws.send(JSON.stringify(req.body));
    response.sendStatus(200);
  });

  ws.on("close", function (message) {
    console.log("连接断开", message);
  });
});

server.listen(3002, function () {
  console.log(`Приложение запущено на порту  ${3002}!`);
});

module.exports = server;
