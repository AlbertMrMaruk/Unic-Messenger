const API_URL = "http://89.111.131.15";
class ChatsAPI {
  async sendText(message, phone) {
    try {
      await fetch(`${API_URL}/api/sendText`, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          session: "default",
          chatId: `${phone}`,
          text: message,
        }),
      }).then((response) => {
        return response;
      });
    } catch (error) {
      console.log("Err", error);
    }
  }
  getMessages(id, limit) {
    return fetch(
      `http://89.111.131.15/api/default/chats/${id}/messages?downloadMedia=true&limit=${limit}`
    );
  }
}

export default new ChatsAPI();
