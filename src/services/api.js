import axios from "axios";

const API_BASE_URL = "http://localhost:1337/api"; // Strapi API base URL

// Sign Up a new user
export const signUp = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/accounts`, {
      data: { username, email, password },
    });
    return response.data;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

// Log in a user
export const logIn = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/local`, {
      identifier: username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};


export const saveMessage = async (messageData) => {
  try {
    const response = await fetch("http://localhost:1337/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          context: messageData.content, // Message content
          timestamp: messageData.timestamp, // Timestamp of the message
          sender: messageData.sender, // Sender's identifier
          receiver: messageData.receiver, // Receiver's identifier
        },
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return data; // Return the response data if the request was successful
    } else {
      console.error("Failed to save message", data); // Log an error if something went wrong
      return null;
    }
  } catch (error) {
    console.error("Error saving message:", error); // Catch and log any network or other errors
    return null;
  }
};



// Fetch messages between sender and receiver
export const fetchMessages = async (sender, receiver) => {
  try {
    const response = await fetch(
      `http://localhost:1337/api/messages?filters[$or][0][sender][$eq]=${sender}&filters[$or][0][receiver][$eq]=${receiver}&filters[$or][1][sender][$eq]=${receiver}&filters[$or][1][receiver][$eq]=${sender}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();
    if (response.ok) {
      return data.data;
    } else {
      console.error("Failed to fetch messages", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

    


// Send a new message to the backend
export const sendMessage = async (messageData) => {
  try {
    const response = await fetch("http://localhost:1337/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          context: messageData.content,
          timestamp: new Date().toISOString(),
          sender: messageData.sender,
          receiver: messageData.receiver,
        },
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error("Failed to send message", data);
      return null;
    }
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
};
