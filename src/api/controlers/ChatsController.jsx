function clickChat() {
  try {
    const socket = new WebSocket(`ws://89.111.131.15:3002/`);
    socket.addEventListener("open", () => {
      console.log("Соединение установлено");
      //   socket.send(
      //     JSON.stringify({
      //       content: "0",
      //       type: "get old",
      //     })
      //   );
    });

    socket.addEventListener("close", (event) => {
      if (event.wasClean) {
        console.log("Соединение закрыто чисто");
      } else {
        console.log("Обрыв соединения");
      }

      console.log(`Код: ${event.code} | Причина: ${event.reason}`);
    });

    socket.addEventListener("message", (event) => {
      console.log("Получены данные", event.data);
    });

    socket.addEventListener("error", (event) => {
      console.log("Ошибка", event.message);
    });
  } catch (err) {
    console.log(err);
  }
}

// const mapEventsToProps = {
//   mapPropsToValues: () => ({
//     items: [],
//   }),
//   events: {
//     "unic-messenger.message": (body) => console.log(body, " djbdb"),
//   },
// };

// export default mapEventsToProps;

export default clickChat;
