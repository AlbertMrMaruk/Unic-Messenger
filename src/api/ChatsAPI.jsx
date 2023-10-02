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

        //make sure to serialize your JSON body
        body: JSON.stringify({
          session: "default",
          chatId: `${phone}`,
          text: message,
        }),
      }).then((response) => {
        //do something awesome that makes the world a better place
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
