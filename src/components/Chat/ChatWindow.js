/*import React, { useState, useEffect } from "react";

const ChatWindow = ({ selectedChat, user }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null); // Storing WebSocket instance in state

  useEffect(() => {
    // Initialize WebSocket connection when component mounts
    const socket = new WebSocket("ws://localhost:4000");

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      console.log("Message received:", event.data);
      setMessages((prev) => [...prev, event.data]); // Update messages on receiving data
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    // Store the WebSocket instance in the state
    setWs(socket);

    // Cleanup WebSocket connection when component unmounts
    return () => {
      socket.close();
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const handleSendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message); // Send the message to the WebSocket server
      setMessages((prev) => [...prev, message]); // Optimistically update UI
      setMessage(""); // Clear input field
    } else {
      console.error("WebSocket is not connected");
    }
  };

  return (
    <div className="chat-window">
      <h3>Chat with {selectedChat}</h3>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            {msg}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;*/
import React, { useState, useEffect, useRef } from "react";

const ChatWindow = ({ user }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [selectedFriend, setSelectedFriend] = useState(null);
  const ws = useRef(null); // Use useRef to persist WebSocket connection
  const friends = ["Alice", "John", "Bob"];

  // Handle switching between friends and WebSocket connection
  useEffect(() => {
    if (selectedFriend) {
      // Only connect to WebSocket if not already connected
      if (!ws.current) {
        ws.current = new WebSocket("ws://localhost:4000");

        ws.current.onopen = () => {
          console.log("WebSocket connected");
        };

        ws.current.onmessage = (event) => {
          console.log("Message received:", event.data);
          setMessages((prevMessages) => {
            const updatedMessages = { ...prevMessages };
            if (!updatedMessages[selectedFriend]) {
              updatedMessages[selectedFriend] = [];
            }
            updatedMessages[selectedFriend].push(event.data);
            return updatedMessages;
          });
        };

        ws.current.onclose = () => {
          console.log("WebSocket disconnected");
        };
      }

      // Load existing messages for the selected friend
      const storedMessages = localStorage.getItem(selectedFriend);
      if (storedMessages) {
        setMessages({
          ...messages,
          [selectedFriend]: JSON.parse(storedMessages),
        });
      } else {
        setMessages({
          ...messages,
          [selectedFriend]: [],
        });
      }

      return () => {
        // Close WebSocket when the component unmounts or when friend changes
        if (ws.current) {
          ws.current.close();
          ws.current = null;
        }
      };
    }
  }, [selectedFriend]);

  const handleSendMessage = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN && selectedFriend) {
      // Send the message to the WebSocket server
      ws.current.send(message);

      // Optimistically update UI with the new message
      setMessages((prevMessages) => {
        const updatedMessages = { ...prevMessages };
        if (!updatedMessages[selectedFriend]) {
          updatedMessages[selectedFriend] = [];
        }
        updatedMessages[selectedFriend].push(message);
        return updatedMessages;
      });

      // Store message in localStorage and Strapi
      localStorage.setItem(
        selectedFriend,
        JSON.stringify(messages[selectedFriend] || [])
      );

      // Store message in Strapi (via API call to backend)
      fetch("http://localhost:1337/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: user.username,
          receiver: selectedFriend,
          content: message,
          timestamp: new Date().toISOString(),
        }),
      }).then((response) => {
        console.log("Message stored in Strapi:", response);
      });

      setMessage(""); // Clear the input field
    } else {
      console.error("WebSocket is not connected");
      alert("WebSocket is not connected. Please try again later.");
    }
  };

  const handleFriendSelect = (friend) => {
    setSelectedFriend(friend); // Switch to the selected friend
  };

  return (
    <div className="chat-window">
      {/* Friend Selection */}
      <div className="friend-selection">
        <h3>Select a friend to chat:</h3>
        {friends.map((friend) => (
          <button
            key={friend}
            onClick={() => handleFriendSelect(friend)}
            className={selectedFriend === friend ? "selected" : ""}
          >
            {friend}
          </button>
        ))}
      </div>

      {/* Chat with selected friend */}
      {selectedFriend && (
        <>
          <h3>Chat with {selectedFriend}</h3>
          <div className="chat-messages">
            {(messages[selectedFriend] || []).map((msg, index) => (
              <div key={index} className="chat-message">
                {msg}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWindow;
