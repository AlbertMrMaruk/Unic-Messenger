const API_URL = "http://89.111.131.15";
class ChatsAPI {
  replyTo(message, phone, session, replyMessage) {
    const data = {
      session,
      chatId: `${phone}`,
      text: message,
      reply_to: replyMessage.id,
    };
    fetch(`${API_URL}/api/sendText`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    });
  }
  async sendText(message, phone, session) {
    try {
      const data = {
        session,
        chatId: `${phone}`,
        text: message,
      };
      await fetch(`${API_URL}/api/sendText`, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
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
  sendImage(data) {
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
