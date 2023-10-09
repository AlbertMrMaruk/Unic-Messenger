const API_URL = "http://89.111.131.15/database";
class DatabaseAPI {
  getUser(username) {
    try {
      return fetch(`${API_URL}/users/${username}`);
    } catch (error) {
      console.log("User cannot be found:", error);
    }
  }
  getChat(id, chatId) {
    return fetch(`${API_URL}/users/${id}/${chatId}`);
  }
  addUser(data) {
    return fetch(`${API_URL}/users`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
}

export default new DatabaseAPI();