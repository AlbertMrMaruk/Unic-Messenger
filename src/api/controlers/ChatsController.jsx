function clickChat(setNewMessage, session) {
  try {
    let socket = new WebSocket(`wss://unicmessenger.ru?session=${session}`);
    socket.addEventListener("open", () => {
      console.log("Соединение установлено");
    });

    socket.addEventListener("close", (event) => {
      if (event.wasClean) {
        console.log("Соединение закрыто чисто");
      } else {
        console.log("Обрыв соединения");
      }
      console.log(`Код: ${event.code} | Причина: ${event.reason}`);
      if (+event.code !== 3333) {
        clickChat(setNewMessage, session);
      }
    });

    socket.addEventListener("message", (event) => {
      console.log(JSON.parse(event.data));
      setNewMessage(JSON.parse(event.data));
    });

    socket.addEventListener("error", (event) => {
      console.log("Ошибка", event.message);
    });
    return socket;
  } catch (err) {
    console.log(err);
  }
}

export default clickChat;
