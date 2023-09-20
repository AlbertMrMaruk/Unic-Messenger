const http = require("http");
const Websocket = require("ws");
const express = require("express");
const app = express();
console.log("Hello server");
app.use(express.static(__dirname + "/build/"));
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
  ws.send("msg from server!");
  app.post("/post", function (req, response) {
    console.log("mmmm");
    ws.send("dcjndjc");
    response.sendStatus(200);
  });
  ws.on("close", function (message) {
    console.log("连接断开", message);
  });
});

// server.listen(3002, function () {
//   console.log(`Приложение запущено на порту  ${3002}!`);
// });

// const express = require("express");

// const app = express();

// app.get("/*", (_, res) => {
//   res.sendFile(`${__dirname}/build/index.html`, null, (err) => {
//     if (err) console.error(err);
//   });
// });

// const port = process.env.PORT || 3000;

// app.listen(port, () =>
//   console.log(`Server running on ${port}, http://localhost:${port}`)
// );

module.exports = server;
