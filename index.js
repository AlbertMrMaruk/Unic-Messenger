const http = require("http");
const Websocket = require("ws");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

console.log("Hello server");
app.use(express.static(__dirname + "/build/"));
app.use(bodyParser.json());

app.get("/*", (_, res) => {
  res.sendFile(`${__dirname}/build/index.html`, null, (err) => {
    if (err) console.error(err);
  });
});

const server = http.createServer(app);
const wss = new Websocket.Server({ server });
wss.on("connection", function (ws) {
  // Клиент подключен
  ws.on("message", function (message) {
    ws.send(message.toString());
    console.log("server receive message: ", message.toString());
  });
  app.post("/post", function (req, response) {
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
