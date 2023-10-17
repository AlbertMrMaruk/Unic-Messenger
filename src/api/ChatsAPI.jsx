const API_URL = "http://89.111.131.15";
class ChatsAPI {
  async sendText(message, phone, session, replyMessage) {
    try {
      const data = {
        session,
        chatId: `${phone}`,
        text: message,
      };
      if (replyMessage) data.reply_to = replyMessage.id;
      console.log(data);
      await fetch(`${API_URL}/api/sendText`, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          session,
          chatId: `${phone}`,
          text: message,
          replyMessage,
        }),
      }).then((response) => {
        return response;
      });
    } catch (error) {
      console.log("Err", error);
    }
  }
  startTyping(phone, session) {
    return fetch(`http://89.111.131.15/api/startTyping`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        session,
        chatId: `${phone}`,
      }),
    });
  }
  stopTyping(phone, session) {
    return fetch(`http://89.111.131.15/api/stopTyping`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        session,
        chatId: `${phone}`,
      }),
    });
  }
  sendImage(data, replyMessage) {
    if (replyMessage) data.reply_to = replyMessage.id;
    return fetch(`http://89.111.131.15/api/sendImage`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      //make sure to serialize your JSON body
      body: JSON.stringify(data),
    });
  }
  sendSeen(phone, session) {
    return fetch(`http://89.111.131.15/api/sendSeen`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        session,
        chatId: `${phone}`,
      }),
    });
  }
  getMessages(id, limit, session) {
    return fetch(
      `http://89.111.131.15/api/${session}/chats/${id}/messages?downloadMedia=true&limit=${limit}`
    );
  }
}

export default new ChatsAPI();
