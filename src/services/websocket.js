
  export const connectToWebSocket = (onMessage) => {
    const ws = new WebSocket("wss://websockerserver.onrender.com/4000");
  
    // Listen for messages from the server
    ws.onmessage = (event) => {
      onMessage(event.data);
    };
  
    // Handle connection errors
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  
    // Log successful connection
    ws.onopen = () => {
      console.log("WebSocket connection established");
    };
  
    // Handle disconnection
    ws.onclose = (event) => {
      console.log("WebSocket connection closed:", event.reason || "No reason provided");
    };
  
    return ws;
  };
  
  