function clickChat(setNewMessage) {
  try {
    let socket = new WebSocket(`ws://89.111.131.15/`);
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

      clickChat(setNewMessage);
    });

    socket.addEventListener("message", (event) => {
      setNewMessage(JSON.parse(event.data));
    });

    socket.addEventListener("error", (event) => {
      console.log("Ошибка", event.message);
    });
  } catch (err) {
    console.log(err);
  }
}

export default clickChat;
