function clickChat(messages, setMessages) {
  try {
    const socket = new WebSocket(`ws://89.111.131.15/`);
    socket.addEventListener("open", () => {
      console.log("Соединение установлено");
    });

    socket.addEventListener("close", (event) => {
      if (event.wasClean) {
        console.log("Соединение закрыто чисто");
      } else {
        console.log("Обрыв соединения");
      }
      setTimeout(function () {
        clickChat();
      }, 1000);
      console.log(`Код: ${event.code} | Причина: ${event.reason}`);
    });

    socket.addEventListener("message", (event) => {
      //   console.log("Получены данные", event.data);
      setMessages([...messages, JSON.parse(event.data)]);
      //   console.log(JSON.parse(event.data));
    });

    socket.addEventListener("error", (event) => {
      console.log("Ошибка", event.message);
    });
  } catch (err) {
    console.log(err);
  }
}

export default clickChat;
