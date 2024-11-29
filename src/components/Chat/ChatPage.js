import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { connectToWebSocket } from "../../services/websocket";
import { fetchMessages, saveMessage } from "../../services/api";
import "./ChatPage.css";
import { FaMoon, FaSun } from "react-icons/fa"; // Import icons

const friends = [
  { name: "Alice", image: "/Images/alice.png", online: true },
  { name: "Bob", image: "/Images/bob.png", online: true },
  { name: "John", image: "/Images/john.png", online: true },
];

function ChatPage() {
  const [selectedFriend, setSelectedFriend] = useState(friends[0]);
  const [messages, setMessages] = useState({});
  const [currentMessage, setCurrentMessage] = useState("");
  const [webSocket, setWebSocket] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const yourUsername = location.state?.username;
  const yourImage = "../Images/profile-picture.png";

  useEffect(() => {
    const ws = connectToWebSocket((message) => {
      const newMessage = {
        text: message,
        sender: selectedFriend.name,
        receiver: yourUsername,
        timestamp: new Date().toISOString(),
      };

      saveMessage({
        sender: selectedFriend.name,
        receiver: yourUsername,
        content: message,
        timestamp: new Date().toISOString(),
      });

      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedFriend.name]: [
          ...(prevMessages[selectedFriend.name] || []),
          newMessage,
        ],
      }));
    });

    setWebSocket(ws);

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFriend]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetchMessages(yourUsername, selectedFriend.name);
        setMessages((prevMessages) => ({
          ...prevMessages,
          [selectedFriend.name]: response.map((msg) => ({
            text: msg.context,
            sender: msg.sender === yourUsername ? "you" : msg.sender,
            timestamp: msg.timestamp,
          })),
        }));
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    loadMessages();// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFriend]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const timestamp = new Date().toISOString();

    webSocket.send(currentMessage);

    setMessages((prevMessages) => ({
      ...prevMessages,
      [selectedFriend.name]: [
        ...(prevMessages[selectedFriend.name] || []),
        { text: currentMessage, sender: "you", timestamp },
      ],
    }));

    try {
      await saveMessage({
        sender: yourUsername,
        receiver: selectedFriend.name,
        content: currentMessage,
        timestamp,
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }

    setCurrentMessage("");
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    const body = document.body;

    if (!isDarkMode) {
      body.classList.add("dark-mode");
      body.classList.remove("light-mode");
    } else {
      body.classList.add("light-mode");
      body.classList.remove("dark-mode");
    }
  };

  return (
    <div className={`chat-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      {/* Theme Toggle Icon */}
      <div className="theme-toggle-icon" onClick={toggleDarkMode}>
        {isDarkMode ? <FaSun size={24} color="#ffd700" /> : <FaMoon size={24} />}
      </div>

      <div className="sidebar">
        <h3>Friends</h3>
        <ul className="friend-list">
          {friends.map((friend) => (
            <li
              key={friend.name}
              className={`friend-item ${friend.name === selectedFriend.name ? "active" : ""}`}
              onClick={() => setSelectedFriend(friend)}
            >
              <img src={friend.image} alt={friend.name} className="friend-avatar" />
              <div>
                <span>{friend.name}</span>
                <span className={`status ${friend.online ? "online" : "offline"}`}>
                  {friend.online ? "Online" : "Offline"}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="chat-section">
        <h3>Chat with {selectedFriend.name}</h3>
        <div className="messages">
          {messages[selectedFriend.name]?.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === "you" ? "sent" : "received"}`}
            >
              <img
                src={msg.sender === "you" ? yourImage : selectedFriend.image}
                alt={msg.sender}
                className="message-avatar"
              />
              <div className="message-content">
                <p>{msg.text}</p>
                <span className="timestamp">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="message-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
