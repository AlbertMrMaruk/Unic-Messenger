const http = require("http");
const Websocket = require("ws");
// const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

console.log("Hello server");

require("./models/User");

// mongoose.Promise = global.Promise;
// mongoose.connect(
//   process.env.MONGODB_URI || `mongodb://localhost:27017/node-react-starter`
// );
// require("./routes/userRoutes")(app);
app.use(express.static(__dirname + "/build/"));
app.use(bodyParser.json());

app.get("/*", (_, res) => {
  res.sendFile(`${__dirname}/build/index.html`, null, (err) => {
    if (err) console.error(err);
  });
});

const server = http.createServer(app);
const wss = new Websocket.Server({ server });
const funcWs = function (ws) {
  // Клиент подключен
  console.log("Client ready");
  ws.on("message", function (message) {
    ws.send(message.toString());
    console.log("server receive message: ", message.toString());
  });

  ws.on("close", function (message) {
    console.log("连接断开", message);
  });
};

wss.on("connection", funcWs);
app.post("/post", function (req, response) {
  wss.clients.forEach((ws) => {
    console.log("dhhd");
    ws.send(JSON.stringify(req.body));
  });

  response.sendStatus(200);
});

server.listen(3002, function () {
  console.log(`Приложение запущено на порту  ${3002}!`);
});

module.exports = server;
