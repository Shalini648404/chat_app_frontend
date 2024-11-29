# Real-Time Chat Application Frontend

## Overview

This is the frontend of the **Real-Time Chat Application**. It facilitates communication between the user and the server using WebSocket, and provides a responsive user interface where users can send and receive chat messages. It also includes additional features like dark/light mode and session management.

## Features

- **User Authentication**: Users can log in using their username and email, with data fetched from the Strapi backend.
- **Real-Time Messaging**: Messages sent by the user are echoed back by the server using WebSocket communication.
- **Responsive Design**: The interface is designed to work seamlessly across different screen sizes (mobile, tablet, desktop).
- **Dark/Light Mode**: Toggle between dark and light themes for better user experience.
- **Message Time Display**: Hover over a message to see the time it was sent.

## Requirements

- **React** (v18 or later)
- **React Router**
- **Axios** for API calls
- **WebSocket** for real-time communication
- **Material-UI** (optional, or any other UI library you choose)
- **CSS**/**Sass** for styling
- **Node.js** (v14 or later)

## Setup Instructions

### 1. Clone the Repository

git clone <repository-url>
cd frontend

### 2. Install Dependencies

Make sure you have Node.js installed, then run the following command to install the necessary dependencies:
npm install

### 3. Start the Development Server

Run the development server using:
npm start
This will start the application at http://localhost:3000.

### 4. Build for Production (Optional)
To build the project for production:

npm run build
The build will be generated in the build/ folder and is ready to be deployed.


## Application Flow

**Login**:The user enters their username and email. The frontend sends a request to the Strapi backend to verify the credentials.
**WebSocket Connection**: After a successful login, the user is connected to the WebSocket server, allowing them to send and receive messages in real time.
**Chat Interface**: The user interacts with the chat interface to send and receive messages, and the messages are echoed back by the server.
**Session Management**: The user can maintain their session across page reloads.

## UI Features
**Dark/Light Mode**: The user can toggle between dark and light mode using a button in the UI. The mode is persisted in the local storage so that the theme is remembered across sessions.
**Responsive Design**: The chat interface is designed to be fully responsive and works across mobile, tablet, and desktop screens.

## Testing
For testing, you can use Jest or React Testing Library. To run tests:

npm test

## Unit Tests
You can write unit tests for the components and business logic of the frontend, ensuring that:

**Authentication works as expected.**
**WebSocket communication is established and maintained.**
**UI components are rendered correctly.**

## Troubleshooting

## Common Issues and Fixes

**WebSocket Not Connecting:**
***Ensure that the backend is running and the WebSocket URL is correctly set in the .env file.***
***Verify that no firewalls or proxies are blocking WebSocket connections.***

**UI Layout Issues:**
***Check if the CSS media queries are properly set for different screen sizes.***
***Test responsiveness using browser developer tools to simulate mobile and tablet views.***

**Login Failure:**
***Ensure that the username and email match exactly with the data in the Strapi backend.***
***Verify that the backend is running and accessible at the configured URL.***

## Deployment
To deploy the frontend, you can use services like:

**Netlify**
**Vercel**
**GitHub Pages**

### Netlify Deployment Example:
Push your code to GitHub.
Connect your GitHub repository to Netlify.
Select the branch you want to deploy (e.g., main).
Build and deploy the app.
Netlify will automatically build and deploy the application every time you push changes to the connected branch.

## Additional Features (Optional)
Notifications: Add browser notifications when a new message is received.
Typing Indicator: Show a typing indicator when another user is typing a message.
Multiple Sessions: Allow users to open multiple chat sessions with the server.

## Acknowledgments
Strapi for the backend management system.
WebSocket for real-time communication.
Material-UI (or any UI library you may have used) for the user interface components.
