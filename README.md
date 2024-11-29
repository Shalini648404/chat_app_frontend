# Real-Time Chat Application Backend

## Overview

This backend uses **Strapi**, a powerful open-source headless CMS, to manage user accounts and store chat data. It is hosted on **Render** and serves as the API provider for the frontend of the Real-Time Chat Application.

## Features

- **User Accounts**: Manage user data, including username and email, using Strapi's CMS.
- **Chat Data Storage**: Stores chat messages and session information.
- **WebSocket Communication**: Echoes messages sent by the frontend.
- **PostgreSQL Database**: Ensures efficient and reliable data storage.

## Requirements

- **Strapi**
- **Node.js** (v14 or later)
- **PostgreSQL**
- **Render Hosting** (or an alternative hosting platform)

## API Endpoints

### Accounts Endpoint

- **GET `/api/accounts`**: Fetches all user accounts.
  - Used for simple authentication by the frontend.

## Setup Instructions

### 1. Clone the Repository


git clone <repository-url>
cd backend

### 2. Install Dependencies

After navigating to the project directory, install all required dependencies:


npm install

### 3.Configure Environment Variables

Create a .env file in the root directory of the project and include the following configurations:
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=chat_db
DATABASE_USERNAME=your_db_username
DATABASE_PASSWORD=your_db_password
HOST=0.0.0.0
PORT=1337

Make sure the values match your PostgreSQL setup and preferred Strapi configuration.

### 4. Run the PostgreSQL Database
Ensure that PostgreSQL is installed and running on your machine. If needed, create a database named chat_db (or as specified in your .env file):

CREATE DATABASE chat_db;

### 5. Start the Backend Server
To start the development server, run:

npm run develop
This will start the Strapi backend in development mode, allowing you to access the admin panel and manage content.

The backend will be accessible at: http://localhost:1337
Strapi admin panel will be accessible at: http://localhost:1337/admin

### 6. Deploy the Application (Optional)
To deploy the backend to Render or another hosting service:

Follow Render's documentation to create a new web service.
Set up environment variables in Render's dashboard matching the ones in your .env file.
Deploy the backend by pushing your code to a repository connected to Render.

## Testing Instructions
Test API Endpoints: Use a tool like Postman or cURL to verify the functionality of the backend.
Test GET /api/accounts to ensure user data is fetched correctly.
Frontend Integration: Ensure that the frontend can successfully send WebSocket messages and retrieve data via the API.


## Troubleshooting

### Common Issues and Fixes

#### 1. Database Connection Errors

Verify that PostgreSQL is running
Ensure that the PostgreSQL service is running on your machine or server. You can check its status using the following command (for Linux/macOS)

  #### 2. Port Already in Use:

Check if another service is using port 1337 and free it or change the port in the .env file.

#### 3.Deployment Issues:

Double-check environment variables are configured correctly on the hosting platform.
Ensure the correct PostgreSQL version is used (as per Strapi's requirements).
