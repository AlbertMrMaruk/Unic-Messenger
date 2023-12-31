const API_URL = "https://unicmessenger.ru";
class ChatsAPI {
  replyTo(message, phone, session, replyMessage) {
    const data = {
      session,
      chatId: `${phone}`,
      text: message,
      reply_to: replyMessage.id,
    };
    fetch(`${API_URL}/api/reply`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    });
  }
  sendReaction(messageId, reaction, session) {
    return fetch(`${API_URL}/api/reaction`, {
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messageId,
        session,
        reaction,
      }),
    });
  }
  getAvatar(chatId, session) {
    return fetch(
      `${API_URL}/api/contacts/profile-picture?contactId=${chatId}&session=${session}`
    );
  }
  startSession = (phone) => {
    return fetch(`${API_URL}/api/sessions/start`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      // make sure to serialize your JSON body
      body: JSON.stringify({
        name: phone,
        config: {
          proxy: null,
          webhooks: [
            {
              url: `${API_URL}/post/${phone}`,
              events: ["message.any"],
              hmac: null,
              retries: {
                delaySeconds: 2,
                attempts: 15,
              },
              customHeaders: null,
            },
          ],
        },
      }),
    });
  };
  stopSession = (phone) => {
    console.log(phone);
    return fetch(`${API_URL}/api/sessions/stop`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      // make sure to serialize your JSON body
      body: JSON.stringify({
        logout: false,
        name: phone,
      }),
    });
  };
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
    return fetch(`${API_URL}/api/startTyping`, {
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
    return fetch(`${API_URL}/api/stopTyping`, {
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
    console.log(data);
    return fetch(`${API_URL}/api/sendImage`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      //make sure to serialize your JSON body
      body: JSON.stringify(data),
    });
  }
  sendVoice(data, currentChat, session) {
    return fetch(`${API_URL}/api/sendVoice`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      //make sure to serialize your JSON body
      body: JSON.stringify({
        chatId: currentChat,
        file: {
          mimetype: "audio/ogg; codecs=opus ",
          filename: "voice-message-" + Date.now() + ".mp3",
          data,
        },
        session,
      }),
    });
  }
  sendSeen(phone, session) {
    return fetch(`${API_URL}/api/sendSeen`, {
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
      `${API_URL}/api/${session}/chats/${id}/messages?downloadMedia=true&limit=${limit}`
    );
  }
  getContacts(session) {
    return fetch(`${API_URL}/api/contacts/all?session=${session}`);
  }
  getChats(session) {
    return fetch(`${API_URL}/api/${session}/chats`);
  }
  deleteMessages(session, chatId) {
    return fetch(`${API_URL}/api/${session}/chats/${chatId}/messages`, {
      method: "delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }
  deleteChat(session, chatId) {
    return fetch(`${API_URL}/api/${session}/chats/${chatId}`, {
      method: "delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }
}

export default new ChatsAPI();
