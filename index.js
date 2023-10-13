const http = require("http");
const Websocket = require("ws");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const url = require("url");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

console.log("Hello server");

require(__dirname + "/models/User");

// mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://89.111.131.15:27017/users`, {
  authSource: "admin",
  useNewUrlParser: true,
  user: "admin",
  pass: "ALBert2002",
  serverSelectionTimeoutMS: 5000,
});

const db = mongoose.connection;
// console.log(db);
db.on("error", () => {
  console.log("> error occurred from the database");
});
db.once("open", () => {
  console.log("> successfully opened the database");
});
require(__dirname + "/routes/userRoutes")(app);
app.use(cookieParser());
app.use(express.static(__dirname + "/build/"));
app.use(bodyParser.json({ limit: "2000mb", extended: true }));

app.get("/*", (_, res) => {
  res.sendFile(`${__dirname}/build/index.html`, null, (err) => {
    if (err) console.error(err);
  });
});

const server = http.createServer(app);
const wss = new Websocket.Server({ server });
// const connected_clients = new Map();
const funcWs = function (ws, req) {
  // Клиент подключен
  console.log("Client ready");
  const parameters = url.parse(req.url, true);

  ws.session = parameters.query.session;
  console.log(ws.session);
  ws.on("message", function (message) {
    ws.send(message.toString());
    console.log("server receive message: ", message.toString());
  });

  ws.on("close", function (message) {
    console.log("连接断开", message);
  });
};

wss.on("connection", funcWs);
app.post("/post/:session", function (req, response) {
  const { session } = req.params;
  console.log("Hmmm", session);
  wss.clients.forEach((ws) => {
    if (ws.session === session) {
      console.log("dhhd", ws.session);
      ws.send(JSON.stringify(req.body));
    } else {
      console.log("cannot be found");
    }
  });

  response.sendStatus(200);
});

server.listen(3002, function () {
  console.log(`Приложение запущено на порту  ${3002}!`);
});

// setInterval(function ping() {
//   Array.from(connected_clients.values()).forEach(function each(client_stream) {
//     if (!client_stream.is_alive) {
//       client_stream.terminate();
//       return;
//     }
//     client_stream.is_alive = false;
//     client_stream.ping();
//   });
// }, 1000);
module.exports = server;
