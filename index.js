const http = require("http");
const Websocket = require("ws");
const express = require("express");
const app = express();
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
const funcWs = function (ws) {
  // Клиент подключен
  console.log("Client ready");
  // NOTE: only for demonstration, will cause collisions.  Use a UUID or some other identifier that's actually unique
  // const this_stream_id = Array.from(connected_clients.values()).length;

  // connected_clients.set(this_stream_id, ws);
  // ws.is_alive = true;
  // ws.on("pong", () => {
  //   ws.is_alive = true;
  // });

  ws.on("message", function (message) {
    ws.send(message.toString());
    console.log("server receive message: ", message.toString());
  });

  ws.on("close", function (message) {
    console.log("连接断开", message);
    // connected_clients.delete(this_stream_id);
  });
};

wss.on("connection", funcWs);
app.post("/post", function (req, response) {
  console.log("Hmmm", wss);
  wss.clients.forEach((ws) => {
    console.log("dhhd");
    ws.send(JSON.stringify(req.body));
  });

  response.sendStatus(200);
});

server.listen(3002, function () {
  console.log(`Приложение запущено на порту  ${3002}!`);
});

setInterval(function ping() {
  Array.from(connected_clients.values()).forEach(function each(client_stream) {
    if (!client_stream.is_alive) {
      client_stream.terminate();
      return;
    }
    client_stream.is_alive = false;
    client_stream.ping();
  });
}, 1000);
module.exports = server;
