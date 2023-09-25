const API_URL = "http://89.111.131.15:8080";
class ChatsAPI {
  async sendText(message, phone) {
    try {
      await fetch(`${API_URL}/api/sendText`, {
        mode: "no-cors",
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        //make sure to serialize your JSON body
        body: JSON.stringify({
          session: "default",
          chatId: `${phone}@c.us`,
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
}

export default new ChatsAPI();
