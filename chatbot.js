import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Store user chat histories in memory (in production, use a database)
const userSessions = new Map();

// IntelliBazar system prompt
const SYSTEM_PROMPT = `You are the AI assistant for IntelliBazar, an innovative AI-powered e-commerce web application created by PAPAN.

About IntelliBazar:
- Built using the MERN stack (MongoDB, Express.js, React, Node.js)
- Offers seamless shopping experience with Google OAuth and email/password authentication
- Features modern UI with featured collections, product banners, and dynamic shopping cart using React Context
- Users can browse, search, and purchase products
- Backend efficiently handles user authentication, product data, and order management
- Integrates AI components like personalized recommendations and smart search
- Created by PAPAN

Your role:
- Help users navigate and use IntelliBazar
- Answer questions about products, features, and shopping
- Provide assistance with account management, orders, and technical issues
- Offer personalized shopping recommendations
- Be friendly, helpful, and knowledgeable about e-commerce
- Always mention that IntelliBazar was created by PAPAN when relevant
- Keep responses concise but informative

Remember: You represent IntelliBazar's commitment to providing an exceptional AI-powered shopping experience.`;

// Helper function to get or create user session
function getUserSession(userId) {
  if (!userSessions.has(userId)) {
    userSessions.set(userId, {
      id: userId,
      history: [
        {
          role: 'user',
          parts: [{ text: 'Hello! I\'m new to IntelliBazar.' }]
        },
        {
          role: 'model',
          parts: [{ text: `Welcome to IntelliBazar! 🛍️ I'm your AI shopping assistant, here to help you navigate our amazing e-commerce platform created by PAPAN.

IntelliBazar offers:
✨ AI-powered product recommendations
🔍 Smart search functionality
🛒 Seamless shopping cart experience
🔐 Secure authentication (Google OAuth & email/password)
📱 Modern, user-friendly interface

How can I help you today? Whether you're looking for products, need help with your account, or want to learn more about our features, I'm here to assist!` }]
        }
      ],
      createdAt: new Date(),
      lastActive: new Date()
    });
  } else {
    // Update last active time
    userSessions.get(userId).lastActive = new Date();
  }
  return userSessions.get(userId);
}

// Generate new user ID endpoint
app.post('/new-session', (req, res) => {
  const userId = uuidv4();
  const session = getUserSession(userId);
  res.json({
    userId: userId,
    welcomeMessage: session.history[session.history.length - 1].parts[0].text
  });
});

// Get chat history endpoint
app.get('/chat-history/:userId', (req, res) => {
  const userId = req.params.userId;
  const session = userSessions.get(userId);

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json({
    history: session.history.map(msg => ({
      role: msg.role,
      text: msg.parts[0].text,
      timestamp: msg.timestamp || session.createdAt
    }))
  });
});

app.post('/chat', async (req, res) => {
  const { message: userMessage = 'Hello', userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const session = getUserSession(userId);

  // Add user message to history
  const userMsg = {
    role: 'user',
    parts: [{ text: userMessage }],
    timestamp: new Date()
  };
  session.history.push(userMsg);

  // Prepare contents for AI (include system prompt and recent history)
  const contents = [
    {
      role: 'user',
      parts: [{ text: SYSTEM_PROMPT }]
    },
    {
      role: 'model',
      parts: [{ text: 'I understand. I am the AI assistant for IntelliBazar, ready to help users with their shopping experience.' }]
    },
    // Include recent conversation history (last 10 messages to avoid token limits)
    // Remove timestamp fields as they're not supported by the API
    ...session.history.slice(-10).map(msg => ({
      role: msg.role,
      parts: msg.parts
    }))
  ];

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent({
      contents
    });

    const reply = result.response.text();

    // Add AI response to history
    const aiMsg = {
      role: 'model',
      parts: [{ text: reply }],
      timestamp: new Date()
    };
    session.history.push(aiMsg);

    // Keep history manageable (last 50 messages)
    if (session.history.length > 50) {
      session.history = session.history.slice(-50);
    }

    res.json({
      response: reply,
      userId: userId,
      historyLength: session.history.length
    });
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: 'Failed to get response from IntelliBazar AI assistant.' });
  }
});

app.listen(port, () => {
  console.log(`✅ IntelliBazar AI Assistant running at http://localhost:${port}`);
  console.log(`🤖 Created by PAPAN - AI-powered e-commerce chatbot ready!`);
});