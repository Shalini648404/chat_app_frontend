import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMessages, saveMessage } from "../../services/api"; // Updated API functions
import { connectToWebSocket } from "../../services/websocket";
import "./ChatPage.css"; // For styling

function ChatPage() {
  const navigate = useNavigate();
  const [currentFriend, setCurrentFriend] = useState("Alice"); // Default friend
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [webSocket, setWebSocket] = useState(null);

  const friends = ["Alice", "Bob", "John"];
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:1337/api/accounts/me", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch user data");
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("User not authenticated, redirecting to login:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  // Fetch messages for the selected friend
  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!user) return;

      try {
        const response = await fetchMessages(user.username, currentFriend);
        setMessages(response);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchChatMessages();
  }, [user, currentFriend]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!user) return;

    const ws = connectToWebSocket((data) => {
      const { context, sender, receiver, timestamp } = data;
      if (
        (sender === user.username && receiver === currentFriend) ||
        (sender === currentFriend && receiver === user.username)
      ) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { context, sender, receiver, timestamp },
        ]);
      }
    });

    setWebSocket(ws);

    return () => {
      ws.close();
    };
  }, [user, currentFriend]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;

    const timestamp = new Date().toISOString();
    const newMessage = {
      context: message,
      sender: user.username,
      receiver: currentFriend,
      timestamp,
    };

    try {
      await saveMessage(newMessage); // Save to database
      webSocket.send(JSON.stringify(newMessage)); // Send via WebSocket
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleLogout = () => {
    fetch("http://localhost:1337/api/accounts/logout", {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      navigate("/login");
    });
  };

  return (
    <div className="chat-page">
      <header className="chat-header">
        <h1>Chat with {currentFriend}</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>
      <div className="friends-list">
        {friends.map((friend) => (
          <button
            key={friend}
            className={`friend-btn ${currentFriend === friend ? "active" : ""}`}
            onClick={() => setCurrentFriend(friend)}
          >
            {friend}
          </button>
        ))}
      </div>
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.sender === user.username ? "sent" : "received"
              }`}
            >
              <p>{msg.context}</p>
              <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
