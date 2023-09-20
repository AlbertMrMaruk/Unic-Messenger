import withPusher from "react-pusher-hoc";

function clickChat() {
  try {
    const socket = new WebSocket(`wss://unic-messenger.vercel.app/`);
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

    // socket.addEventListener("error", (event) => {
    //   console.log("Ошибка", event.message);
    // });
  } catch (err) {
    console.log(err);
  }
}

const mapEventsToProps = {
  mapPropsToValues: (props) => ({
    items: [],
  }),
  events: {
    "unic-messenger.add": (item, state, props) => ({
      items: state.items.concat(item),
    }),
  },
};

export default clickChat;
