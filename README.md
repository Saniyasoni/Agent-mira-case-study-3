# 🏠 Agent Mira - Real Estate Chatbot

A full-stack real estate chatbot that helps users find homes based on their preferences. This application was built for the Agent Mira Case Study 3.

## ✨ Features

- **Conversational AI (NLP)**: Understands natural language to extract location, budget, and bedroom preferences (e.g., "Find me a 3 bed house in Miami under 500k").
- **Real-Time Search**: Instant dynamic filtering of properties by typing keywords.
- **Data Merging**: Fetches and joins property data dynamically from multiple simulated JSON endpoints.
- **Save & Persist**: Bookmarks properties directly into an auto-provisioned MongoDB database.
- **Compare Mode**: Side-by-side technical comparison of up to 4 different properties.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, CSS (Glassmorphism UI)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via `mongodb-memory-server` for zero-configuration testing)
- **Other Tools**: Axios, Mongoose, React Router

## 🚀 Getting Started

### 1. Start the Backend
Navigate to the backend folder, install dependencies, and run the server:
```bash
cd backend
npm install
npm run dev
```
*(Note: The backend automatically spins up an in-memory MongoDB database, so no local database installation is required!)*

### 2. Start the Frontend
In a separate terminal, navigate to the frontend folder, install dependencies, and start Vite:
```bash
cd frontend
npm install
npm run dev
```

### 3. Open the App
The frontend will run on `http://localhost:5174` (or 5173). 

## 🧠 Approach & Challenges
**Approach:** I structured the app as a monorepo with distinct frontend and backend folders. The backend handles the heavy lifting: reading 3 separate JSON data files, merging them on-the-fly, and providing REST APIs. Instead of enforcing rigid chatbot steps, I implemented a custom NLP utility in Node.js that parses sentences to make the bot feel alive and smart. 

**Challenges:** The main challenge was ensuring database consistency without requiring complex user setup. To solve this, I integrated `mongodb-memory-server`, allowing the app to run a full MongoDB instance directly in Node.js, providing persistence during the session without any tedious local database installations.
