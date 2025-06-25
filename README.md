# IntelliBazar AI Assistant

An AI-powered chatbot for IntelliBazar e-commerce platform, created by **PAPAN**.

## About IntelliBazar

IntelliBazar is an innovative AI-powered e-commerce web application built using the MERN stack (MongoDB, Express.js, React, Node.js). It offers a seamless shopping experience with both Google OAuth and email/password authentication. The app features a modern UI with featured collections, product banners, and a dynamic shopping cart using React Context.

## Features

### 🤖 AI Assistant Capabilities
- **Personalized Shopping Help**: Get product recommendations and shopping assistance
- **Smart Search Support**: Help with finding products and navigating the platform
- **Account Management**: Assistance with orders, authentication, and account issues
- **Feature Guidance**: Learn about IntelliBazar's features and capabilities

### 🔧 Technical Features
- **User Session Management**: Each user gets a unique session ID
- **Chat History**: Maintains conversation history for each user
- **Context Awareness**: AI remembers previous conversations within a session
- **Modern UI**: Beautiful, responsive chat interface
- **Real-time Messaging**: Instant responses with typing indicators

## API Endpoints

### POST `/new-session`
Creates a new user session and returns a unique user ID.

**Response:**
```json
{
  "userId": "uuid-string",
  "welcomeMessage": "Welcome message..."
}
```

### POST `/chat`
Send a message to the AI assistant.

**Request:**
```json
{
  "message": "Your message here",
  "userId": "user-session-id"
}
```

**Response:**
```json
{
  "response": "AI response",
  "userId": "user-session-id",
  "historyLength": 4
}
```

### GET `/chat-history/:userId`
Retrieve chat history for a specific user session.

**Response:**
```json
{
  "history": [
    {
      "role": "user|model",
      "text": "Message content",
      "timestamp": "2025-06-25T08:48:26.531Z"
    }
  ]
}
```

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Start the Server**
   ```bash
   npm start
   ```

4. **Access the Application**
   Open your browser and go to `http://localhost:3000`

## Technology Stack

- **Backend**: Node.js, Express.js
- **AI**: Google Gemini 1.5 Flash
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Session Management**: In-memory storage (UUID-based)
- **Styling**: Modern CSS with gradients and animations

## Usage

1. **Open the Application**: Navigate to `http://localhost:3000`
2. **Automatic Session**: A unique session is created automatically
3. **Start Chatting**: Type your questions about IntelliBazar and get instant AI responses
4. **Persistent History**: Your conversation history is maintained throughout the session

## Created By

**PAPAN** - AI-powered e-commerce solutions

---

*IntelliBazar AI Assistant - Your intelligent shopping companion* 🛍️
