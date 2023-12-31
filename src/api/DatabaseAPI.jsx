const API_URL = "https://unicmessenger.ru/database";
class DatabaseAPI {
  getUser(username) {
    try {
      return fetch(`${API_URL}/users/${username}`);
    } catch (error) {
      console.log("User cannot be found:", error);
    }
  }
  createUser(data) {
    return fetch(`${API_URL}/users/signup`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
  signInUser(data) {
    return fetch(`${API_URL}/users/signin`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
  verifyToken() {
    return fetch(`${API_URL}/users/login/verifyToken`);
  }
  logOut() {
    return fetch(`${API_URL}/login/logout`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }
  updateUser(username, data) {
    return fetch(`${API_URL}/users/${username}`, {
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
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
